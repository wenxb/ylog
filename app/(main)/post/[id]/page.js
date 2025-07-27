import {notFound} from "next/navigation"
import MainColumn from "@/components/module/MainColumn"
import Link from "next/link"
import PageHeaderWrap from "@/components/module/PageHeaderWrap"
import SideRightWrap from "@/components/sideRight/SideRightWrap"
import PostToc from "@/components/common/PostToc"
import dayjs from "@/utils/dayjs"
import {ClockIcon, EyeIcon, MessageSquareMoreIcon} from "lucide-react"
import {db} from "@/lib/db"
import {Category, PostComments, Posts, PostToCategory} from "@/lib/db/schema"
import {asc, desc, eq, gt, lt} from "drizzle-orm"
import HeaderAction from "@/components/page/post/HeaderAction"
import {getAdminUser, getSettingsByKeys} from "@/utils/server"
import {getPost} from "@/lib/db/module/posts"
import PostComment from "@/components/page/post/PostComment"
import {formatCount} from "@/utils"
import PageTitle from "@/components/module/PageTitle"
import {auth} from "@/auth"
import EditorJsRender from "@/components/module/EditorJsRender"
import ClientTag from "@/components/common/ClientTag"
import ClientTooltip from "@/components/common/ClientTooltip"

async function getPostFromParams(params) {
    const session = await auth()
    let id = (await params)?.id

    const post = await getPost(id)
    if (!post) return null
    if (post.status === "draft" && !session) return null

    post.category = await db
        .select({
            id: Category.id,
            name: Category.name,
        })
        .from(PostToCategory)
        .innerJoin(Category, eq(Category.id, PostToCategory.categoryId))
        .where(eq(PostToCategory.postId, post?.id))

    return post
}

export async function generateMetadata({params}) {
    const config = await getSettingsByKeys(["site_url", "enable_comment"])
    const post = await getPostFromParams(params)

    if (!post) {
        return {}
    }

    let keywords = post?.keywords || []

    if (!keywords?.length) {
        if (post?.category) {
            keywords = post.category.map((c) => c.name).join(" ")
        }
    }

    return {
        title: post.title,
        description: post.summary,
        keywords,
        openGraph: {
            title: post.title,
            description: post.summary,
            url: `${config.site_url}/post/${post.id}`,
        },
    }
}

const updateViews = async (id, prevViews) => {
    await db
        .update(Posts)
        .set({
            views: prevViews + 1,
        })
        .where(eq(Posts.id, id))
}

const getPrevAndNext = async (id) => {
    const prev = await db
        .select({
            id: Posts.id,
            title: Posts.title,
        })
        .from(Posts)
        .where(lt(Posts.id, id))
        .limit(1)
        .orderBy(desc(Posts.id))
        .then((res) => res[0])
    const next = await db
        .select({
            id: Posts.id,
            title: Posts.title,
        })
        .from(Posts)
        .where(gt(Posts.id, id))
        .limit(1)
        .orderBy(asc(Posts.id))
        .then((res) => res[0])

    return {
        prev,
        next,
    }
}

const getPostCommentNum = async (id) => {
    return db.$count(PostComments, eq(PostComments.postId, id))
}

