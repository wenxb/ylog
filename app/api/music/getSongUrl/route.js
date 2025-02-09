import {song_url_v1} from "@/lib/music/api/song"

export const revalidate = 120
export async function GET(request) {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")
    const level = searchParams.get("level")

    if (!id || !level) {
        return Response.error()
    }

    const res = await song_url_v1({
        id,
        level: level || "standard",
    })

    if (!res.body) return Response.error()

    return Response.json(res.body)
}
