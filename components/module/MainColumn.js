import {cn} from "@/utils"

const MainColumn = ({children, className}) => {
    return (
        <div
            className={cn(
                "relative flex h-full w-[650px] flex-col border-r border-l max-xl:w-[600px] max-md:w-full max-sm:border-none max-sm:pb-12",
                className
            )}
        >
            <div className={"flex grow flex-col"}>{children}</div>
        </div>
    )
}

export default MainColumn
