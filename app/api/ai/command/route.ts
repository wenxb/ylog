import type {NextRequest} from "next/server"
import {NextResponse} from "next/server"

// Replaced use of the `ai` package with a direct call to OpenAI's REST API

export async function POST(req: NextRequest) {
    const {apiKey: key, messages, model = "gpt-4o-mini", system} = await req.json()

    const apiKey = key || process.env.OPENAI_API_KEY

    if (!apiKey) {
        return NextResponse.json({error: "Missing OpenAI API key."}, {status: 401})
    }

    const payload = {
        model,
        messages: [
            ...(system ? [{role: "system", content: system}] : []),
            ...messages,
        ],
        stream: true,
    }

    try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify(payload),
            signal: req.signal,
        })

        if (!res.ok || !res.body) {
            const err = await res.json().catch(() => ({}))
            return NextResponse.json(
                {error: err.error?.message || "Failed to process AI request"},
                {status: res.status},
            )
        }

        return new Response(res.body, {
            status: 200,
            headers: {"Content-Type": "text/event-stream"},
        })
    } catch (error: any) {
        if (error.name === "AbortError") {
            return NextResponse.json(null, {status: 408})
        }

        return NextResponse.json({error: "Failed to process AI request"}, {status: 500})
    }
}
