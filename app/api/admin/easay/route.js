import {z} from "zod"
import {db} from "@/lib/db"
import {Easay, EasayMedia} from "@/lib/db/schema"
import {pageVer} from "@/lib/server/ver"
import {desc, eq} from "drizzle-orm"
import {getAdminUser} from "@/utils/server"

const verBody = z.object({
    id: z.number().nullable().optional(),
    content: z.string().nullable(),
})
export const POST = async (req) => {
    const body = await req.json()
    const userId = (await getAdminUser()).id
    const ver = verBody.safeParse(body)
    if (!ver.success) return Response.json({error: ver.error.errors[0].message}, {status: 400})

    const parseBody = ver.data

    try {
        const record = await db
            .insert(Easay)
            .values({
                userId,
                id: parseBody.id,
                content: parseBody.content,
            })
            .onDuplicateKeyUpdate({
                set: {
                    content: parseBody.content,
                },
            })
            .$returningId()
            .then((res) => res[0])

        return Response.json({
            id: record.id,
        })
    } catch (err) {
        console.log(err)
        return Response.error()
    }
}

export const GET = async (req) => {
    const searchParams = req.nextUrl.searchParams
    const page = searchParams.get("page") || "1"
    const pageSize = searchParams.get("pageSize") || "1"

    const result = pageVer.safeParse({page, pageSize})
    if (!result.success) return Response.json({error: result.error.errors[0].message}, {status: 400})
    const pageParams = result.data

    try {
        const easay_record = await db
            .select({
                id: Easay.id,
                content: Easay.content,
                created_at: Easay.created_at,
            })
            .from(Easay)
            .limit(pageParams.pageSize)
            .offset((pageParams.page - 1) * pageParams.pageSize)
            .orderBy(desc(Easay.created_at))
        const count = await db.$count(Easay)
        for (const easay of easay_record) {
            easay.media = await db.select().from(EasayMedia).where(eq(EasayMedia.easayId, easay.id))
        }

        return Response.json({
            rows: easay_record,
            count: count,
        })
    } catch (err) {
        return Response.error()
    }
}
