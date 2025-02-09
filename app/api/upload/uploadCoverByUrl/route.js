import axios from "axios"
import {uploadMedia} from "@/lib/server/upload"

export async function POST(req) {
    const body = await req.json()
    if (!body.url) return Response.error()
    try {
        const response = await axios({
            url: body.url,
            method: "GET",
            responseType: "stream",
        })
        const contentType = response.headers["content-type"]

        if (contentType && !contentType.startsWith("image/"))
            return Response.json({error: "不是图片类型"}, {status: 400})

        const url = await uploadMedia(response.data, {
            filename: "image.jpg",
            contentType: contentType,
        })
        return Response.json({url})
    } catch (err) {
        return Response.json({error: "上传失败"}, {status: 500})
    }
}
