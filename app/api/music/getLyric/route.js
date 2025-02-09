import lyric_new from "@/lib/music/api/lyric_new"

export const revalidate = 1800
export async function GET(request) {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    const res = await lyric_new({id})

    return Response.json(res.body)
}
