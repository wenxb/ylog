import {z} from "zod"
import {db} from "@/lib/db"
import {Category} from "@/lib/db/schema"
import {eq} from "drizzle-orm"

const verBody = z.object({
    name: z.string().min(1, "名称不能为空"),
    newName: z.string().min(1, "名称不能为空"),
})

export async function POST(req) {
    const body = await req.json()
    const result = verBody.safeParse(body)
    if (!result.success) return Response.json({error: result.error.errors[0].message}, {status: 400})

    try {
        const record = await db
            .select()
            .from(Category)
            .where(eq(Category.name, result.data.newName))
            .then((res) => res[0])
        if (record) {
            return Response.json({error: `分类"${result.data.newName}"已存在`}, {status: 400})
        }

        await db
            .update(Category)
            .set({
                name: result.data.newName,
            })
            .where(eq(Category.name, result.data.name))

        return Response.json({})
    } catch (e) {
        console.log(e)
        return Response.json({error: "修改失败"}, {status: 500})
    }
}
