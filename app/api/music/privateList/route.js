import {getCoverUrl} from "@/lib/music/util"
import {recommend_songs} from "@/lib/music/api/recommend"
import {playlist_detail} from "@/lib/music/api/playlist"

export const revalidate = 120

export async function GET() {
    const resList = []
    const dayRes = await recommend_songs()
    const radarId = 3136952023
    const radarDetail = await playlist_detail({
        id: radarId,
    })

    if (dayRes.body) {
        const daySongs = dayRes?.body.data?.dailySongs
        const firstSongName = daySongs[0].name
        resList.push({
            title: "每日推荐",
            desc: `从 ${firstSongName} 听起`,
            cover: getCoverUrl(daySongs[0]),
            type: "daily",
        })
    }

    if (radarDetail.body) {
        const songs = radarDetail.body?.playlist?.tracks
        resList.push({
            title: "私人雷达",
            desc: `今天《${songs[0].name}》爱不释耳`,
            cover: getCoverUrl(songs[0]),
            type: "radar",
            id: radarId,
        })
    }

    return Response.json(resList)
}
