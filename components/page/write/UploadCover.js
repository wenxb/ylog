"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {CameraIcon, CloudUploadIcon, Trash2Icon} from "lucide-react"
import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import {useEffect, useRef, useState} from "react"
import {getFileExtension} from "@/utils/file"
import {allowImageSuffix} from "@/lib/constant"
import useAxios from "@/lib/api/useAxios"
import LoadingBox from "@/components/common/LoadingBox"
import isUrl from "is-url"
import {useToast} from "@/hooks/use-toast"
import {cn} from "@/utils"

const UploadCover = ({onSuccess, url, onRemove}) => {
    const [show, setShow] = useState(false)
    const inputRef = useRef(null)
    const dialogRef = useRef(null)
    const inputUrlRef = useRef(null)
    const [uploading, setUploading] = useState(false)
    const [imageUrl, setImageUrl] = useState("")
    const {toast} = useToast()

    const handleInputChange = (e) => {
        if (dialogRef.current && dialogRef.current?.contains(e.target)) {
            e.preventDefault()
        }
        if (uploading) return
        let files = e?.clipboardData?.files || e.target.files || e?.dataTransfer?.files
        if (!files) return
        files = Array.from(files).filter((file) => {
            const file_suffix = getFileExtension(file.name)
            return allowImageSuffix.includes(file_suffix)
        })
        if (files.length <= 0) return
        const firstFile = files[0]
        const formData = new FormData()
        formData.append("file", firstFile)
        setUploading(true)
        useAxios
            .post("/api/upload/image", formData)
            .then((res) => {
                handleSubmit(res.data?.url)
            })
            .catch((err) => {
                toast({
                    title: err,
                    variant: "destructive",
                })
            })
            .finally(() => {
                setUploading(false)
            })

        e.target.value = ""
    }

    useEffect(() => {
        const handlePaste = (event) => {
            if (event.target === inputUrlRef.current) return
            handleInputChange(event)
        }

        window.addEventListener("paste", handlePaste)
        return () => {
            window.removeEventListener("paste", handlePaste)
        }
    }, [handleInputChange])

    const handleSubmit = (url) => {
        if (onSuccess) onSuccess(url)
        setShow(false)
    }

    const handleParseUrl = () => {
        if (!imageUrl || (imageUrl && !isUrl(imageUrl))) {
            toast({
                title: "链接不合法",
                variant: "destructive",
            })
            return
        }
        setUploading(true)
        useAxios
            .post("/api/upload/uploadCoverByUrl", {url: imageUrl})
            .then((res) => {
                handleSubmit(res.data?.url)
                setImageUrl("")
            })
            .catch((err) => {
                toast({
                    title: err,
                    variant: "destructive",
                })
            })
            .finally(() => {
                setUploading(false)
            })
    }

    const handleRemoveImg = (e) => {
        e.preventDefault()
        if (onRemove) onRemove()
    }

    return (
        <div className="relative flex h-56 w-full items-center justify-center border-b bg-gray-100 dark:bg-accent">
            {url && (
                <div className="absolute top-0 left-0 z-1 h-full w-full">
                    <img className="h-full w-full max-w-full object-cover" src={url} alt="" />
                </div>
            )}
            <Dialog open={show} onOpenChange={setShow}>
                <DialogTrigger asChild>
                    <div className={cn("relative z-2 flex gap-2", url && "absolute right-0 bottom-0 m-3")}>
                        <Button size="icon" variant="secondary" className="bg-black/50 text-white hover:bg-black/30">
                            <CameraIcon />
                        </Button>
                        {url && (
                            <Button
                                onClick={handleRemoveImg}
                                size="icon"
                                variant="secondary"
                                className="bg-black/50 text-white hover:bg-black/30"
                            >
                                <Trash2Icon />
                            </Button>
                        )}
                    </div>
                </DialogTrigger>
                <DialogContent className="max-w-md" ref={dialogRef}>
                    <LoadingBox noBg={false} loading={uploading} childClass="gap-4">
                        <DialogHeader>
                            <DialogTitle>上传封面</DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-5">
                            <div className="grid w-full items-center gap-1.5">
                                <Label>本地图片</Label>
                                <div
                                    onClick={() => inputRef.current?.click()}
                                    onDrop={handleInputChange}
                                    onDragOver={(e) => e.preventDefault()}
                                    tabIndex={0}
                                    autoFocus
                                    className="flex h-28 cursor-pointer items-center justify-center rounded-md border transition-all hover:bg-accent"
                                >
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <div className="text-3xl">
                                            <CloudUploadIcon />
                                        </div>
                                        <p className="text-sm">选择或粘贴图片到此处</p>
                                    </div>
                                    <Input
                                        ref={inputRef}
                                        onChange={handleInputChange}
                                        className="hidden"
                                        type="file"
                                        accept={allowImageSuffix.map((item) => "." + item).join(",")}
                                    />
                                </div>
                            </div>
                            <div className="grid w-full items-center gap-1.5">
                                <Label>通过URL</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        ref={inputUrlRef}
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        type="text"
                                        placeholder="https://xxx/xx.jpg"
                                    />
                                    <Button onClick={handleParseUrl} variant="outline">
                                        解析
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="mt-3">
                            <Button onClick={() => setShow(false)} variant="ghost">
                                取消
                            </Button>
                            <Button>保存</Button>
                        </DialogFooter>
                    </LoadingBox>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UploadCover
