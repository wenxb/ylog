"use client"
import MainColumn from "@/components/module/common/MainColumn"
import {useImmer} from "use-immer"
import UploadCover from "@/components/page/write/UploadCover"
import PageHeader from "@/components/module/common/PageHeader"
import {Button} from "@/components/ui/button"
import {useEffect, useRef, useState} from "react"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Badge} from "@/components/ui/badge"
import useAxios from "@/lib/api/useAxios"
import dayjs from "@/utils/dayjs"
import {useToast} from "@/hooks/use-toast"
import {usePathname, useRouter, useSearchParams} from "next/navigation"
import {ToastAction} from "@/components/ui/toast"
import {Input} from "@/components/ui/input"
import {Separator} from "@/components/ui/separator"
import {PlateEditor} from "@/components/module/editor/plate-editor"
import {plateToHtml} from "@/components/plate-ui/export-toolbar-button"
import LoadingBox from "@/components/common/LoadingBox"

const Page = () => {
    const [dataForm, setDataForm] = useImmer({
        cover: "",
        title: "",
        content: "",
        summary: "",
        status: "draft",
        categories: [],
    })
    const [categoryInput, setCategoryInput] = useState("")
    const [category, setCategory] = useImmer([])
    const [loading, setLoading] = useState(false)
    const [saveTime, setSaveTime] = useState(0)
    const {toast} = useToast()
    const router = useRouter()
    const pathname = usePathname()
    const query = useSearchParams()
    const postId = query.get("postId")
    const editorRef = useRef(null)

    const initData = () => {
        if (postId) {
            setLoading(true)
            useAxios
                .get("/api/admin/posts/" + postId)
                .then((res) => {
                    setDataForm({
                        ...dataForm,
                        ...(res.data?.post || {}),
                        categories: res.data?.category,
                    })
                    if (editorRef.current) {
                        editorRef.current.setValue(res.data?.post?.content || [])
                    }
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }
    useEffect(() => {
        if (postId) {
            initData()
        }
    }, [postId])

    const getCategoryData = () => {
        useAxios.get("/api/category").then((res) => {
            setCategory(res.data)
        })
    }

    useEffect(() => {
        getCategoryData()
    }, [])

    const handleChangeCategory = (cate, checked) => {
        setDataForm((d) => {
            const findIndex = d.categories.findIndex((c) => c.id === cate.id)
            if (!checked) {
                d.categories.splice(findIndex, 1)
            } else {
                d.categories.push(cate)
            }
        })
    }

    const handleUploadCover = (url) => {
        setDataForm((d) => {
            d.cover = url
        })
    }

    const handleSubmit = async (status = "draft") => {
        if (!editorRef.current) return

        const editor_value = editorRef.current.getValue()
        const content_html = await plateToHtml(editor_value)

        useAxios
            .post("/api/admin/posts", {
                ...dataForm,
                content: editor_value,
                content_html,
                categories: dataForm.categories.map((c) => c.id),
                status,
            })
            .then((res) => {
                setDataForm((d) => {
                    d.id = res.data.id
                })
                toast({
                    title: "保存成功",
                    variant: "info",
                    action:
                        status !== "draft" ? (
                            <ToastAction onClick={() => router.push("/post/" + res.data.id)} altText="查看文章">
                                查看
                            </ToastAction>
                        ) : null,
                })
                setSaveTime(Date.now())
                router.replace(pathname + "?postId=" + res.data.id)
            })
            .catch((err) => {
                toast({
                    title: "保存失败",
                    description: err,
                    variant: "destructive",
                })
            })
    }

    const handleKeyDown = (e) => {
        e.stopPropagation()
        if (e.code === "Enter") {
            e.preventDefault()
            if (!categoryInput) return

            useAxios
                .post("/api/admin/category", {
                    name: categoryInput,
                })
                .then(() => {
                    setCategoryInput("")
                    getCategoryData()
                })
        }
    }

    return (
        <MainColumn>
            <LoadingBox loading={loading}>
                <div>
                    <PageHeader
                        isSticky={false}
                        hideBack
                        title={
                            <div className="flex items-center gap-3">
                                {saveTime > 0 && (
                                    <div className="text-sm font-normal whitespace-nowrap text-muted-foreground">
                                        保存于 · {dayjs(saveTime).format("HH:mm")}
                                    </div>
                                )}
                            </div>
                        }
                        action={
                            <div className="flex items-center gap-2">
                                {dataForm.id && (
                                    <Button size="sm" variant="link" className="pl-0 text-muted-foreground">
                                        <a href="/compose/write">新文章</a>
                                    </Button>
                                )}
                                <Button onClick={() => handleSubmit("draft")} size="sm" variant="ghost">
                                    草稿
                                </Button>
                                <Button onClick={() => handleSubmit("publish")} size="sm">
                                    {dataForm.status === "publish" ? "保存" : "发布"}
                                </Button>
                            </div>
                        }
                    />
                    <div>
                        <UploadCover
                            url={dataForm.cover}
                            onRemove={() =>
                                setDataForm((d) => {
                                    d.cover = ""
                                })
                            }
                            onSuccess={handleUploadCover}
                        />
                    </div>
                    <div className="flex w-full items-center justify-between border-b px-4 py-2">
                        <div className="flex items-center gap-1">
                            {dataForm.categories.map((category) => (
                                <Badge
                                    className="cursor-pointer"
                                    variant="secondary"
                                    onClick={() => handleChangeCategory(category, false)}
                                    key={category.id}
                                >
                                    {category.name}
                                </Badge>
                            ))}
                        </div>
                        <div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        分类
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-auto">
                                    {category.map((c) => (
                                        <DropdownMenuCheckboxItem
                                            key={c.id}
                                            checked={dataForm.categories.findIndex((item) => item.id === c.id) !== -1}
                                            onCheckedChange={(v) => handleChangeCategory(c, v)}
                                        >
                                            {c.name}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                    <Separator className="my-2" />
                                    <div className="px-2 pb-1">
                                        <Input
                                            value={categoryInput}
                                            onChange={(e) => setCategoryInput(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            className="h-8 text-sm"
                                            placeholder="添加新分类"
                                        />
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <div className="my-5 px-4">
                        <input
                            value={dataForm.title}
                            onChange={(e) =>
                                setDataForm((d) => {
                                    d.title = e.target.value
                                })
                            }
                            className="w-full rounded-none bg-transparent text-3xl font-semibold opacity-60 outline-0 focus-visible:opacity-100 disabled:opacity-100"
                            type="text"
                            placeholder="标题"
                        />
                    </div>
                    <div className="pb-12">
                        <PlateEditor ref={editorRef} />
                    </div>
                </div>
            </LoadingBox>
        </MainColumn>
    )
}

export default Page
