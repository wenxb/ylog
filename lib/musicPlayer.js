import {Howl, Howler} from "howler"
import {getBlobUrlFromUrl, getNormalSongUrl, getSongPlayTime, parseLyric} from "@/lib/music/util"
import axios from "axios"
import {useMusicDataStore, useMusicStateStore} from "@/stores/music"

let player
// 时长定时器
let seekInterval
let justSeekInterval
//听歌打卡
let scrobbleTimeout
let lock = false

export const initPlayer = async () => {
    if (player) soundStop()
    if (lock) return
    lock = true

    const musicState = useMusicStateStore.getState()
    const musicData = useMusicDataStore.getState()

    const playSongData = musicData.playSongData
    const songId = playSongData?.id

    musicState.setIsLoading(true)

    // 获取播放链接
    let songUrl
    try {
        const url = await getNormalSongUrl(songId)
        songUrl = await getBlobUrlFromUrl(url)
    } catch (error) {
        musicState.setIsPlaying(false)
        console.error("获取歌曲地址遇到错误：" + error)
        throw error
    }

    if (!songUrl) {
        lock = false
        return
    }

    try {
        // 初始化播放器
        player = new Howl({
            src: [songUrl],
            format: ["mp3", "flac", "dolby", "webm"],
            html5: true,
            preload: "metadata",
            volume: musicState.playVolume,
        })

        // 允许跨域
        const audioDom = player._sounds?.[0]?._node
        if (audioDom) audioDom.crossOrigin = "anonymous"

        player?.once("load", () => {
            fadePlayOrPause("play")
            musicState.setIsLoading(false)

            // 听歌打卡
            if (songId) {
                clearTimeout(scrobbleTimeout)
                scrobbleTimeout = setTimeout(async () => {
                    await songScrobble(songId, 0, 5)
                }, 5000)
            }
        })

        // 开始播放
        player?.on("play", () => {
            setAllInterval()
            musicState.setIsPlaying(true)
        })
        // 暂停播放
        player?.on("pause", () => {
            cleanAllInterval()
            musicState.setIsPlaying(false)
        })

        // 结束播放
        player?.on("end", () => {
            cleanAllInterval()
            // 下一曲
            changePlayIndex()
        })
        // 加载失败
        player?.on("loaderror", (id, errCode) => {
            console.log("播放出现错误：", id, errCode)
            musicState.setIsPlaying(false)
        })

        // 获取歌词
        await getSongLyricData(playSongData)
        // 初始化媒体会话控制
        await initMediaSession(playSongData)
    } catch (error) {
        musicState.setIsPlaying(false)
        console.error("播放遇到错误：" + error)
        throw error
    } finally {
        lock = false
    }
}

/**
 * 播放或暂停
 */
export const playOrPause = async () => {
    if (!player) return await initPlayer(true)
    fadePlayOrPause(player?.playing() ? "pause" : "play")
}

/**
 * 获取歌曲的歌词数据并解析
 * @param {object} data - 歌曲的数据
 */
const getSongLyricData = async (data) => {
    if (!data?.id) return false
    try {
        const musicData = useMusicDataStore.getState()
        musicData.setDefaultPlaySongLyric()

        const lyricResponse = await axios
            .get("/api/music/getLyric", {
                params: {
                    id: data?.id,
                },
            })
            .then((res) => res.data)

        if (lyricResponse?.lrc) {
            const result = parseLyric(lyricResponse)
            if (result) {
                musicData.setPlaySongLyric(result)
            }
        }
    } catch (err) {
        console.error("歌词处理出错：", err)
    }
}

/**
 * 初始化媒体会话控制
 * 如果浏览器支持媒体会话控制（ Media Session API ），则关联各类操作
 * @param {object} data - 当前播放数据
 */
