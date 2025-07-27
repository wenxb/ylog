import React from "react"
import {LeafyGreenIcon} from "lucide-react"

const EmptyContent = ({text = "空白也是一种美，下一篇故事等你开启。"}) => {
    return (
        <div className="flex min-h-[150px] flex-col items-center justify-center gap-4">
            <LeafyGreenIcon className="text-3xl text-muted-foreground" />
            <div className="text-base text-muted-foreground">{text}</div>
        </div>
    )
}

export default EmptyContent
