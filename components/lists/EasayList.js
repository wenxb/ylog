"use client"
import MediaList from "@/components/lists/MediaList"
import dayjs from "@/utils/dayjs"
import DOMPurify from "dompurify"
import {Button, Message, Modal} from "@arco-design/web-react"
import {usePathname, useRouter} from "next/navigation"
import Auth from "@/utils/Auth"
import useAxios from "@/lib/api/useAxios"
import EmptyContent from "@/components/module/EmptyContent"

const Item = ({item, actionAfterFlush = false}) => {
    const safeHtml = DOMPurify.sanitize(item.content)
    const router = useRouter()
    const pathname = usePathname()

    const handleRemove = (id) => {
        return useAxios
            .delete("/api/admin/easay/" + id)
            .then(() => {
                Message.success("删除成功")
                if (actionAfterFlush) {
                    router.replace(pathname)
                }
            })
            .catch(() => {
                Message.error("删除失败")
            })
    }

    const handleShowDelete = (id) => {
        Modal.confirm({
            title: "确认删除",
            content: "确定要删除这条数据吗？此操作无法撤销。",
            okButtonProps: {status: "danger"},
            onOk: () => {
                return handleRemove(id)
            },
        })
    }

    return (
        <div className="group border-b px-4 py-3">
            <div className="my-2 text-base" dangerouslySetInnerHTML={{__html: safeHtml}}></div>
            {item?.media && (
                <div className="my-3">
                    <MediaList data={item.media} isSimple />
                </div>
            )}
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    <time>{dayjs(item?.created_at).fromNow()}</time>
                </div>
                {Auth.isAdmin() && (
                    <div className="invisible space-x-2! group-hover:visible max-sm:visible">
                        <Button type={"text"} onClick={() => router.push("/easay?id=" + item.id)}>
                            编辑
                        </Button>
                        <Button type={"secondary"} status={"danger"} onClick={() => handleShowDelete(item.id)}>
                            删除
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

const EasayList = ({data = [], actionAfterFlush = false}) => {
    return (
        <div>
            {data.length ? (
                data.map((item) => <Item actionAfterFlush={actionAfterFlush} key={item.id} item={item} />)
            ) : (
                <EmptyContent text={"博客主人正在码字中，敬请期待！"} />
            )}
        </div>
    )
}

export default EasayList
