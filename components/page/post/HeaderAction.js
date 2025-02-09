"use client"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button"
import {CopyIcon, EllipsisVerticalIcon, PenLineIcon, Trash2Icon} from "lucide-react"
import {useRouter} from "next/navigation"
import useAxios from "@/lib/api/useAxios"
import Auth from "@/utils/Auth"
import {useToast} from "@/hooks/use-toast"

const HeaderAction = ({postId}) => {
    const router = useRouter()
    const {toast} = useToast()

    const handleRemove = () => {
        if (!postId) return
        useAxios
            .delete("/api/admin/posts/", {
                data: {
                    ids: [postId],
                },
            })
            .then(() => {
                router.replace("/")
            })
    }

    const handleCopyLink = () => {
        const link = `${window.location.origin}/post/${postId}`
        if(!navigator.clipboard) return
        navigator.clipboard
            .writeText(link)
            .then(() => {
                toast({
                    title: "已复制到剪切板",
                    variant: "info",
                })
            })
            .catch((err) => {
                toast({
                    title: "复制失败！",
                })
                console.error("复制失败！", err)
            })
    }

    return (
        <>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <EllipsisVerticalIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem onClick={handleCopyLink}>
                            <CopyIcon />
                            复制链接
                        </DropdownMenuItem>
                        {Auth.isAdmin() && (
                            <>
                                <DropdownMenuItem onClick={() => router.push("/compose/write?postId=" + postId)}>
                                    <PenLineIcon />
                                    编辑
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleRemove} className="text-red-500 hover:text-red-500!">
                                    <Trash2Icon />
                                    删除
                                </DropdownMenuItem>
                            </>
                        )}

                    </DropdownMenuContent>
                </DropdownMenu>
        </>
    )
}

export default HeaderAction
