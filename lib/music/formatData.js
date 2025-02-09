import {getCoverUrl, getSongTime} from "@/lib/music/util"

export const formatData = (data, type = "song") => {
    if (!data) return []
    if (!Array.isArray(data)) data = [data]

    if (type === "song") {
        return data.map((item) => {
            if (type === "song")
                item?.songInfo ? (item = item.songInfo) : item?.simpleSong ? (item = item.simpleSong) : item

            return {
                id: item.id,
                name: item.name,
                artists: item.artists || item.ar,
                album: item.album || item.al,
                cover: getCoverUrl(item),
                avatar: item?.ar,
                duration: getSongTime(item.duration || item.dt),
            }
        })
    }

    return data
}