const initMediaSession = async (data) => {
    if ("mediaSession" in navigator) {
        // 歌曲信息
        navigator.mediaSession.metadata = new MediaMetadata({
            title: data.name,
            artist: data.artists?.map((a) => a.name)?.join(" & "),
            album: data.album?.name,
            artwork: [
                {
                    src: data.cover,
                    sizes: "300x300",
                },
            ],
        })
        // 按键关联
        navigator.mediaSession.setActionHandler("play", () => {
            fadePlayOrPause("play")
        })
        navigator.mediaSession.setActionHandler("pause", () => {
            fadePlayOrPause("pause")
        })
        navigator.mediaSession.setActionHandler("previoustrack", () => {
            changePlayIndex("prev", true)
        })
        navigator.mediaSession.setActionHandler("nexttrack", () => {
            changePlayIndex("next", true)
        })
    }
}

export function setPlayed(currentTime) {
    const musicState = useMusicStateStore.getState()

    musicState.setPlayTimeData({
        ...musicState.playTimeData,
        played: getSongPlayTime(currentTime),
    })
}

/**
 * 设置进度
 * @param {number} seek - 设置的进度值，0-1之间的浮点数
 */
export function setSeek(seek = 0) {
    const musicState = useMusicStateStore.getState()

    musicState.setPlayTimeData({
        ...musicState.playTimeData,
        currentTime: seek,
    })
    musicState.setCurrentTime(seek * 1000)
    const isPlaying = player?.playing()

    if (isPlaying) player?.pause()
    player?.seek(seek)
    if (isPlaying) player?.play()
}

/**
 * 设置音量
 * @param {number} volume - 设置的音量值，0-1之间的浮点数
 */
export const setVolume = (volume) => {
    const musicState = useMusicStateStore.getState()

    volume = Number(volume) || 0
    player?.volume(volume)
    musicState.setPlayVolume(volume)
}

/**
 * 在当前播放歌曲后添加
 * @param {Object} data - 歌曲信息
 * @param play
 */
export const addSongToNext = (data, play = false) => {
    try {
        const musicState = useMusicStateStore.getState()
        const musicData = useMusicDataStore.getState()
        // 更改播放模式
        musicState.setHasNextSong(true)
        // 查找是否存在于播放列表
        const index = musicData.playList.findIndex((v) => v.id === data.id)
        // 若存在
        if (index !== -1) {
            // 移动至当前歌曲的下一曲
            const currentSongIndex = musicState.playIndex
            const nextSongIndex = currentSongIndex + 1
            // 如果移动的位置不是当前位置，且不是最后一首歌曲
            if (index !== currentSongIndex && nextSongIndex < musicData.playList.length) {
                // 移动歌曲
                const tempList = [...musicData.playList]
                const newList = tempList.splice(nextSongIndex, 0, tempList.splice(index, 1)[0])
                musicData.setPlayList(newList)
            }
            // 更新播放索引
            if (play) {
                musicState.setPlayIndex(nextSongIndex)
            }
        }
        // 添加至播放列表
        else {
            const newList = [...musicData.playList].splice(musicState.playIndex + 1, 0, data)
            musicData.setPlayList(newList)

            if (play) musicState.setPlayIndex(musicState.playIndex + 1)
        }

        if (play) fadePlayOrPause("play")
    } catch (error) {
        console.error("添加播放歌曲失败：", error)
    }
}

/**
 * 插入当前歌曲并播放
 * @param data
 * @param id
 * @returns {Promise<void>}
 */
export const playSong = async (data, id) => {
    if (lock) return
    const musicData = useMusicDataStore.getState()
    const musicState = useMusicStateStore.getState()

    const index = data.findIndex((item) => item.id === id)

    if (musicData.playSongData?.id === id) {
        fadePlayOrPause(musicState.isPlaying ? "pause" : "play")
    } else {
        if (index !== -1) {
            const song = data[index]
            addSongToNext(song, true)
            musicData.setPlayList([...data])
            musicState.setPlayIndex(index)
            musicData.setPlaySongData(song)

            await initPlayer()
        }
    }
}

/**
 * 播放下一首或上一首歌曲
 * @param {string} type - 更改索引的类型  "next" / "prev"
 * @param play
 */
