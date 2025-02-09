import {z} from "zod"
import {db} from "@/lib/db"
import {Category} from "@/lib/db/schema"
import {eq, inArray} from "drizzle-orm"
import {pageVer} from "@/lib/server/ver"

const verBody = z.object({
    name: z.string().min(1, "名称不能为空"),
    id: z.number().optional().nullable(),
})

export async function DELETE(req) {
    const body = await req.json()

    try {
        const ids = body?.ids.map((id) => parseInt(id))
        if (!ids || !Array.isArray(ids)) return Response.error()

        await db.delete(Category).where(inArray(Category.id, ids))
        return Response.json({})
    } catch (err) {
        console.error(err)
        return Response.error()
    }
}

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams
    const page = searchParams.get("page")
    const pageSize = searchParams.get("pageSize")

    const result = pageVer.safeParse({page, pageSize})
    if (!result.success) return Response.json({error: result.error.errors[0].message}, {status: 400})

    const pageParams = result.data
    try {
        const offset = pageParams.page * pageParams.pageSize
        const record = await db
            .select()
            .from(Category)
            .limit(pageParams.pageSize)
            .offset(offset)
            .orderBy(Category.id, Category.name)
        const count = await db.$count(Category)

        return Response.json({
            rows: record,
            count,
        })
    } catch (err) {
        return Response.json({error: err.message}, {status: 500})
    }
}

export async function POST(req) {
    const body = await req.json()
    const result = verBody.safeParse(body)
    if (!result.success) return Response.json({error: result.error.errors[0].message}, {status: 400})

    try {
        const record = await db
            .select()
            .from(Category)
            .where(eq(Category.name, result.data.name))
            .then((res) => res[0])
        if (record) {
            return Response.json({id: record.id})
        }

        await db
            .insert(Category)
            .values({...result.data})
            .onConflictDoUpdate({
                target: Category.id,
                set: {
                    name: result.data.name,
                },
            })

        return Response.json({})
    } catch (err) {
        return Response.json({error: err.message}, {status: 500})
    }
}
