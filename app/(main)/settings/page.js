"use client"
import MainColumn from "@/components/module/common/MainColumn"
import PageHeader from "@/components/module/common/PageHeader"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {Button} from "@/components/ui/button"
import {useImmer} from "use-immer"
import {useEffect, useState} from "react"
import useAxios from "@/lib/api/useAxios"
import {useToast} from "@/hooks/use-toast"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Input} from "@/components/ui/input"
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import {MoonIcon, SunIcon, SunMoonIcon} from "lucide-react"
import {cn} from "@/utils"
import {Separator} from "@/components/ui/separator"
import {Switch} from "@/components/ui/switch"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Avatar, AvatarImage} from "@/components/ui/avatar"
import {useFilePicker} from "use-file-picker"
import matter from "gray-matter"
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {markdownToPlate, plateToHtml} from "@/components/plate-ui/export-toolbar-button"
import LoadingBox from "@/components/common/LoadingBox"

const Title = ({children}) => {
    return <div className="text-base">{children}</div>
}

const MyFormItem = ({children}) => <div className="space-y-2">{children}</div>

const Code = ({children}) => <code className="mx-0.5 rounded-sm bg-accent px-1">{children}</code>

const ThemeItem = ({type, title, icon, selected}) => {
    return (
        <Label
            className={cn(
                "w-1/3 cursor-pointer rounded-lg border-2 p-3 transition-all hover:bg-accent",
                selected && "border-blue-500 bg-blue-500/10 hover:bg-blue-500/10"
            )}
        >
            <div className="flex min-h-20 flex-col items-center justify-center gap-3 text-primary">
                <RadioGroupItem className="hidden" value={type} />
                <div className="text-2xl">{icon}</div>
                <div className="text-base font-medium">{title}</div>
            </div>
        </Label>
    )
}

