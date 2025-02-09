import {getCoverUrl} from "@/lib/music/util"
import {user_playlist} from "@/lib/music/api/user"
import {getGlobalMUID} from "@/lib/music"

export const revalidate = 120
export async function GET() {
    const userId = await getGlobalMUID()

    const playlistRes = await user_playlist({
        uid: userId,
        limit: 99,
        offset: 0,
    })

    const likeObj = {
        title: "我喜欢的音乐",
        cover: "",
        id: "",
    }
    const userPlaylist = playlistRes.body?.playlist
    if (userPlaylist?.length) {
        likeObj.cover = userPlaylist[0].coverImgUrl?.replace(/^http:/, "https:")
        likeObj.id = userPlaylist[0].id
    }

    return Response.json({
        like: likeObj,
        create: userPlaylist
            ? userPlaylist
                  .filter((item) => item.userId === userId)
                  .slice(1)
                  .map((item) => ({
                      cover: getCoverUrl(item),
                      id: item.id,
                      title: item.name,
                  }))
            : [],
        favorite: userPlaylist
            ? userPlaylist
                  .filter((item) => item.userId !== userId)
                  .map((item) => ({
                      cover: getCoverUrl(item),
                      id: item.id,
                      title: item.name,
                  }))
            : [],
    })
}
