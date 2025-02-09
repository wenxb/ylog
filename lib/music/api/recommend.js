import request from "@/lib/music/request"
import {createOption} from "@/lib/music/util"

export const recommend_songs = (query) => {
    return request(`/api/v3/discovery/recommend/songs`, {}, createOption(query, "weapi"))
}

export const recommend_resource = (query) => {
    return request(`/api/v1/discovery/recommend/resource`, {}, createOption(query, "weapi"))
}
