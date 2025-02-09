import {z} from "zod"
import {db} from "@/lib/db"
import {PostComments, Users} from "@/lib/db/schema"
import {desc, eq} from "drizzle-orm"
import {getLoginUser} from "@/lib/server/helper"

const verBody = z.object({
    content: z.string().min(1, "评论内容不能为空").max(200, "最大200个字符"),
    parentId: z.number().optional(),
    postId: z.number(),
})

export const POST = async (req) => {
    const body = await req.json()
    const user = await getLoginUser(req)
    if(!user) return Response.error()
    const userId = user?.id
    const ver = verBody.safeParse(body)

    if (!ver.success) {
        return Response.json({error: ver.error.errors[0].message}, {status: 400})
    }

    try {
        await db.insert(PostComments).values({
            content: ver.data.content,
            ...(ver.data.parentId && {parentId: ver.data.parentId}),
            userId,
            postId: ver.data.postId,
        })

        return Response.json({})
    } catch (err) {
        console.log(err)
        return Response.error()
    }
}

const pageSize = 12
export const GET = async (req) => {
    const searchParams = req.nextUrl.searchParams
    const postId = searchParams.get("postId")
    const page = searchParams.get("page") || "1"

    if (!postId) {
        return Response.error()
    }

    try {
        const offset = (parseInt(page) - 1) * pageSize
        const rows = await db
            .select({
                id: PostComments.id,
                userId: Users.id,
                userName: Users.name,
                userImage: Users.image,
                content: PostComments.content,
                parentId: PostComments.parentId,
                created_at: PostComments.created_at,
            })
            .from(PostComments)
            .leftJoin(Users, eq(Users.id, PostComments.userId))
            .where(eq(PostComments.postId, postId))
            .limit(pageSize)
            .offset(offset)
            .orderBy(desc(PostComments.created_at))
        const count = await db.$count(PostComments, eq(PostComments.postId, postId))

        return Response.json({
            rows,
            count,
        })
    } catch (err) {
        console.log(err)
        return Response.error()
    }
}

// 递归删除评论及其所有子评论
const deleteCommentAndAllChildren = async (commentId) => {
    // 获取所有子评论
    const childComments = await db
        .select({
            id: PostComments.id,
        })
        .from(PostComments)
        .where(eq(PostComments.parentId, commentId))

    // 先删除所有子评论
    for (const child of childComments) {
        await deleteCommentAndAllChildren(child.id) // 递归删除子评论
    }

    // 删除当前评论
    await db.delete(PostComments).where(eq(PostComments.id, commentId))
}

export const DELETE = async (req) => {
    const body = await req.json()
    const user = await getLoginUser(req)
    const userId = user?.id

    if (!user || !body.id) {
        return Response.error()
    }

    try {
        const record = await db
            .select({
                userId: PostComments.userId,
            })
            .from(PostComments)
            .where(eq(PostComments.id, body.id))
            .then((res) => res[0])
        if (!record || record?.userId !== userId) return Response.error()

        await deleteCommentAndAllChildren(body.id)

        return Response.json("")
    } catch (e) {
        console.error(e)
        return Response.error()
    }
}