export default async function PostPage({params}) {
    const post = await getPostFromParams(params)
    const user = await getAdminUser()

    if (!post) {
        notFound()
        return null
    }
    const meta = await db
        .select({
            created_at: Posts.created_at,
            updated_at: Posts.updated_at,
            views: Posts.views,
        })
        .from(Posts)
        .where(eq(Posts.id, post?.id))
        .then((res) => res[0])

    await updateViews(post?.id, meta.views)

    const prevAndNext = await getPrevAndNext(post?.id)
    const commentCount = await getPostCommentNum(post?.id)

    const config = await getSettingsByKeys(["site_url", "enable_comment"])

    return (
        <>
            <MainColumn className="pb-10">
                <PageHeaderWrap scrollShowBarSlot={!post.cover} noPadding action={<HeaderAction postId={post.id} />}>
                    {post?.cover && (
                        <div className="relative w-full">
                            <div className="pb-[52%]"></div>
                            <div className="absolute top-0 left-0 h-full w-full">
                                <img className="h-full w-full object-cover" src={post.cover} alt={post.title} />
                            </div>
                        </div>
                    )}
                    <div className="px-4 pb-4">
                        {post.category && (
                            <div className="mt-3 flex gap-2">
                                {post.category.map((category) => (
                                    <Link
                                        href={"/category/" + category.name}
                                        className="no-underline"
                                        key={category.id}
                                    >
                                        <ClientTag>#{category.name}</ClientTag>
                                    </Link>
                                ))}
                            </div>
                        )}
                        <PageTitle>{post.title}</PageTitle>
                        <div className="flex w-full flex-col items-start text-muted-foreground">
                            <div className="flex items-center gap-3 text-sm">
                                <ClientTooltip
                                    mini
                                    content={
                                        <span>更新日期：{dayjs(meta.updated_at).format("YYYY-MM-DD HH:mm:ss")}</span>
                                    }
                                >
                                    <div className="flex cursor-default items-center gap-1">
                                        <ClockIcon className="size-4" />
                                        <time>{dayjs(meta.created_at).format("YYYY-MM-DD")}</time>
                                    </div>
                                </ClientTooltip>
                                <div className="flex items-center gap-1">
                                    <EyeIcon className="size-4" />
                                    <span>{formatCount(meta?.views || 0)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MessageSquareMoreIcon className="size-4" />
                                    <span>{formatCount(commentCount || 0)}</span>
                                </div>
                                {post.status === "draft" && (
                                    <div className="rounded bg-yellow-200 px-1.5 py-1 text-[11px] leading-none text-yellow-800 hover:bg-yellow-200">
                                        草稿
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </PageHeaderWrap>
                <article id="article-content" className="prose min-h-52 max-w-full p-4 dark:prose-invert">
                    {post.content && <EditorJsRender data={{blocks: JSON.parse(post.content)}} />}
                </article>
                <div className={"mt-6 flex flex-col border-t p-4"}>
                    <div className={"text-base"}>{post.title}</div>
                    <div className={"mt-1.5 text-muted-foreground"}>{user.name}</div>
                    <div className={"my-1.5"}>
                        <a
                            className={"border-b border-transparent text-blue-500 hover:border-blue-500"}
                            target="_blank"
                            href={`${config.site_url}/post/${post.id}`}
                        >
                            {`${config.site_url}/post/${post.id}`}
                        </a>
                    </div>
                    <div>
                        本站文章除特别声明外，均采用
                        <a
                            className={"border-b border-transparent text-blue-500 hover:border-blue-500"}
                            target="_blank"
                            href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh"
                        >
                            BY-NC-SA
                        </a>
                        许可协议。转载请注明出处！
                    </div>
                </div>
                <div className="border-t">
                    <div className="flex w-full">
                        {prevAndNext.prev && (
                            <Link
                                className="flex-1 px-4 py-6 text-inherit transition-colors hover:bg-accent"
                                href={`/post/${prevAndNext.prev.id}`}
                            >
                                <div className="text-sm text-muted-foreground">上一篇</div>
                                <div className="mt-1 line-clamp-1">{prevAndNext.prev.title}</div>
                            </Link>
                        )}

                        {prevAndNext.next && (
                            <Link
                                className="flex flex-1 flex-col items-end px-4 py-6 text-inherit transition-colors hover:bg-accent"
                                href={`/post/${prevAndNext.next.id}`}
                            >
                                <div className="text-sm text-muted-foreground">下一篇</div>
                                <div className="mt-1 line-clamp-1">{prevAndNext.next.title}</div>
                            </Link>
                        )}
                    </div>
                </div>
                {!config.enable_comment || config?.enable_comment === "false" ? null : (
                    <div className="relative border-t pt-4">
                        <PostComment id={post.id} />
                    </div>
                )}
            </MainColumn>
            <SideRightWrap
                stickyWrap={
                    <>
                        <PostToc />
                    </>
                }
            />
        </>
    )
}
