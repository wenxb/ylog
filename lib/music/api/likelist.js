// 喜欢的歌曲(无序)
import {createOption} from "@/lib/music/util"
import request from "@/lib/music/request"

export default (query) => {
    const data = {
        uid: query.uid,
    }
    return request(`/api/song/like/get`, data, createOption(query))
}
