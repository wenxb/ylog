import {db} from "@/lib/db"
import {Category, Posts, PostToCategory} from "@/lib/db/schema"
import {eq, getTableColumns} from "drizzle-orm"

export const GET = async (req, {params}) => {
    const postId = (await params).id
    if (!postId) return Response.error()

    try {
        const {contentHtml, ...rest} = getTableColumns(Posts) // 排除 "contentHtml" 列
        const post_record = await db
            .select({...rest})
            .from(Posts)
            .where(eq(Posts.id, parseInt(postId)))
        const post = post_record?.[0]
        const cate_record = await db
            .select({
                id: Category.id,
                name: Category.name,
            })
            .from(PostToCategory)
            .innerJoin(Category, eq(Category.id, PostToCategory.categoryId))
            .where(eq(PostToCategory.postId, post?.id))

        return Response.json({
            post: post,
            category: cate_record || [],
        })
    } catch (err) {
        console.error(err)
        return Response.json({}, {status: 500})
    }
}
