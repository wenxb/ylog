import {getCoverUrl} from "@/lib/music/util"
import {recommend_resource} from "@/lib/music/api/recommend"

export const revalidate = 0

export async function GET() {
    const res = await recommend_resource()
    let data = res.body

    if (data) {
        if (data?.recommend && Array.isArray(data?.recommend)) {
            data = data?.recommend
                .filter((item) => item.name !== "私人雷达")
                .map((item) => {
                    return {
                        id: item.id,
                        cover: getCoverUrl(item),
                        title: item.name,
                    }
                })
        }
    }

    return Response.json(data)
}
