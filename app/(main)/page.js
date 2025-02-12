import MainColumn from "@/components/module/common/MainColumn"
import SideRightWrap from "@/components/sideRight/SideRightWrap"
import {db} from "@/lib/db"
import {Category, Posts, PostToCategory} from "@/lib/db/schema"
import {desc, eq} from "drizzle-orm"
import PostList from "@/components/lists/PostList"
import PostPagination from "@/components/module/common/PostPagination"
import {getSettingsByKeys} from "@/utils/server"
import PageHeader from "@/components/page/home/PageHeader"
import {auth} from "@/auth"

const pageSize = 12
export default async function Home({searchParams}) {
    const settings = await getSettingsByKeys(["site_title"])
    const title = settings.site_title
    const page = parseInt((await searchParams)?.page || "1")
    const session = await auth()

    const posts = await db
        .select()
        .from(Posts)
        .where(session ? undefined : eq(Posts.status, "publish"))
        .limit(pageSize)
        .offset((page - 1) * pageSize)
        .orderBy(desc(Posts.created_at))
    const count = await db.$count(Posts, session ? undefined : eq(Posts.status, "publish"))

    for (const post of posts) {
        post.category = await db
            .select({
                id: Category.id,
                name: Category.name,
            })
            .from(Category)
            .innerJoin(PostToCategory, eq(PostToCategory.categoryId, Category.id))
            .where(eq(PostToCategory.postId, post.id))
    }

    return (
        <>
            <MainColumn>
                <PageHeader title={title} />
                <div>
                    <PostList data={posts}></PostList>
                    <PostPagination count={count} pageSize={pageSize} page={page} />
                </div>
            </MainColumn>
            <SideRightWrap />
        </>
    )
}
