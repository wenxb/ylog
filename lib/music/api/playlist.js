import request from "@/lib/music/request"
import {createOption} from "@/lib/music/util"

export const playlist_detail = (query) => {
    const data = {
        id: query.id,
        n: 100000,
        s: query.s || 8,
    }
    return request(`/api/v6/playlist/detail`, data, createOption(query))
}

export const playlist_track_all = (query) => {
    const data = {
        id: query.id,
        n: 100000,
        s: query.s || 8,
    }
    //不放在data里面避免请求带上无用的数据
    let limit = parseInt(query.limit) || Infinity
    let offset = parseInt(query.offset) || 0

    return request(`/api/v6/playlist/detail`, data, createOption(query)).then((res) => {
        let trackIds = res.body.playlist.trackIds
        let idsData = {
            c:
                "[" +
                trackIds
                    .slice(offset, offset + limit)
                    .map((item) => '{"id":' + item.id + "}")
                    .join(",") +
                "]",
        }

        return request(`/api/v3/song/detail`, idsData, createOption(query))
    })
}
