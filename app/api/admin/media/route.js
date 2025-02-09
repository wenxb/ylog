import {z} from "zod"
import {db} from "@/lib/db"
import {EasayMedia} from "@/lib/db/schema"
import {inArray} from "drizzle-orm"

const verBody = z.object({
    ids: z.array(z.number()).min(1),
})
export const DELETE = async (req) => {
    const body = await req.json()
    const ver = verBody.safeParse(body)
    if (!ver.success) return Response.json({error: ver.error.errors[0].message}, {status: 400})

    try {
        await db.delete(EasayMedia).where(inArray(EasayMedia.id, ver.data.ids))
        return Response.json(null)
    } catch (error) {
        return Response.error()
    }
}
