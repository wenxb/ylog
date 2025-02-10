"use client"
import Link from "next/link"
import dayjs from "@/utils/dayjs"
import EmptyContent from "@/components/module/common/EmptyContent"

const PostItem = ({post}) => {
    return (
        <li className={"relative list-none transition-colors hover:bg-accent"}>
            <Link className={"absolute inset-0 z-2"} href={"/post/" + post.id} />
            <article className="flex items-start gap-3 border-b p-4">
                <div className="grow flex flex-col justify-between">
                    <h2 className={"text-xl"}>{post.title}</h2>
                    {post.summary && <p className={"mt-2 text-sm text-foreground/60 line-clamp-2"}>{post.summary}</p>}
                    <div className={"mt-3 flex items-center text-sm text-muted-foreground"}>
                        <time>{dayjs(post.created_at).fromNow()}</time>
                        {post.category &&
                            post.category.map((category) => (
                                <Link
                                    href={"/category/" + category.name}
                                    className={"z-5 ml-2 hover:text-blue-500"}
                                    key={category.id}
                                >
                                    {category.name}
                                </Link>
                            ))}
                    </div>
                </div>
                {post.cover && (
                    <div className="relative w-28 min-w-28 max-sm:min-w-26">
                        <div className="pb-[75%]"></div>
                        <div className="absolute w-full h-full top-0 left-0 rounded-xl overflow-hidden">
                            <img className="w-full h-full object-cover" src={post.cover} alt={post.title} />
                        </div>
                    </div>
                )}
            </article>
        </li>
    )
}

const PostList = ({data = []}) => {
    return <ul>{data.length ? data.map((post) => <PostItem key={post.id} post={post} />) : <EmptyContent />}</ul>
}

export default PostList
