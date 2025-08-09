import type {NextRequest} from "next/server"
import {NextResponse} from "next/server"

// Directly call the OpenAI REST API instead of using the deprecated `ai` package

export async function POST(req: NextRequest) {
    const {apiKey: key, model = "gpt-4o-mini", prompt, system} = await req.json()

    const apiKey = key || process.env.OPENAI_API_KEY

    if (!apiKey) {
        return NextResponse.json({error: "Missing OpenAI API key."}, {status: 401})
    }

    try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model,
                messages: [
                    ...(system ? [{role: "system", content: system}] : []),
                    {role: "user", content: prompt},
                ],
                max_tokens: 50,
                temperature: 0.7,
            }),
            signal: req.signal,
        })

        if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            return NextResponse.json(
                {error: err.error?.message || "Failed to process AI request"},
                {status: res.status},
            )
        }

        const data = await res.json()
        return NextResponse.json(data)
    } catch (error: any) {
        if (error.name === "AbortError") {
            return NextResponse.json(null, {status: 408})
        }

        return NextResponse.json({error: "Failed to process AI request"}, {status: 500})
    }
}
