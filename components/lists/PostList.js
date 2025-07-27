"use client"
import Link from "next/link"
import dayjs from "@/utils/dayjs"
import EmptyContent from "@/components/module/EmptyContent"
import {Tag} from "@arco-design/web-react"

const PostItem = ({post}) => {
    return (
        <li className={"relative list-none transition-colors hover:bg-accent"}>
            <Link className={"absolute inset-0 z-2"} href={"/post/" + post.id} />
            <article className="flex items-start gap-3 border-b p-4">
                <div className="flex grow flex-col justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className={"text-xl"}>{post.title}</h2>
                        {post.status === "draft" && (
                            <Tag size="small" color="#ffb400">
                                草稿
                            </Tag>
                        )}
                    </div>
                    {post.summary && <p className={"mt-2 line-clamp-2 text-sm text-foreground/60"}>{post.summary}</p>}
                    <div className={"mt-3 flex items-center text-sm text-muted-foreground"}>
                        <time>{dayjs(post.created_at).fromNow()}</time>
                        <div className={"z-5 ml-3 space-x-2"}>
                            {post.category &&
                                post.category.map((category) => (
                                    <Link href={"/category/" + category.name} key={category.id}>
                                        <Tag className={"hover:bg-primary! hover:text-white!"}>#{category.name}</Tag>
                                    </Link>
                                ))}
                        </div>
                    </div>
                </div>
                {post.cover && (
                    <div className="relative w-28 min-w-28 max-sm:min-w-26">
                        <div className="pb-[75%]"></div>
                        <div className="absolute top-0 left-0 h-full w-full overflow-hidden rounded-xl">
                            <img className="h-full w-full object-cover" src={post.cover} alt={post.title} />
                        </div>
                    </div>
                )}
            </article>
        </li>
    )
}

const PostList = ({data = []}) => {
    return (
        <ul>
            {data.length ? (
                data.map((post) => <PostItem key={post.id} post={post} />)
            ) : (
                <EmptyContent text={"文章还在赶来的路上，稍安勿躁～"} />
            )}
        </ul>
    )
}

export default PostList
