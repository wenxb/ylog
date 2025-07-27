"use client"
import {Button} from "@arco-design/web-react"
import {ProgressActivity} from "@/components/common/icons"
import {IconClose, IconCloseCircle} from "@arco-design/web-react/icon"

const MediaList = ({data = [], onItemRemove, isSimple = false}) => {
    const handleItemRemove = (id) => {
        if (onItemRemove) onItemRemove(id)
    }

    return (
        <div className="flex w-full gap-2 overflow-x-auto">
            {data.map((item) => (
                <div key={item?.id || item?.fileId} className="relative w-32 min-w-32">
                    <div className="pb-[100%]"></div>
                    {!!onItemRemove && (
                        <div className="absolute top-1 right-1 z-2">
                            <Button
                                icon={<IconClose className={"text-[20px]"} />}
                                shape={"circle"}
                                onClick={() => handleItemRemove(item.id)}
                            ></Button>
                        </div>
                    )}

                    <div className="absolute top-0 left-0 z-1 h-full w-full overflow-hidden rounded-xl bg-accent select-none">
                        {item.status === "success" || isSimple ? (
                            <>
                                {item.type?.startsWith("image/") && item.url && (
                                    <img className="h-full w-full object-cover" src={item.url} alt="" />
                                )}

                                {item.type?.startsWith("video/") && item.url && (
                                    <video className="h-full w-full object-cover" controls src={item.url} />
                                )}
                            </>
                        ) : (
                            <div className="flex h-full w-full items-center justify-center">
                                {item.status === "uploading" && <ProgressActivity className={"text-3xl"} isActive />}
                                {item.status === "error" && (
                                    <div className="flex flex-col items-center gap-1">
                                        <IconCloseCircle className="text-2xl text-red-500!" />
                                        <div className="text-sm text-muted-foreground text-red-500">上传失败</div>
                                    </div>
                                )}
                                {item.status === "init" && (
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="text-sm text-muted-foreground">等待上传...</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default MediaList
