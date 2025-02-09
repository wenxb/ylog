import scrobble from "@/lib/music/api/scrobble"

export const revalidate = 0
export async function GET(request) {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")
    const sourceid = searchParams.get("sourceid")
    const time = searchParams.get("time")

    const res = await scrobble(id, sourceid, time)

    return Response.json(res.body)
}
