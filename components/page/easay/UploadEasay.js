"use client"
import {useImmer} from "use-immer"
import {useEffect, useRef, useState} from "react"
import {EditorState} from "draft-js"
import useAxios from "@/lib/api/useAxios"
import {getFileExtension} from "@/utils/file"
import {allowImageSuffix, allowVideoSuffix} from "@/lib/constant"
import {v4 as uuidV4} from "uuid"
import DraftEditor from "@/components/common/DraftEditor"
import MediaList from "@/components/lists/MediaList"
import {Separator} from "@/components/ui/separator"
import {usePathname, useRouter, useSearchParams} from "next/navigation"
import {convertFromHTML} from "draft-convert"
import {Button, Message, Notification} from "@arco-design/web-react"
import {IconImage} from "@arco-design/web-react/icon"

const initForm = {
    id: null,
    content: "",
    media: [],
}
const UploadEasay = ({onSubmit}) => {
    const [dataForm, setDataForm] = useImmer({...initForm})
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    const [isUploading, setIsUploading] = useState(false)
    const mediaInputRef = useRef(null)
    const query = useSearchParams()
    const id = query.get("id")
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (id) {
            useAxios.get("/api/admin/easay/" + id).then((res) => {
                setDataForm((d) => {
                    d.id = res.data.easay.id
                    d.content = res.data.easay.content
                    setEditorState(EditorState.createWithContent(convertFromHTML(res.data.easay.content)))
                    d.media = Array.isArray(res.data.media)
                        ? res.data.media.map((item) => ({
                              ...item,
                              status: "success",
                          }))
                        : []
                })
            })
        }
    }, [id])

    const handleSelectFile = () => {
        mediaInputRef.current?.click()
    }

    const uploadMedia = async (item) => {
        const file = item.file
        let easay_id = dataForm.id
        setDataForm((d) => {
            const find = d.media.find((i) => i.fileId === item.fileId)
            find.status = "uploading"
        })

        if (!dataForm.id) {
            const res = await useAxios.post("/api/admin/easay", {content: ""})
            if (!res.data) return
            setDataForm((d) => {
                d.id = res.data.id
            })
            easay_id = res.data.id
        }

        const formData = new FormData()
        formData.append("file", file)
        formData.append("easay_id", easay_id)
        setIsUploading(true)
        await useAxios
            .post("/api/upload/media", formData)
            .then((res) => {
                const data = res.data
                setDataForm((d) => {
                    const find = d.media.find((i) => i.fileId === item.fileId)
                    find.status = "success"
                    find.id = data.id
                    find.url = data.url
                    find.type = data.type
                })
            })
            .catch(() => {
                Notification.error({
                    title: "上传失败",
                    content: file.name,
                })
                setDataForm((d) => {
                    const find = d.media.find((i) => i.fileId === item.fileId)
                    find.status = "error"
                })
            })
            .finally(() => {
                setIsUploading(false)
            })
    }

    const handleInputChange = async (e) => {
        if (dataForm.media.length >= 5) return
        const files = Array.from(e.target.files).filter((file) => {
            const suffix = getFileExtension(file.name)
            return allowImageSuffix.includes(suffix) || allowVideoSuffix.includes(suffix)
        })

        const uploadList = []
        files.forEach((file) => {
            uploadList.push({
                fileId: uuidV4(),
                file: file,
                status: "init",
                id: "",
                url: "",
                type: file.type,
            })
        })

        setDataForm((d) => {
            d.media.push(...uploadList)
        })

        for (const item of uploadList) {
            await uploadMedia(item)
        }

        e.target.value = ""
    }

    const handleSubmit = () => {
        if (!dataForm.content && !dataForm.media.length) {
            Message.error("内容不能为空")
            return
        }

        useAxios
            .post("/api/admin/easay", {
                content: dataForm.content,
                ...(dataForm.id ? {id: dataForm.id} : {}),
            })
            .then(() => {
                setDataForm({...initForm})
                setEditorState(EditorState.createEmpty())

                Message.success(dataForm.id ? "保存成功" : "发布成功")

                router.replace(pathname)
                if (onSubmit) onSubmit()
            })
            .catch(() => {
                Message.error("发布失败")
            })
    }

    const handleEditorChange = (html) => {
        setDataForm((d) => {
            d.content = html
        })
    }

    const handleRemoveMedia = async (id) => {
        setDataForm((d) => {
            d.media = d.media.filter((item) => item.id !== id)
        })

        if (!id) return

        await useAxios.delete(`/api/admin/media`, {
            data: {
                ids: [id],
            },
        })
    }

    return (
        <div className="border-t border-b p-4">
            <DraftEditor
                placeholder="今天发生了什么"
                editorState={editorState}
                setEditorState={setEditorState}
                onChange={handleEditorChange}
                className="min-h-28"
            />
            <div className="py-3">
                <MediaList data={dataForm.media} onItemRemove={handleRemoveMedia} />
            </div>
            <Separator />
            <div className="-mb-2 flex w-full items-center justify-between pt-2">
                <div className="-ml-2">
                    <Button
                        icon={<IconImage style={{fontSize: 20}} />}
                        shape={"circle"}
                        type={"text"}
                        disabled={dataForm.media.length >= 5}
                        onClick={handleSelectFile}
                    >
                        <input
                            onChange={handleInputChange}
                            className="hidden"
                            multiple
                            ref={mediaInputRef}
                            accept="image/*,video/*"
                            type="file"
                        />
                    </Button>
                </div>
                <div>
                    <Button type={"primary"} disabled={isUploading} onClick={handleSubmit}>
                        {dataForm.id ? "保存" : "发布"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default UploadEasay