export const changePlayIndex = async (type = "next", play = false) => {
    const musicState = useMusicStateStore.getState()
    const musicData = useMusicDataStore.getState()

    // 解构音乐数据
    const {playList} = musicData
    const {playSongMode, hasNextSong, playIndex} = musicState
    // 清除定时器
    cleanAllInterval()
    fadePlayOrPause("pause")

    // 根据播放模式确定要操作的播放列表和其长度
    const listLength = playList?.length || 0
    let newPlayIndex = playIndex + (type === "next" ? 1 : -1) || 0
    // 根据播放歌曲模式执行不同的操作
    if (hasNextSong) {
        musicState.setPlayIndex(newPlayIndex)
        musicState.setHasNextSong(false)
    } else {
        if (playSongMode === "normal") {
            // 正常模式
            musicState.setPlayIndex(newPlayIndex)
        } else if (playSongMode === "random") {
            // 随机模式
            newPlayIndex = Math.floor(Math.random() * listLength)
            musicState.setPlayIndex(newPlayIndex)
        } else if (playSongMode === "repeat") {
            // 单曲循环模式
            setSeek()
            fadePlayOrPause("play")
        }
    }
    // 检查播放索引是否越界
    if (playSongMode !== "repeat") {
        if (newPlayIndex < 0) {
            newPlayIndex = listLength - 1
            musicState.setPlayIndex(newPlayIndex)
        } else if (newPlayIndex >= listLength) {
            newPlayIndex = 0
            musicState.setPlayIndex(newPlayIndex)
        }
        // 赋值当前播放歌曲信息
        const songData = playList?.[newPlayIndex]
        if (!songData) return

        musicData.setPlaySongData(songData)
        await initPlayer(play)
    }
}

/**
 * 听歌打卡
 * @param {number} id - 音乐ID
 * @param {number} sourceid - 来源ID
 * @param time
 */
const songScrobble = (id, sourceid = 0, time = 0) => {
    return axios({
        method: "GET",
        url: "/api/music/getScrobble",
        params: {
            id,
            sourceid,
            time,
        },
    })
}

/**
 * 音频渐入渐出
 * @param {String} [type="play"] - 渐入渐出
 */
export function fadePlayOrPause(type = "play") {
    const musicState = useMusicStateStore.getState()

    // 渐入
    if (type === "play") {
        if (player?.playing()) return
        player?.play()
        // 更新播放进度
        setAllInterval()
        player?.once("play", () => {
            player?.fade(0, musicState.playVolume, 150)
        })
    }
    // 渐出
    else if (type === "pause") {
        player?.once("fade", () => {
            player?.pause()
            cleanAllInterval()
        })
        player?.fade(musicState.playVolume, 0, 150)
    }
}

/**
 * 停止播放器
 */
export const soundStop = () => {
    Howler.unload()
    player?.unload()
}

export const playAllSongs = async (playlist) => {
    if (!playlist?.length) return
    const musicState = useMusicStateStore.getState()
    const musicData = useMusicDataStore.getState()

    musicData.setPlayList(playlist)
    musicData.setPlaySongData(playlist[0])
    musicState.setPlayIndex(0)

    await initPlayer()
}

/**
 * 更改播放进度
 */
const setAudioTime = () => {
    const musicState = useMusicStateStore.getState()

    if (player?.playing()) {
        const currentTime = player?.seek()
        const duration = player?._duration
        // 计算数据
        const bar = duration ? ((currentTime / duration) * 100).toFixed(2) : 0
        const played = getSongPlayTime(currentTime)
        const durationTime = getSongPlayTime(duration)

        musicState.setPlayTimeData({currentTime, duration, bar, played, durationTime})
    }
}

/**
 * 更改播放进度（频繁）
 */
export const justSetSeek = () => {
    const musicState = useMusicStateStore.getState()

    if (player?.playing()) {
        const seek = player?.seek()
        musicState.setPlaySeek(seek || 0)
        musicState.setCurrentTime(seek * 1000)
        requestAnimationFrame(justSetSeek)
    }
}

/*
 * 清除定时器
 */
const cleanAllInterval = () => {
    clearInterval(seekInterval)
    cancelAnimationFrame(justSeekInterval)
    seekInterval = null
    justSeekInterval = null
}

/**
 * 更新定时器
 */
const setAllInterval = () => {
    cleanAllInterval()
    // 启动定时器
    seekInterval = setInterval(() => setAudioTime(), 1000)
    justSeekInterval = requestAnimationFrame(justSetSeek)
}
