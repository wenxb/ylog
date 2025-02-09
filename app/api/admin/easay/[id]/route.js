import {db} from "@/lib/db"
import {Easay, EasayMedia} from "@/lib/db/schema"
import {eq} from "drizzle-orm"

export const GET = async (req, {params}) => {
    const easayId = (await params).id
    if (!easayId) return Response.error()

    try {
        const easay_record = await db
            .select({
                id: Easay.id,
                content: Easay.content,
            })
            .from(Easay)
            .where(eq(Easay.id, parseInt(easayId)))
        const media = await db
            .select({
                id: EasayMedia.id,
                type: EasayMedia.type,
                url: EasayMedia.url,
            })
            .from(EasayMedia)
            .where(eq(EasayMedia.easayId, parseInt(easayId)))

        const easay = easay_record?.[0]

        return Response.json({
            easay,
            media,
        })
    } catch (err) {
        console.error(err)
        return Response.json({}, {status: 500})
    }
}

export const DELETE = async (req, {params}) => {
    const easayId = (await params).id
    if (!easayId) return Response.error()

    try {
        await db.delete(Easay).where(eq(Easay.id, easayId))
        return Response.json(null)
    } catch (error) {
        return Response.error()
    }
}
