import MainColumn from "@/components/module/MainColumn"
import PageHeaderWrap from "@/components/module/PageHeaderWrap"
import PostList from "@/components/lists/PostList"
import PostPagination from "@/components/module/PostPagination"
import {db} from "@/lib/db"
import {Category, Posts, PostToCategory} from "@/lib/db/schema"
import {and, count, desc, eq} from "drizzle-orm"
import {notFound} from "next/navigation"
import {auth} from "@/auth"
import HeaderAction from "@/components/page/category/HeaderAction"

const pageSize = 12
const Page = async ({params, searchParams}) => {
    const page = parseInt((await searchParams)?.page || "1")
    const name = decodeURIComponent((await params).name)
    const session = await auth()

    const record_category = await db.select({id: Category.id}).from(Category).where(eq(Category.name, name))
    if (!record_category?.length) {
        notFound()
        return
    }

    const posts = await db
        .select({
            post: Posts,
        })
        .from(Posts)
        .innerJoin(PostToCategory, eq(PostToCategory.postId, Posts.id))
        .innerJoin(Category, eq(Category.id, PostToCategory.categoryId))
        .where(and(session ? undefined : eq(Posts.status, "publish"), eq(Category.name, name)))
        .limit(pageSize)
        .offset((page - 1) * pageSize)
        .orderBy(desc(Posts.created_at))

    const total = await db
        .select({
            count: count(),
        })
        .from(Posts)
        .innerJoin(PostToCategory, eq(PostToCategory.postId, Posts.id))
        .innerJoin(Category, eq(Category.id, PostToCategory.categoryId))
        .where(and(session ? undefined : eq(Posts.status, "publish"), eq(Category.name, name)))

    for (const post of posts) {
        post.post.category = await db
            .select({
                id: Category.id,
                name: Category.name,
            })
            .from(Category)
            .innerJoin(PostToCategory, eq(PostToCategory.categoryId, Category.id))
            .where(eq(PostToCategory.postId, post.post.id))
    }

    const data = posts.map((item) => item.post)
    const countNum = total[0].count

    return (
        <MainColumn>
            <PageHeaderWrap
                title={name}
                secondary={`${countNum} 篇文章`}
                action={<HeaderAction categoryName={name} />}
            ></PageHeaderWrap>
            <div>
                <PostList data={data}></PostList>
                <PostPagination count={countNum} pageSize={pageSize} page={page} />
            </div>
        </MainColumn>
    )
}

export default Page
