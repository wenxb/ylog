import {playlist_track_all} from "@/lib/music/api/playlist"
import {formatData} from "@/lib/music/formatData"

export const revalidate = 60
export async function GET(request) {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")
    const limit = searchParams.get("limit") || 200
    const offset = searchParams.get("offset") || 0

    if (!id) {
        return Response.error()
    }

    const allSongsRes = await playlist_track_all({
        id,
        limit,
        offset,
    })

    const allSongsData = allSongsRes.body?.songs || []
    const resData = formatData(allSongsData)

    return Response.json(resData)
}
