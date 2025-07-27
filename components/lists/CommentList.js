"use client"
import {Avatar, Button, Dropdown, Menu, Message, Modal} from "@arco-design/web-react"
import {useState} from "react"
import {useImmer} from "use-immer"
import CommentForm from "@/components/module/comment/CommentForm"
import LoadingBox from "@/components/common/LoadingBox"
import EmptyContent from "@/components/module/EmptyContent"
import dayjs from "@/utils/dayjs"
import useAxios from "@/lib/api/useAxios"

import {usePathname, useRouter} from "next/navigation"
import {LOGIN_URL} from "@/lib/constant"
import {IconDelete, IconMoreVertical} from "@arco-design/web-react/icon"

const CommentItem = ({item, currentUser, onReply, onDelete, parent}) => {
    const handleReply = () => {
        if (onReply) onReply(item.id)
    }

    const handleDelete = () => {
        return useAxios
            .delete("/api/comment", {
                data: {
                    id: item.id,
                },
            })
            .then(() => {
                if (onDelete) onDelete()
                Message.success("删除成功!")
            })
    }

    const handleConfirmDelete = () => {
        Modal.confirm({
            title: "删除此条评论",
            content: "确定要删除吗？",
            okButtonProps: {
                status: "danger",
            },
            onOk: () => {
                return new Promise((resolve, reject) => {
                    handleDelete()
                        .then(() => resolve(true))
                        .catch(() => reject())
                }).catch((e) => {
                    Message.error({
                        content: "操作失败!",
                    })
                })
            },
        })
    }

    return (
        <div className="group flex gap-2 border-b p-4">
            <div>
                <Avatar size={36}>{item.userImage ? <img alt="" src={item.userImage}></img> : item.userName}</Avatar>
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
                        <div className="text-sm text-muted-foreground">{dayjs(item.created_at).fromNow()}</div>
                    </div>
                    <div>
                        {currentUser?.id === item.userId && (
                            <Dropdown
                                droplist={
                                    <Menu className={"min-w-[150px]"}>
                                        <Menu.Item onClick={handleConfirmDelete} key="delete">
                                            <IconDelete className={"mr-3 text-red-500!"} />
                                            <span className={"text-red-500!"}>删除</span>
                                        </Menu.Item>
                                    </Menu>
                                }
                                trigger="click"
                                position="bottom"
                            >
                                <Button className={"-mt-2!"} type="text" shape={"circle"} icon={<IconMoreVertical />} />
                            </Dropdown>
                        )}
                    </div>
                </div>
                <div className="my-1">{item.content}</div>
                <div className="mt-2 flex w-full items-center justify-between">
                    <div></div>
                    <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 max-sm:visible max-sm:opacity-100">
                        <Button onClick={handleReply}>回复</Button>
                    </div>
                </div>
            </div>
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
                    <EmptyContent text="故事讲完了，但讨论才刚刚开始。" />
                )}
            </LoadingBox>
            <Modal footer={null} title={"回复"} visible={open} onCancel={() => setOpen(false)}>
                <div>
                    <div className="flex gap-2">
                        <Avatar size={36}>
                            {dialogForm.targetUser.image ? (
                                <img alt={""} src={dialogForm.targetUser.image}></img>
                            ) : (
                                dialogForm.targetUser.name
                            )}
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
            </Modal>
        </div>
    )
}

export default CommentList
