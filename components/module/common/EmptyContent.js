import React from "react"
import {LeafyGreenIcon} from "lucide-react"

const EmptyContent = ({text = "空空如也。"}) => {
    return (
        <div className="flex min-h-[150px] flex-col items-center justify-center gap-2">
            <LeafyGreenIcon className="text-3xl" />
            <div className="text-base">{text}</div>
        </div>
    )
}

export default EmptyContent
