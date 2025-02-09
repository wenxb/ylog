import {uploadMedia} from "@/lib/server/upload"
import {db} from "@/lib/db"
import {EasayMedia} from "@/lib/db/schema"

export const POST = async (req) => {
    const formData = await req.formData()
    const file = formData.get("file")
    const easayId = formData.get("easay_id")
    if (!file || !easayId) return Response.json({error: "参数错误"}, {status: 400})
    const isImage = file.type.startsWith("image/")
    const isVideo = file.type.startsWith("video/")

    if (!isImage && !isVideo) return Response.json({error: "不支持的文件类型，只能为图片或视频"}, {status: 400})

    const url = await uploadMedia(file, {}, false)
    if (!url) return Response.json({error: "上传失败"}, {status: 400})

    try {
        const result = await db
            .insert(EasayMedia)
            .values({
                url: url,
                easayId,
                type: file.type,
            })
            .returning({
                id: EasayMedia.id,
            })

        return Response.json({
            url,
            id: result[0]?.id,
            type: file.type,
        })
    } catch (err) {
        return Response.error()
    }
}
