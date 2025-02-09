import {create} from "zustand"
import {persist} from "zustand/middleware"

// 默认歌词状态
const defaultPlaySongLyric = {
    hasLrcTran: false,
    hasLrcRoma: false,
    hasYrc: false,
    hasYrcTran: false,
    hasYrcRoma: false,
    hasPrevLrc: false,
    lrc: [],
    yrc: [],
}
export const useMusicDataStore = create((set) => ({
    // 当前播放列表
    playList: [],
    // 当前歌曲数据
    playSongData: {},
    // 当前歌曲歌词数据
    playSongLyric: {...defaultPlaySongLyric},

    // 设置播放列表
    setPlayList: (playList) => set({playList}),

    // 设置当前歌曲数据
    setPlaySongData: (playSongData) => set({playSongData}),

    // 设置当前歌曲歌词数据
    setPlaySongLyric: (playSongLyric) => set({playSongLyric}),

    // 重置歌词数据为默认值
    setDefaultPlaySongLyric: () => set({playSongLyric: {...defaultPlaySongLyric}}),
}))

const initialState = {
    showYrlics: false,
    playSongMode: "normal", // 假设 'normal' 是默认模式
    playVolume: 1, // 音量默认 1
    hasNextSong: false,
    playIndex: 0, // 当前播放的索引
    isPlaying: false, // 是否在播放
    playSeek: 0, // 播放进度
    currentTime: 0, // 当前时间
    isLoading: false, // 是否加载中
    playTimeData: {}, // 播放时间数据
}
export const useMusicStateStore = create(
    persist(
        (set) => ({
            ...initialState,
            // 设置显示歌词
            setShowYrlics: (showYrlics) => set({showYrlics}),
            // 设置播放模式
            setPlaySongMode: (playSongMode) => set({playSongMode}),
            // 设置播放音量
            setPlayVolume: (playVolume) => set({playVolume}),
            // 设置是否有下一首歌
            setHasNextSong: (hasNextSong) => set({hasNextSong}),
            // 设置播放索引
            setPlayIndex: (playIndex) => set({playIndex}),
            // 设置是否正在播放
            setIsPlaying: (isPlaying) => set({isPlaying}),
            // 设置播放进度
            setPlaySeek: (playSeek) => set({playSeek}),
            // 设置当前时间
            setCurrentTime: (currentTime) => set({currentTime}),
            // 设置加载状态
            setIsLoading: (isLoading) => set({isLoading}),
            // 设置播放时间数据
            setPlayTimeData: (playTimeData) => set({playTimeData}),
        }),
        {
            name: "music_state",
            partialize: (state) => ({
                playVolume: state.playVolume,
                showYrlics: state.showYrlics,
                playSongMode: state.playSongMode,
            }),
        }
    )
)
