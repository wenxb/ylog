import {playlist_detail} from "@/lib/music/api/playlist"
import {getCoverUrl} from "@/lib/music/util"

export const revalidate = 120
export async function GET(request) {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    const detailRes = await playlist_detail({
        id,
    })
    let detailData = detailRes.body?.playlist
    const detail = {}
    if (detailData) {
        detail.title = detailData.name
        detail.songsCount = detailData.trackCount
        detail.description = detailData.description
    }

    return Response.json({
        id: detailData.id,
        cover: getCoverUrl(detailData),
        ...detail,
    })
}
