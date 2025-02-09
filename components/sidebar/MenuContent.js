import {BoxIcon, CompassIcon, HouseIcon, NotebookPenIcon, UserRoundIcon, WrenchIcon} from "lucide-react"
import MenuItem from "@/components/sidebar/MenuItem"
import {useAppStore} from "@/stores/app"

const MenuContent = () => {
    const app = useAppStore()

    return (
        <ul className={"flex w-full flex-col max-xl:items-center max-sm:items-start max-sm:px-3"}>
            <MenuItem icon={<HouseIcon />} href="/">
                文章
            </MenuItem>
            {app.settings.tool_enable === "true" && (
                <MenuItem icon={<WrenchIcon />} href="/tools">
                    工具
                </MenuItem>
            )}
            <MenuItem icon={<NotebookPenIcon />} href="/easay">
                随记
            </MenuItem>
            <MenuItem icon={<CompassIcon />} href="/links">
                导航
            </MenuItem>
            <MenuItem icon={<BoxIcon />} href="/category">
                分类
            </MenuItem>
            <MenuItem icon={<UserRoundIcon />} href="/about">
                关于我
            </MenuItem>
        </ul>
    )
}

export default MenuContent
