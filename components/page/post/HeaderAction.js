"use client"
import {useRouter} from "next/navigation"
import useAxios from "@/lib/api/useAxios"
import Auth from "@/utils/Auth"
import {Button, Dropdown, Menu, Message} from "@arco-design/web-react"
import {IconCopy, IconDelete, IconEdit, IconMoreVertical} from "@arco-design/web-react/icon"

const HeaderAction = ({postId}) => {
    const router = useRouter()

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
        if (!navigator.clipboard) return
        navigator.clipboard
            .writeText(link)
            .then(() => {
                Message.success("已复制到剪切板")
            })
            .catch((err) => {
                Message.error("复制失败!")
                console.error("复制失败！", err)
            })
    }

    const isAdmin = Auth.isAdmin()

    return (
        <>
            <Dropdown
                trigger={"click"}
                position={"br"}
                droplist={
                    <Menu className="w-36">
                        <Menu.Item onClick={handleCopyLink} key="copyLink">
                            <IconCopy className={"mr-3"} />
                            复制链接
                        </Menu.Item>
                        {isAdmin && (
                            <Menu.Item key={"edit"} onClick={() => router.push("/compose/write?postId=" + postId)}>
                                <IconEdit className={"mr-3"} />
                                编辑
                            </Menu.Item>
                        )}
                        {isAdmin && (
                            <Menu.Item key={"delete"} onClick={handleRemove} className="text-red-500!">
                                <IconDelete className={"mr-3"} />
                                删除
                            </Menu.Item>
                        )}
                    </Menu>
                }
            >
                <Button shape={"circle"} type={"text"} icon={<IconMoreVertical />}></Button>
            </Dropdown>
        </>
    )
}

export default HeaderAction
