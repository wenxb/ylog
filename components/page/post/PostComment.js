"use client"
import CommentForm from "@/components/module/comment/CommentForm"
import useAxios from "@/lib/api/useAxios"
import CommentList from "@/components/lists/CommentList"
import {useToast} from "@/hooks/use-toast"
import {useImmer} from "use-immer"
import {useEffect, useState} from "react"
import {useSession} from "next-auth/react"
import {CircleUserRoundIcon, Loader2} from "lucide-react"
import {usePathname, useRouter} from "next/navigation"
import {LOGIN_URL} from "@/lib/constant"
import {buildCommentTree} from "@/utils"
import {Button} from "@arco-design/web-react"

const PostComment = ({id}) => {
    const {toast} = useToast()
    const [data, setData] = useImmer([])
    const [loading, setLoading] = useState(false)
    const {data: session} = useSession()
    const router = useRouter()
    const pathname = usePathname()
    const [count, setCount] = useState(0)
    const [page, setPage] = useState(1)

    const getData = (p, replace = false) => {
        useAxios
            .get(`/api/comment`, {
                params: {
                    page: p,
                    postId: id,
                },
            })
            .then((res) => {
                const tree = buildCommentTree(res.data?.rows || [])
                setData((d) => {
                    if (replace) {
                        d.length = 0
                        d.push(...tree)
                    } else {
                        d.push(...tree)
                    }
                })
                setCount(res.data.count)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const handleSubmit = (v) => {
        setLoading(true)
        useAxios
            .post("/api/comment", {
                ...v,
                postId: id,
            })
            .then(() => {
                setPage(1)
                getData(1, true)
            })
            .catch((err) => {
                toast({
                    title: err,
                    variant: "destructive",
                })
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const handleLoadNext = () => {
        setPage(page + 1)
        getData(page + 1)
    }

    useEffect(() => {
        getData(1)
    }, [])

    return (
        <>
            {session ? (
                <CommentForm
                    session={session}
                    loading={loading}
                    className="border-b px-4 pb-4"
                    onSubmit={handleSubmit}
                />
            ) : (
                <div
                    onClick={() => router.push(`${LOGIN_URL}?callbackUrl=` + pathname)}
                    className="flex min-h-[150px] cursor-pointer flex-col items-center justify-center gap-4 border-b"
                >
                    <CircleUserRoundIcon className="text-muted-foreground" />
                    <div className="text-sm text-muted-foreground select-none">登录以开始评论</div>
                </div>
            )}
            <CommentList
                onDelete={() => getData(1, true)}
                session={session}
                loading={loading}
                data={data}
                onSubmit={handleSubmit}
            />
            {data.length < count && (
                <div className="mt-6 flex w-full justify-center">
                    <Button onClick={handleLoadNext} disabled={loading}>
                        {loading && <Loader2 className="animate-spin" />}
                        加载更多
                    </Button>
                </div>
            )}
        </>
    )
}

export default PostComment
