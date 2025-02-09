import fetch from "node-fetch"

export const revalidate = 0
export async function GET(req) {
    const url = new URL(req.url)
    const targetUrl = url.searchParams.get("target") || req.headers.get("x-forwarded-url")

    if (!targetUrl) {
        return Response.json({error: '缺少目标 URL 参数 params.target || headers["x-forwarded-url"]'}, {status: 400})
    }

    try {
        const response = await fetch(targetUrl)
        const contentType = response.headers.get("Content-Type") || ""

        return new Response(response.body, {
            status: response.status,
            headers: {
                "Content-Type": contentType,
            },
        })
    } catch (error) {
        console.error("请求转发失败:", error)
        return Response.json({error: "请求转发失败"}, {status: 500})
    }
}

export async function POST(req) {
    const url = new URL(req.url)
    const targetUrl = url.searchParams.get("target") || req.headers.get("x-forwarded-url")

    if (!targetUrl) {
        return Response.json({error: "缺少目标 URL"}, {status: 400})
    }

    const body = await req.text()

    try {
        const response = await fetch(targetUrl, {
            method: "POST",
            headers: req.headers,
            body,
        })

        const contentType = response.headers.get("Content-Type") || ""

        return new Response(response.body, {
            status: response.status,
            headers: {
                "Content-Type": contentType,
            },
        })
    } catch (error) {
        console.error("请求转发失败:", error)
        return Response.json({error: "请求失败"}, {status: 500})
    }
}
