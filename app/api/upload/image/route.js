import {allowImageSuffix, maxImageSize} from "@/lib/constant"
import {getFileExtension} from "@/utils/file"
import {uploadMedia} from "@/lib/server/upload"

export async function POST(req) {
    const formData = await req.formData()
    const file = formData.get("file")
    if (!file) return Response.json({error: "没有找到 file"}, {status: 400})
    if (file.size > maxImageSize) return Response.json({error: "超过最大文件大小"}, {status: 400})
    if (!allowImageSuffix.includes(getFileExtension(file.name)))
        return Response.json({error: "文件类型不允许"}, {status: 400})

    const url = await uploadMedia(file, {}, false)
    if (!url) return Response.json({error: "上传失败"}, {status: 400})

    return Response.json({url})
}
