import request from "@/lib/music/request"
import {createOption} from "@/lib/music/util"

export function song_url_v1(query) {
    const data = {
        ids: "[" + query.id + "]",
        level: query.level,
        encodeType: "flac",
    }
    if (data.level === "sky") {
        data.immerseType = "c51"
    }
    return request(`/api/song/enhance/player/url/v1`, data, createOption(query))
}
