import {notFound} from "next/navigation"
import MainColumn from "@/components/module/common/MainColumn"
import Link from "next/link"
import PageHeaderWrap from "@/components/module/common/PageHeaderWrap"
import SideRightWrap from "@/components/sideRight/SideRightWrap"
import PostToc from "@/components/common/PostToc"
import dayjs from "@/utils/dayjs"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip"
import {Badge} from "@/components/ui/badge"
import {ClockIcon, EyeIcon, MessageSquareMoreIcon} from "lucide-react"
import {db} from "@/lib/db"
import {Category, PostComments, Posts, PostToCategory} from "@/lib/db/schema"
import {asc, desc, eq, gt, lt} from "drizzle-orm"
import HeaderAction from "@/components/page/post/HeaderAction"
import {getAdminUser, getSettingsByKeys} from "@/utils/server"
import DOMPurify from "dompurify"
import {JSDOM} from "jsdom"
import {getPostFromCache} from "@/lib/db/module/posts"
import "@/components/plate-ui/code-block-element.css"
import PostComment from "@/components/page/post/PostComment"
import {formatCount} from "@/utils"
import PageTitle from "@/components/module/common/PageTitle"

const contentClass =
    "prose min-h-52 max-w-full flex-grow p-4 text-base prose-blue prose-pre:text-inherit prose-zinc dark:prose-invert prose-tr:border-b-0 prose-hr:my-0"

async function getPostFromParams(params) {
    let id = (await params)?.id

    const post = await getPostFromCache(id)
    if (!post) return null

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
    const config = await getSettingsByKeys(["site_url"])
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

    const config = await getSettingsByKeys(["site_url"])
    const window = new JSDOM("").window
    const purify = DOMPurify(window)

    const safeHtml = purify.sanitize(post.contentHtml || "")

    return (
        <>
            <MainColumn>
                <PageHeaderWrap
                    scrollShowBarSlot={!post.cover}
                    noPadding
                    barSlot={<div className={"line-clamp-1 text-xl font-semibold"}>{post.title}</div>}
                    action={<HeaderAction postId={post.id} />}
                >
                    {post?.cover && (
                        <div className="h-64 w-full -mt-[54px]">
                            <img className="w-full h-full object-cover" src={post.cover} alt={post.title} />
                        </div>
                    )}
                    <div className="px-4 pb-4">
                        <PageTitle>{post.title}</PageTitle>
                        <div className="flex w-full flex-col items-start text-muted-foreground">
                            <div className="flex items-center gap-3 text-sm">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex cursor-default items-center gap-1">
                                            <ClockIcon className="size-4" />
                                            <time>{dayjs(meta.created_at).format("YYYY-MM-DD")}</time>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <span>更新日期：{dayjs(meta.updated_at).format("YYYY-MM-DD HH:mm:ss")}</span>
                                    </TooltipContent>
                                </Tooltip>
                                <div className="flex items-center gap-1">
                                    <EyeIcon className="size-4" />
                                    <span>{formatCount(meta?.views || 0)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MessageSquareMoreIcon className="size-4" />
                                    <span>{formatCount(commentCount || 0)}</span>
                                </div>
                            </div>
                            {(Array.isArray(post.category) && post.category.length > 0) && (
                                <div className="mt-3 flex gap-2">
                                    {post.category.map((category) => (
                                        <Link
                                            href={"/category/" + category.name}
                                            className="no-underline"
                                            key={category.id}
                                        >
                                            <Badge variant="secondary">{category.name}</Badge>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </PageHeaderWrap>
                <article id="article-content" className={contentClass}>
                    <div dangerouslySetInnerHTML={{__html: safeHtml}}></div>
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
                <div className="relative border-t pt-4 mb-10">
                    <PostComment id={post.id} />
                </div>
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
