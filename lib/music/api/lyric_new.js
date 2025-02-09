// 新版歌词 - 包含逐字歌词
import request from "@/lib/music/request"
import {createOption} from "@/lib/music/util"

export default function (query) {
    const data = {
        id: query.id,
        cp: false,
        tv: 0,
        lv: 0,
        rv: 0,
        kv: 0,
        yv: 0,
        ytv: 0,
        yrv: 0,
    }
    return request(`/api/song/lyric/v1`, data, createOption(query))
}
