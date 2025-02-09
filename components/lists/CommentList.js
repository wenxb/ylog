"use client"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Button} from "@/components/ui/button"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {EllipsisVerticalIcon, Trash2Icon} from "lucide-react"
import {Dialog, DialogContent, DialogDescription, DialogTitle} from "@/components/ui/dialog"
import {useState} from "react"
import {useImmer} from "use-immer"
import CommentForm from "@/components/module/comment/CommentForm"
import LoadingBox from "@/components/common/LoadingBox"
import EmptyContent from "@/components/module/common/EmptyContent"
import dayjs from "@/utils/dayjs"
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
} from "@/components/ui/alert-dialog"
import {usePathname, useRouter} from "next/navigation"
import {LOGIN_URL} from "@/lib/constant"

const CommentItem = ({item, currentUser, onReply, onDelete, parent}) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const handleReply = () => {
        if (onReply) onReply(item.id)
    }

    const handleDelete = () => {
        useAxios
            .delete("/api/comment", {
                data: {
                    id: item.id,
                },
            })
            .then(() => {
                if (onDelete) onDelete()
            })
    }

    return (
        <div className="group flex gap-2 border-b p-4">
            <div>
                <Avatar>
                    <AvatarImage src={item.userImage}></AvatarImage>
                    <AvatarFallback>{item.userName}</AvatarFallback>
                </Avatar>
            </div>
            <div className="flex-1">
                <div className="flex w-full items-center justify-between gap-2">
                    <div>
                        <div className="line-clamp-1 font-semibold">
                            {item.userName}
                            {parent?.userName && (
                                <span className="ml-2 text-sm font-normal text-muted-foreground">
                                    @{parent?.userName}
                                </span>
                            )}
                            {currentUser?.id === item.userId && (
                                <span className="ml-2 rounded-md bg-pink-300 px-1.5 py-0.5 text-[11px] font-normal text-white dark:bg-pink-400/70">
                                    我
                                </span>
                            )}
                        </div>
                        <div className="text-[14px] text-muted-foreground">{dayjs(item.created_at).fromNow()}</div>
                    </div>
                    <div>
                        {currentUser?.id === item.userId && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        className="-mt-1 -mr-1 size-8 min-w-8 text-muted-foreground"
                                        variant="ghost"
                                        size="icon"
                                    >
                                        <EllipsisVerticalIcon />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-36">
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setShowDeleteModal(true)
                                        }}
                                        className="text-red-500 hover:text-red-500!"
                                    >
                                        <Trash2Icon />
                                        删除
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
                <div className="my-1">{item.content}</div>
                <div className="mt-2 flex w-full items-center justify-between">
                    <div></div>
                    <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 max-sm:opacity-100 max-sm:visible">
                        <Button onClick={handleReply} className="text-muted-foreground" variant="ghost" size="sm">
                            回复
                        </Button>
                    </div>
                </div>
            </div>
            <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>删除回复</AlertDialogTitle>
                        <AlertDialogDescription>确定要删除回复吗？</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>确定</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

const CommentList = ({onSubmit, data, loading, session, onDelete}) => {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const [dialogForm, setDialogForm] = useImmer({
        content: "",
        targetUser: {
            name: "",
            image: "",
        },
        targetId: "",
        created_at: "",
    })
    const currentUser = session?.user

    const handleReply = (item) => {
        if (!currentUser?.id) {
            router.push(`${LOGIN_URL}?callbackUrl=` + pathname)
            return
        }

        setDialogForm((d) => {
            d.targetId = item.id
            d.targetUser.name = item.userName
            d.targetUser.image = item.userImage
            d.created_at = item.created_at
            d.content = item.content
        })
        setOpen(true)
    }

    return (
        <div>
            <LoadingBox loading={loading} noBg={false}>
                {data?.length ? (
                    data.map((item) => (
                        <div key={item.id}>
                            <CommentItem
                                onDelete={onDelete}
                                onReply={() => handleReply(item)}
                                currentUser={currentUser}
                                item={item}
                            />
                            <div>
                                {item.children?.length > 0 &&
                                    item.children.map((chi) => (
                                        <CommentItem
                                            key={chi.id}
                                            parent={chi?.parent}
                                            item={chi}
                                            onDelete={onDelete}
                                            onReply={() => handleReply(chi)}
                                            currentUser={currentUser}
                                        />
                                    ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <EmptyContent text="暂无回复。" />
                )}
            </LoadingBox>
            <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
                <DialogContent>
                    <DialogTitle>回复</DialogTitle>
                    <DialogDescription></DialogDescription>
                    <div>
                        <div className="flex gap-2">
                            <Avatar>
                                <AvatarImage src={dialogForm.targetUser.image}></AvatarImage>
                                <AvatarFallback>{dialogForm.targetUser.name}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center">
                                    <span className="line-clamp-1 font-semibold">{dialogForm.targetUser.name}</span>
                                    <span className="ml-3 text-muted-foreground">
                                        {" "}
                                        · {dayjs(dialogForm.created_at).fromNow()}
                                    </span>
                                </div>
                                <div className="my-1">{dialogForm.content}</div>
                            </div>
                        </div>
                        <div className="mt-2 flex items-center">
                            <div className="mx-4 h-10 w-[2px] bg-gray-300"></div>
                        </div>
                        <div className="mt-3">
                            <CommentForm
                                session={session}
                                loading={loading}
                                onSubmit={(f) => {
                                    onSubmit({
                                        content: f.content,
                                        parentId: dialogForm.targetId,
                                    })
                                    setOpen(false)
                                }}
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CommentList
