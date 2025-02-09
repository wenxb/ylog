import {user_playlist} from "@/lib/music/api/user"
import {playlist_track_all} from "@/lib/music/api/playlist"
import {formatData} from "@/lib/music/formatData"
import {getGlobalMUID} from "@/lib/music"

export const revalidate = 0
export async function GET(request) {
    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get("limit") || 200
    const offset = searchParams.get("offset") || 0

    const userId = await getGlobalMUID()

    const playlistRes = await user_playlist({
        uid: userId,
    })

    const likeInfo = playlistRes.body?.playlist?.[0]
    if (!likeInfo) return Response.error()
    const likeId = likeInfo.id

    const allSongsRes = await playlist_track_all({
        id: likeId,
        limit,
        offset,
    })

    const songs = allSongsRes.body?.songs || []
    if (!songs) return Response.error()

    return Response.json(formatData(songs))
}
