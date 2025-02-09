import {getCoverUrl} from "@/lib/music/util"
import {formatData} from "@/lib/music/formatData"
import {playlist_detail} from "@/lib/music/api/playlist"

export const revalidate = 600

export async function GET() {
    const radarDetail = await playlist_detail({
        id: 3136952023,
    })

    const songs = radarDetail.body?.playlist?.tracks

    if (!songs) return Response.error()

    return Response.json({
        title: "私人雷达",
        description: `今天《${songs[0].name}》爱不释耳`,
        songs: formatData(songs),
        cover: getCoverUrl(songs[0]),
        songsCount: songs.length,
    })
}
