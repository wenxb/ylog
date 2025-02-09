import {z} from "zod"
import {db} from "@/lib/db"
import {Category, Posts, PostToCategory} from "@/lib/db/schema"
import {desc, eq, inArray} from "drizzle-orm"
import {pageVer} from "@/lib/server/ver"
import {getAdminUser} from "@/utils/server"
import {getRedisClient} from "@/lib/redis/client"

const verBody = z.object({
    id: z.number().optional(),
    title: z.string().min(1, "标题不能为空"),
    content: z.string(),
    content_html: z.string(),
    summary: z.string(),
    cover: z.string(),
    status: z.enum(["draft", "publish"]),
    categories: z.array(z.number()),
})

export const POST = async (req) => {
    const redis = await getRedisClient()
    const userId = (await getAdminUser()).id
    const body = await req.json()

    const result = verBody.safeParse(body)
    if (!result.success) return Response.json({error: result.error.errors[0].message}, {status: 400})
    const parseBody = result.data

    // 生成摘要
    const textContent = parseBody.content_html.replace(/<\/h[1-6]>/g, "$& ").replace(/<[^>]*>/g, "")
    parseBody.summary = textContent.slice(0, 50).replaceAll("\n", " ")

    try {
        let postId
        const values = {
            id: parseBody.id,
            title: parseBody.title,
            content: parseBody.content,
            contentHtml: parseBody.content_html,
            summary: parseBody.summary,
            cover: parseBody.cover,
            status: parseBody.status,
        }

        await db.transaction(async (tx) => {
            const record = await tx
                .insert(Posts)
                .values({
                    userId,
                    ...values,
                })
                .onConflictDoUpdate({
                    target: Posts.id,
                    set: values,
                })
                .returning({id: Posts.id})
            postId = record[0].id

            await tx.delete(PostToCategory).where(eq(PostToCategory.postId, postId))
            for (const category of parseBody.categories) {
                await tx.insert(PostToCategory).values({
                    postId: postId,
                    categoryId: category,
                })
            }
        })

        await redis.json.del(`posts:${postId}`)

        return Response.json({
            id: postId,
        })
    } catch (err) {
        return Response.json({error: err.message}, {status: 500})
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
        const record = await db
            .select({
                id: Posts.id,
                title: Posts.title,
                cover: Posts.cover,
                summary: Posts.summary,
                views: Posts.views,
                content: Posts.content,
                created_at: Posts.created_at,
                updated_at: Posts.updated_at,
            })
            .from(Posts)
            .limit(pageParams.pageSize)
            .offset((pageParams.page - 1) * pageParams.pageSize)
            .where(eq(Posts.status, "publish"))
            .orderBy(desc(Posts.created_at))
        const count = await db.$count(Posts)

        for (const post of record) {
            post.category = await db
                .select({
                    id: Category.id,
                    name: Category.name,
                })
                .from(PostToCategory)
                .innerJoin(Category, eq(Category.id, PostToCategory.categoryId))
                .where(eq(PostToCategory.postId, post.id))
        }

        return Response.json({
            rows: record,
            count: count,
        })
    } catch (err) {
        return Response.error()
    }
}

export async function DELETE(req) {
    const body = await req.json()

    try {
        const ids = body?.ids.map((id) => parseInt(id))
        if (!ids || !Array.isArray(ids)) return Response.error()

        await db.delete(Posts).where(inArray(Posts.id, ids))
        return Response.json({})
    } catch (err) {
        console.error(err)
        return Response.error()
    }
}
