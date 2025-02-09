import axios from "axios"

const resizeCoverUrl = (url, size = null) => {
    try {
        if (!url) return "https://p1.music.126.net/jWE3OEZUlwdz0ARvyQ9wWw==/109951165474121408.jpg?param=300y300"
        const sizeUrl = size ? (typeof size === "number" ? `?param=${size}y${size}` : `?param=${size}`) : ""
        const imageUrl = url?.replace(/^http:/, "https:")
        if (imageUrl.endsWith(".jpg")) {
            return imageUrl + sizeUrl
        }
        if (imageUrl.endsWith("&")) {
            const url = imageUrl + "cl"
            return url.replace(/(thumbnail=[0-9]+y[0-9]+&cl)/, `thumbnail=${size}y${size}&`)
        }
        return imageUrl
    } catch (error) {
        console.error("图片链接处理出错：", error)
        return "https://p1.music.126.net/jWE3OEZUlwdz0ARvyQ9wWw==/109951165474121408.jpg?param=300y300"
    }
}

export function getCoverUrl(item) {
    if (!item) return ""
    const imgUrl =
        item &&
        (item.picUrl ||
            item.coverUrl ||
            item.coverImgUrl ||
            item.imgurl ||
            item.cover ||
            (item.album && item.album.picUrl) ||
            (item.al && (item.al.picUrl || item.al.xInfo?.picUrl)))

    return resizeCoverUrl(imgUrl, 300)
}

/**
 * 歌曲时长时间戳转换
 * @param {number} mss 毫秒数
 * @returns {string} 格式为 "mm:ss" 的字符串
 */
export const getSongTime = (mss) => {
    if (!mss) return ""
    const minutes = Math.floor(mss / (1000 * 60))
    let seconds = Math.floor((mss % (1000 * 60)) / 1000)
    if (seconds < 10) {
        seconds = `0${seconds}`
    }
    return `${minutes}:${seconds}`
}

export const createOption = (query, crypto = "") => {
    return {
        crypto: query?.crypto || crypto || "",
        cookie: query?.cookie,
        ua: query?.ua || "",
        proxy: query?.proxy,
        realIP: query?.realIP,
        e_r: query?.e_r || undefined,
    }
}

/**
 * 获取音乐 URL
 * @param {number} id - 要获取音乐的 ID。
 * @param {string} [level=standard] - 播放音质等级 / standard: 标准 /  higher: 较高 / exhigh: 极高 / lossless: 无损 / hires: Hi-Res / jyeffect: 高清环绕声 / sky: 沉浸环绕声 / jymaster: 超清母带
 */
export const getSongUrl = (id, level = "standard") => {
    return axios({
        method: "GET",
        url: "/api/music/getSongUrl",
        params: {
            id,
            level,
        },
    }).then((res) => res.data)
}

/**
 * 获取普通模式下的音乐播放地址 音质等级: 标准,higher => 较高, exhigh=>极高, lossless=>无损, hires=>Hi-Res, jyeffect => 高清环绕声, sky => 沉浸环绕声, jymaster => 超清母带
 * @param {number} id - 歌曲 id
 * @returns {Promise<?string>} - 歌曲播放地址，如果获取失败或歌曲无法播放则返回 null
 */
export const getNormalSongUrl = async (id) => {
    const res = await getSongUrl(id, "standard")
    // 检查是否有有效的响应数据
    if (!res.data?.[0] || !res.data?.[0]?.url) return null
    // 检查是否只能试听
    if (res.data?.[0]?.freeTrialInfo !== null) return null
    // 返回歌曲地址，将 http 转换为 https
    return res.data[0].url.replace(/^http:/, "https:")
}

let lastSongBlobUrl = null

/**
 * 获取音频文件的 Blob 链接
 * @param {string} url - 音频文件的网络链接
 */
export const getBlobUrlFromUrl = async (url) => {
    try {
        if (!url) return null
        // 清理过期的 Blob 链接
        if (lastSongBlobUrl) URL.revokeObjectURL(lastSongBlobUrl)
        // 是否为网络链接
        if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("blob:")) {
            return url
        }
        // 获取音频文件数据
        const response = await fetch("/api/forward", {
            headers: {
                "x-forwarded-url": url,
            },
        })
        // 检查请求是否成功
        if (!response.ok) {
            return null
        }
        const blob = await response.blob()
        // 转换为本地 Blob 链接
        lastSongBlobUrl = URL.createObjectURL(blob)
        return lastSongBlobUrl
    } catch (error) {
        console.error("获取 Blob 链接遇到错误：" + error)
    }
}

/**
 * 歌曲播放时间转换
 * @param {number} num 歌曲播放时间，单位为秒
 * @returns {string} 格式为 "mm:ss" 的字符串
 */
export const getSongPlayTime = (num) => {
    const minutes = String(Math.floor(num / 60)).padStart(2, "0")
    const seconds = String(Math.floor(num % 60)).padStart(2, "0")
    return `${minutes}:${seconds}`
}

/**
 * 将歌词接口数据解析出对应数据
 * @param {string} data 接口数据
 */
export const parseLyric = (data) => {
    try {
        // 判断是否具有内容
        const checkLyric = (lyric) => (lyric ? !!lyric.lyric : false)
        // 初始化数据
        const {lrc, tlyric, romalrc, yrc, ytlrc, yromalrc} = data
        const lrcData = {
            lrc: lrc?.lyric || null,
            tlyric: tlyric?.lyric || null,
            romalrc: romalrc?.lyric || null,
            yrc: yrc?.lyric || null,
            ytlrc: ytlrc?.lyric || null,
            yromalrc: yromalrc?.lyric || null,
        }
        // 初始化输出结果
        const result = {
            // 是否具有普通翻译
            hasLrcTran: checkLyric(tlyric),
            // 是否具有普通音译
            hasLrcRoma: checkLyric(romalrc),
            // 是否具有逐字歌词
            hasYrc: checkLyric(yrc),
            // 是否具有逐字翻译
            hasYrcTran: checkLyric(ytlrc),
            // 是否具有逐字音译
            hasYrcRoma: checkLyric(yromalrc),
            // 普通歌词数组
            lrc: [],
            // 逐字歌词数据
            yrc: [],
        }

        if (lrcData.lrc) {
            result.lrc = lrcData.lrc
        }

        return result
    } catch (error) {
        console.error("解析歌词时出现错误：", error)
        return false
    }
}
