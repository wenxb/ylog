import {z} from "zod"
import {db} from "@/lib/db"
import {Category, Posts, PostToCategory} from "@/lib/db/schema"
import {desc, eq, inArray} from "drizzle-orm"
import {pageVer} from "@/lib/server/ver"
import {getAdminUser} from "@/utils/server"

const verBody = z.object({
    id: z.number().optional(),
    title: z.string().min(1, "标题不能为空"),
    content: z.array(z.any()),
    summary: z.string().optional().default(""),
    cover: z.string().optional().default(""),
    status: z.enum(["draft", "publish"]),
    categories: z.array(z.number()),
    date: z.string().optional(),
})

function generateSummary(data, length = 50) {
    // 1. 提取文本块
    const text = data
        .filter((block) => ["paragraph", "header", "list"].includes(block.type))
        .map((block) => {
            if (block.type === "list") {
                return block.data.items.join(" ")
            }
            return block.data.text
        })
        .join(" ")

    // 2. 去掉 HTML 标签
    let pureText = text.replace(/<[^>]+>/g, "")

    // 3. 去掉换行符（\n \r）
    pureText = pureText.replace(/[\r\n]/g, "")

    // 4. 截取前 50 字符
    return pureText.length > length ? pureText.slice(0, length) + "…" : pureText
}

export const POST = async (req) => {
    const userId = (await getAdminUser()).id
    const body = await req.json()

    const result = verBody.safeParse(body)
    if (!result.success) return Response.json({error: result.error.errors[0].message}, {status: 400})
    const parseBody = result.data

    // 生成摘要
    parseBody.summary = generateSummary(parseBody.content)

    try {
        let postId
        const values = {
            id: parseBody.id,
            title: parseBody.title,
            content: JSON.stringify(parseBody.content),
            summary: parseBody.summary,
            cover: parseBody.cover,
            status: parseBody.status,
            ...(parseBody.date ? {created_at: new Date(parseBody.date)} : {}),
            updated_at: new Date(),
        }

        await db.transaction(async (tx) => {
            const record = await tx
                .insert(Posts)
                .values({
                    userId,
                    ...values,
                })
                .onDuplicateKeyUpdate({
                    set: values,
                })
                .$returningId()

            postId = record[0]?.id

            await tx.delete(PostToCategory).where(eq(PostToCategory.postId, postId))
            for (const category of parseBody.categories) {
                await tx.insert(PostToCategory).values({
                    postId: postId,
                    categoryId: category,
                })
            }
        })

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
