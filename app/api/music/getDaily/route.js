import {recommend_songs} from "@/lib/music/api/recommend"
import {getCoverUrl} from "@/lib/music/util"
import {formatData} from "@/lib/music/formatData"

export const revalidate = 600

export async function GET() {
    const dayRes = await recommend_songs()
    const daySongs = dayRes?.body.data?.dailySongs

    if (!daySongs) return Response.error()

    return Response.json({
        title: "每日推荐",
        description: "根据你的音乐口味 · 每日 6:00 更新",
        songs: formatData(daySongs),
        cover: getCoverUrl(daySongs[0]),
        songsCount: daySongs.length,
    })
}
