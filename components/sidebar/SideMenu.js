"use client"
import SideTop from "@/components/sidebar/SideTop"
import MenuContent from "@/components/sidebar/MenuContent"
import SideBottom from "@/components/sidebar/SideBottom"
import {cn} from "@/utils"
import {useAppStore} from "@/stores/app"

const SideMenu = () => {
    const app = useAppStore()

    return (
        <header
            className={cn(
                "flex grow justify-end max-sm:fixed max-sm:top-0 max-sm:left-0 max-sm:z-[1200] max-sm:w-full max-sm:justify-start",
            )}
        >
            <div className="relative z-[2] ml-16 w-[255px] max-xl:ml-0 sm:max-xl:w-[75px]">
                <div className={cn(
                    "fixed top-0 flex bg-background scrollbar-hide h-full w-[inherit] flex-col overflow-y-auto pl-4 max-xl:pl-0 transition-transform max-sm:-translate-x-full",
                    app.showMobileSide && "max-sm:translate-x-0"
                )}>
                    <SideTop />
                    <div className="-ml-4 w-full max-xl:-ml-0 max-sm:mt-2">
                        <MenuContent />
                    </div>
                    <div className="my-1 flex-1"></div>
                    <SideBottom />
                </div>
            </div>
            <div
                onClick={() => app.setShowMobileSide(false)}
                className={cn(
                    "fixed top-0 left-0 z-[1] h-full w-full bg-black/30 transition-all",
                    app.showMobileSide ? "visible opacity-100" : "invisible opacity-0",
                    "sm:pointer-events-none sm:hidden sm:h-0 sm:w-0"
                )}
            ></div>
        </header>
    )
}

export default SideMenu
