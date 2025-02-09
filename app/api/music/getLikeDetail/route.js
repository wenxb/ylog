import {getCoverUrl} from "@/lib/music/util"
import {user_playlist} from "@/lib/music/api/user"
import {getGlobalMUID} from "@/lib/music"

export const revalidate = 0

export async function GET() {
    const userId = await getGlobalMUID()

    const playlistRes = await user_playlist({
        uid: userId,
    })

    const likeInfo = playlistRes.body?.playlist?.[0]
    if (!likeInfo) return Response.error()

    return Response.json({
        title: likeInfo.name,
        description: "",
        cover: getCoverUrl(likeInfo),
        songsCount: likeInfo.trackCount,
        uid: global.userId,
    })
}
