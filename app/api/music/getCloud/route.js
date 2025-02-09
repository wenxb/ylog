import {getCoverUrl} from "@/lib/music/util"
import {formatData} from "@/lib/music/formatData"
import {user_cloud} from "@/lib/music/api/user"

export const revalidate = 0

export async function GET() {
    let offset = 0
    const limit = 100
    let totalCount = null
    let resultArr = []

    while (totalCount === null || offset < totalCount) {
        const cloudRes = await user_cloud({limit, offset})
        if (!cloudRes.body) break

        resultArr.push(cloudRes.body.data)

        offset += limit
        totalCount = cloudRes.body.count
    }

    const cloudSongs = resultArr.flat()

    return Response.json({
        title: "我的云盘",
        description: "",
        songs: formatData(cloudSongs),
        cover: getCoverUrl(cloudSongs[0]),
        songsCount: totalCount,
        temp: cloudSongs,
    })
}