const initForm = {
    site_url: "",
    site_title: "",
    site_description: "",
    site_keyword: "",
    site_icon: "",
    default_theme: "",
    user_image: "",
    user_name: "",
    social_github: "",
    social_facebook: "",
    social_email: "",
    social_bilibili: "",
    social_x: "",
    enable_comment: true,
    icp_str: "",
    image_api_url: "",
    image_api_key: "",
    image_album_id: "",
    music_cookie: "",
    home_desc_mode: "one_api",
    home_desc_text: "",
    tool_enable: "true",
}
const Page = () => {
    const [dataForm, setDataForm] = useImmer({...initForm})
    const [oldAvatar, setOldAvatar] = useState("")
    const [tab, setTab] = useState("routine")
    const [importPosts, setImportPosts] = useImmer([])
    const [showImport, setShowImport] = useState(false)
    const [loading, setLoading] = useState(false)
    const {toast} = useToast()

    const onFilesSelected = async ({plainFiles}) => {
        setLoading(true)
        setShowImport(true)
        for (const file of plainFiles) {
            const text = await file.text()
            const {data, content} = matter(text)
            let item = {}
            item["importStatus"] = "init"
            item["title"] = data?.title || file.name.replace(/^.*[\\\/]/, "").replace(/\.[^/.]+$/, "")
            const category = data.category || data.categories
            const record_cate = []
            if (Array.isArray(category) && category.length) {
                for (const ca of category) {
                    const c = await useAxios
                        .get("/api/admin/category/getByName", {
                            params: {name: ca},
                        })
                        .catch(() => {
                            setLoading(false)
                        })
                    record_cate.push(c.data.id)
                }

                item["categories"] = record_cate
            }
            if (typeof category === "string") {
                const c = await useAxios
                    .get("/api/admin/category/getByName", {
                        params: {name: category},
                    })
                    .catch(() => {
                        setLoading(false)
                    })
                item["categories"] = [c.data.id]
            }
            if (data.image || data.cover) {
                item["cover"] = data.cover || data.image
            }
            if (data.date) {
                item["date"] = new Date(data.date).toISOString()
            }
            const nodes = markdownToPlate(content)
            item["content"] = nodes
            item["content_html"] = await plateToHtml(nodes)

            const {importStatus, ...body} = item
            await useAxios
                .post("/api/admin/posts", {
                    ...body,
                    status: "publish",
                })
                .then(() => {
                    item["importStatus"] = "success"
                })
                .catch(() => {
                    item["importStatus"] = "error"
                })

            setImportPosts((d) => {
                d.push({...item})
            })
        }
        setLoading(false)
    }
    const {openFilePicker} = useFilePicker({
        accept: ".md",
        onFilesSelected,
    })

    function getData() {
        useAxios.get("/api/admin/settings").then((res) => {
            setDataForm({
                ...dataForm,
                ...res.data,
            })

            setOldAvatar(res.data.user_image)
        })
    }

    useEffect(() => {
        getData()
    }, [])

    const handleSubmit = () => {
        useAxios.post("/api/admin/settings", {...dataForm}).then(() => {
            toast({
                title: "保存成功",
                variant: "info",
            })
            getData()
        })
    }

    const handleTabChange = (v) => {
        setTab(v)
    }

    return (
        <MainColumn>
            <PageHeader title="设置" hideBack />
            <div className="w-full pb-10">
                <Tabs value={tab} onValueChange={handleTabChange} defaultValue="routine" className="w-full">
                    <TabsList>
                        <TabsTrigger value="routine">常规</TabsTrigger>
                        <TabsTrigger value="appearance">外观</TabsTrigger>
                        <TabsTrigger value="user">账户</TabsTrigger>
                        <TabsTrigger value="site">网站</TabsTrigger>
                        <TabsTrigger value="storage">外部存储</TabsTrigger>
                        <TabsTrigger value="other">其他</TabsTrigger>
                        <TabsTrigger value="sundry">杂项</TabsTrigger>
                    </TabsList>
                    <div className="w-full p-4">
                        <TabsContent className="space-y-6" value="routine">
                            <MyFormItem>
                                <Title>网站标题</Title>
                                <Input
                                    value={dataForm.site_title}
                                    onChange={(e) =>
                                        setDataForm((d) => {
                                            d.site_title = e.target.value
                                        })
                                    }
                                />
                            </MyFormItem>
                            <MyFormItem>
                                <Title>网站说明</Title>
                                <Textarea
                                    value={dataForm.site_description}
                                    onChange={(e) =>
                                        setDataForm((d) => {
                                            d.site_description = e.target.value
                                        })
                                    }
                                />
                                <Label>描述你的站点</Label>
                            </MyFormItem>
                            <MyFormItem>
                                <Title>网站关键字</Title>
                                <Input
                                    value={dataForm.site_keyword}
                                    onChange={(e) =>
                                        setDataForm((d) => {
                                            d.site_keyword = e.target.value
                                        })
                                    }
                                />
                                <Label>
                                    建议用英文逗号<Code>,</Code>隔开，一般3-8个左右，太多会有堆砌嫌疑
                                </Label>
                            </MyFormItem>
                            <MyFormItem>
                                <Title>网站图标</Title>
                                <Input
                                    placeholder="/icon.jpg"
                                    value={dataForm.site_icon}
                                    onChange={(e) =>
                                        setDataForm((d) => {
                                            d.site_icon = e.target.value
                                        })
                                    }
                                />
                                <Label>
                                    可以是http开头的链接，或者将文件放到<Code>public</Code>目录下，然后填入
                                    <Code>/[你的文件路径]</Code>
                                </Label>
                            </MyFormItem>
                        </TabsContent>
                        <TabsContent className="space-y-6" value="appearance">
                            <MyFormItem>
                                <Title>默认主题</Title>
                                <RadioGroup
                                    value={dataForm.default_theme}
                                    onValueChange={(value) =>
                                        setDataForm((d) => {
                                            d.default_theme = value
                                        })
                                    }
                                    defaultValue="system"
                                >
                                    <div className="flex gap-2">
                                        <ThemeItem
                                            selected={dataForm.default_theme === "system"}
                                            title="自动"
                                            type="system"
                                            icon={<SunMoonIcon />}
                                        />
                                        <ThemeItem
                                            selected={dataForm.default_theme === "light"}
                                            title="亮色"
                                            type="light"
                                            icon={<SunIcon />}
                                        />
                                        <ThemeItem
                                            selected={dataForm.default_theme === "dark"}
                                            title="暗色"
                                            type="dark"
                                            icon={<MoonIcon />}
                                        />
                                    </div>
                                </RadioGroup>
                            </MyFormItem>
                            <Separator className="-mx-4" />
                            <MyFormItem>
                                <Title>首页顶部文字</Title>
                                <div>
                                    <Select
                                        value={dataForm.home_desc_mode}
                                        onValueChange={(v) =>
                                            setDataForm((d) => {
                                                d.home_desc_mode = v
                                            })
                                        }
                                    >
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue placeholder="选择一项" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="one_api">一言API</SelectItem>
                                            <SelectItem value="text">自定义文字</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {dataForm.home_desc_mode === "one_api" && (
                                        <Label className="mt-2">随机显示一言api文字</Label>
                                    )}
                                </div>
                                <div className={cn("hidden", dataForm.home_desc_mode === "text" && "block")}>
                                    <Textarea
                                        value={dataForm.home_desc_text}
                                        onChange={(e) =>
                                            setDataForm((d) => {
                                                d.home_desc_text = e.target.value
                                            })
                                        }
                                    ></Textarea>
                                    <Label className="mt-2">支持多组文字，每一组文字占一行</Label>
                                </div>
                            </MyFormItem>
                            <Separator className="-mx-4" />
                            <MyFormItem>
                                <Title>工具</Title>
                                <div>
                                    <Select
                                        value={dataForm.tool_enable}
                                        onValueChange={(v) =>
                                            setDataForm((d) => {
                                                d.tool_enable = v
                                            })
                                        }
                                    >
                                        <SelectTrigger className="w-[120px]">
                                            <SelectValue placeholder="选择一项" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="true">启用</SelectItem>
                                            <SelectItem value="fase">禁用</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Label>是否启用工具页面</Label>
                            </MyFormItem>
                        </TabsContent>
                        <TabsContent className="space-y-6" value="user">
                            <MyFormItem>
                                <Title>头像</Title>
                                {oldAvatar && (
                                    <Avatar className="my-2 size-24">
                                        <AvatarImage src={oldAvatar} />
                                    </Avatar>
                                )}

                                <Input
                                    value={dataForm.user_image}
                                    onChange={(e) =>
                                        setDataForm((d) => {
                                            d.user_image = e.target.value
                                        })
                                    }
                                ></Input>
                                <Label>本地图片或远程地址</Label>
                            </MyFormItem>
                            <MyFormItem>
                                <Title>作者名</Title>
                                <Input
                                    value={dataForm.user_name}
                                    onChange={(e) =>
                                        setDataForm((d) => {
                                            d.user_name = e.target.value
                                        })
                                    }
                                ></Input>
                                <Label>网站、文章中我的显示昵称</Label>
                            </MyFormItem>
                            <MyFormItem>
                                <Title>社交链接</Title>
                                <div className="flex items-center gap-2">
                                    <Label className="min-w-16">Github</Label>
                                    <Input
                                        value={dataForm.social_github}
                                        onChange={(e) =>
                                            setDataForm((d) => {
                                                d.social_github = e.target.value
                                            })
                                        }
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label className="min-w-16">Facebook</Label>
                                    <Input
                                        value={dataForm.social_facebook}
                                        onChange={(e) =>
                                            setDataForm((d) => {
                                                d.social_facebook = e.target.value
                                            })
                                        }
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label className="min-w-16">邮件</Label>
                                    <Input
                                        value={dataForm.social_email}
                                        onChange={(e) =>
                                            setDataForm((d) => {
                                                d.social_email = e.target.value
                                            })
                                        }
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label className="min-w-16">Bilibili</Label>
                                    <Input
                                        value={dataForm.social_bilibili}
                                        onChange={(e) =>
                                            setDataForm((d) => {
                                                d.social_bilibili = e.target.value
                                            })
                                        }
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label className="min-w-16">X</Label>
                                    <Input
                                        value={dataForm.social_x}
                                        onChange={(e) =>
                                            setDataForm((d) => {
                                                d.social_x = e.target.value
                                            })
                                        }
                                    />
                                </div>
                            </MyFormItem>
                        </TabsContent>
                        <TabsContent className="space-y-6" value="site">
                            <MyFormItem>
                                <div className="flex w-full items-center justify-between">
                                    <Title>开启评论</Title>
                                    <Switch
                                        checked={
                                            typeof dataForm.enable_comment === "string"
                                                ? dataForm.enable_comment === "true"
                                                : dataForm.enable_comment
                                        }
                                        onCheckedChange={(v) =>
                                            setDataForm((d) => {
                                                d.enable_comment = v
                                            })
                                        }
                                    />
                                </div>
                                <Label>是否开启网站评论功能</Label>
                            </MyFormItem>
                            <Separator className="-mx-4" />
                            <MyFormItem>
                                <Title>ICP备案号</Title>
                                <Input
                                    value={dataForm.icp_str}
                                    onChange={(e) =>
                                        setDataForm((d) => {
                                            d.icp_str = e.target.value
                                        })
                                    }
                                />
                                <Label>例如：萌ICP备 12345678号</Label>
                            </MyFormItem>
                        </TabsContent>
                        <TabsContent className="space-y-6" value="storage">
                            <div>
                                适用于所有<Code>chevereto</Code>建立的图床
                                <br />
                                推荐：
                                <a className="text-blue-500" target="_blank" href="https://img.juyovo.com">
                                    橘柚图床
                                </a>
                            </div>
                            <MyFormItem>
                                <Title>图床API</Title>
                                <Input
                                    value={dataForm.image_api_url}
                                    onChange={(e) =>
                                        setDataForm((d) => {
                                            d.image_api_url = e.target.value
                                        })
                                    }
                                ></Input>
                                <Label>图床的api接口地址，例如：https://img.juyovo.com/api/1/upload</Label>
                            </MyFormItem>
                            <MyFormItem>
                                <Title>图床API_KEY</Title>
                                <Input
                                    value={dataForm.image_api_key}
                                    onChange={(e) =>
                                        setDataForm((d) => {
                                            d.image_api_key = e.target.value
                                        })
                                    }
                                ></Input>
                                <Label>打开图床，点击设置-API-重新生成密钥</Label>
                            </MyFormItem>
                            <MyFormItem>
                                <Title>图床相册ID（可选）</Title>
                                <Input
                                    value={dataForm.image_album_id}
                                    onChange={(e) =>
                                        setDataForm((d) => {
                                            d.image_album_id = e.target.value
                                        })
                                    }
                                ></Input>
                                <Label>
                                    首先创建一个相册-进入相册页面-详细-找到<Code>id_encoded</Code>的值复制到这里
                                    <br />
                                    tip: 可以对单个相册配置公开性，例如将相册设为私密相册，这样上传的图片不会出现在主页
                                </Label>
                            </MyFormItem>
                        </TabsContent>
                        <TabsContent className="space-y-6" value="other">
                            <MyFormItem>
                                <Title>音乐cookie</Title>
                                <Textarea
                                    value={dataForm.music_cookie}
                                    onChange={(e) =>
                                        setDataForm((d) => {
                                            d.music_cookie = e.target.value
                                        })
                                    }
                                />
                                <Label>
                                    填写cookie以使用音乐功能 <br />
                                    获取方法：登录网页版网易云音乐-打开开发者工具-应用-Cookie，找到<Code>MUSIC_U</Code>
                                    对应的值复制到这里
                                </Label>
                            </MyFormItem>
                            <Separator />
                            <MyFormItem>
                                <Title>Markdown</Title>
                                <Button onClick={openFilePicker} disabled={loading} variant="outline">
                                    导入Markdown
                                </Button>
                            </MyFormItem>
                        </TabsContent>
                        <TabsContent className="space-y-6" value="sundry">
                        </TabsContent>
                    </div>
                </Tabs>

                <div className="mt-7 px-5">
                    <div className="flex w-full items-center justify-end gap-3">
                        <Button onClick={handleSubmit}>保存</Button>
                    </div>
                </div>
            </div>
            <Dialog open={showImport} onOpenChange={setShowImport}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>导入</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <LoadingBox loading={loading}>
                            {importPosts.map((post, index) => (
                                <div key={index} className="flex items-center justify-between gap-2 py-2">
                                    <div>{post.title}</div>
                                    <div>
                                        {post.importStatus === "success" && (
                                            <span className="text-green-500">导入成功</span>
                                        )}
                                        {post.importStatus === "error" && (
                                            <span className="text-red-500">导入失败</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </LoadingBox>
                    </div>
                    <DialogFooter>
                        <Button
                            disabled={loading}
                            onClick={() => {
                                setShowImport(false)
                                setImportPosts((d) => {
                                    d.length = 0
                                })
                            }}
                        >
                            确定
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </MainColumn>
    )
}

export default Page
