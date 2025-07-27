"use client"
import MainColumn from "@/components/module/MainColumn"
import {useImmer} from "use-immer"
import UploadCover from "@/components/page/write/UploadCover"
import PageHeader from "@/components/module/PageHeader"
import {Button, Checkbox, Divider, Dropdown, Input, Menu, Message, Tag, Typography} from "@arco-design/web-react"
import {useEffect, useRef, useState} from "react"
import useAxios from "@/lib/api/useAxios"
import dayjs from "@/utils/dayjs"
import {usePathname, useRouter, useSearchParams} from "next/navigation"
import LoadingBox from "@/components/common/LoadingBox"
import dynamic from "next/dynamic"

const EditorBlock = dynamic(async () => (await import("@/components/module/EditorBlock")).default, {
    ssr: false,
})

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
                        categories: res.data?.category.map((category) => category.id),
                    })
                    if (editorRef.current) {
                        editorRef.current.render({
                            blocks: JSON.parse(res.data?.post?.content) || [],
                        })
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

    const handleChangeCategory = (cate) => {
        setDataForm((d) => {
            const findIndex = d.categories.findIndex((c) => c === cate.id)
            if (findIndex !== -1) {
                d.categories.splice(findIndex, 1)
            } else {
                d.categories.push(cate.id)
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

        const content = (await editorRef.current.save()).blocks

        useAxios
            .post("/api/admin/posts", {
                ...dataForm,
                content,
                categories: dataForm.categories,
                status,
            })
            .then((res) => {
                setDataForm((d) => {
                    d.id = res.data.id
                })
                Message.success("保存成功")
                setSaveTime(Date.now())
                router.replace(pathname + "?postId=" + res.data.id)
            })
            .catch((err) => {
                console.error(err)
                Message.error("保存失败")
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
                .then((res) => {
                    setCategoryInput("")
                    getCategoryData()

                    setDataForm((d) => {
                        d.categories.push(res.data.id)
                    })
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
                                    <Button color="secondary" href={"/compose/write"} type="text">
                                        新文章
                                    </Button>
                                )}
                                <Button onClick={() => handleSubmit("draft")} type="text">
                                    草稿
                                </Button>
                                <Button type="primary" onClick={() => handleSubmit("publish")}>
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
                            {category
                                .filter((c) => {
                                    return dataForm.categories.includes(c.id)
                                })
                                .map((category) => (
                                    <Tag
                                        checkable
                                        defaultChecked
                                        onCheck={() => handleChangeCategory(category)}
                                        key={category.id}
                                    >
                                        # {category.name}
                                    </Tag>
                                ))}
                        </div>
                        <div>
                            <Dropdown
                                trigger="click"
                                droplist={
                                    <Menu
                                        onClickMenuItem={() => {
                                            return false
                                        }}
                                    >
                                        {category?.length ? (
                                            category.map((c) => (
                                                <Menu.Item
                                                    onClick={() => handleChangeCategory(c)}
                                                    value={c.id}
                                                    key={c.id}
                                                >
                                                    <Checkbox
                                                        checked={
                                                            dataForm.categories.findIndex((item) => item === c.id) !==
                                                            -1
                                                        }
                                                    >
                                                        {c.name}
                                                    </Checkbox>
                                                </Menu.Item>
                                            ))
                                        ) : (
                                            <Typography.Text className="flex justify-center pt-2" type="secondary">
                                                暂无分类
                                            </Typography.Text>
                                        )}
                                        <Divider />
                                        <div className="px-2 pb-1">
                                            <Input
                                                value={categoryInput}
                                                onChange={(value) => setCategoryInput(value)}
                                                onKeyDown={handleKeyDown}
                                                placeholder="添加新分类"
                                            />
                                        </div>
                                    </Menu>
                                }
                            >
                                <Button type="text">分类</Button>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="my-8 px-5">
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
                    <div className="px-5">
                        <EditorBlock onReady={(instance) => (editorRef.current = instance)} />
                    </div>
                </div>
            </LoadingBox>
        </MainColumn>
    )
}

export default Page
