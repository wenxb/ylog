"use client"
import MediaList from "@/components/lists/MediaList"
import dayjs from "@/utils/dayjs"
import DOMPurify from "dompurify"
import {Button} from "@/components/ui/button"
import {usePathname, useRouter} from "next/navigation"
import Auth from "@/utils/Auth"
import useAxios from "@/lib/api/useAxios"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {useToast} from "@/hooks/use-toast"
import EmptyContent from "@/components/module/common/EmptyContent"

const Item = ({item, actionAfterFlush = false}) => {
    const safeHtml = DOMPurify.sanitize(item.content)
    const router = useRouter()
    const pathname = usePathname()
    const {toast} = useToast()

    const handleRemove = (id) => {
        useAxios
            .delete("/api/admin/easay/" + id)
            .then(() => {
                toast({
                    title: "删除成功",
                    variant: "info",
                })
                if (actionAfterFlush) {
                    router.replace(pathname)
                }
            })
            .catch((e) => {
                toast({
                    title: "删除失败",
                    description: e,
                    variant: "destructive",
                })
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
                    <div className="invisible group-hover:visible max-sm:visible">
                        <Button onClick={() => router.push("/easay?id=" + item.id)} size="sm" variant="link">
                            编辑
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button size="sm" variant="link" className="text-red-500">
                                    删除
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>确认删除</AlertDialogTitle>
                                    <AlertDialogDescription>确定要删除吗？此操作不可恢复</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>取消</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleRemove(item.id)}>确定</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
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
                <EmptyContent />
            )}
        </div>
    )
}

export default EasayList
