"use client"

import {useState} from "react"
import {Button, Dropdown, Form, Input, Menu, Message, Modal} from "@arco-design/web-react"
import {IconDelete, IconEdit, IconMoreVertical} from "@arco-design/web-react/icon"
import Auth from "@/utils/Auth"
import useAxios from "@/lib/api/useAxios"
import {useRouter} from "next/navigation"

const HeaderAction = ({categoryName}) => {
    const isAdmin = Auth.isAdmin()
    const router = useRouter()
    const [editVisible, setEditVisible] = useState(false)
    const [name, setName] = useState("")

    if (!isAdmin) return null

    // 编辑确认
    const handleEditConfirm = () => {
        return useAxios
            .post("/api/admin/category/updateByName", {
                name: categoryName,
                newName: name,
            })
            .then(() => {
                Message.success("修改成功")
                router.replace("/category/" + name)
                setEditVisible(false)
            })
            .catch((err) => {
                Message.error(err)
            })
    }

    const handleDelete = () => {
        Modal.confirm({
            title: "确认删除",
            content: "确定要删除此分类吗？此操作无法撤销。",
            okText: "删除",
            cancelText: "取消",
            okButtonProps: {status: "danger"},
            onOk: () => {
                useAxios
                    .delete("/api/admin/category/deleteByName", {
                        data: {name: name},
                    })
                    .then(() => {
                        Message.success("已删除！")
                        router.replace("/category")
                    })
            },
        })
    }

    return (
        <>
            <Dropdown
                trigger="click"
                position="br"
                droplist={
                    <Menu className="w-36">
                        <Menu.Item
                            key="edit"
                            onClick={() => {
                                setEditVisible(true)
                            }}
                        >
                            <IconEdit className="mr-3" />
                            编辑
                        </Menu.Item>
                        <Menu.Item key="delete" onClick={handleDelete}>
                            <IconDelete className="mr-3 text-red-500!" />
                            <span className="text-red-500!">删除</span>
                        </Menu.Item>
                    </Menu>
                }
            >
                <Button shape="circle" type="text" icon={<IconMoreVertical />} />
            </Dropdown>

            {/* 编辑 Modal */}
            <Modal
                mountOnEnter={false}
                title="编辑名称"
                visible={editVisible}
                onOk={handleEditConfirm}
                onCancel={() => setEditVisible(false)}
                okText="保存"
                cancelText="取消"
            >
                <Form autoComplete="off">
                    <Form.Item label="名称">
                        <Input value={name} onChange={setName} placeholder="请输入新的名称" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default HeaderAction
