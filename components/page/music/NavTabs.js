"use client"
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {usePathname, useRouter} from "next/navigation"

const NavTabs = () => {
    const router = useRouter()
    const pathname = usePathname()

    return (
        <Tabs className="h-full w-full" defaultValue={pathname} onValueChange={router.replace}>
            <TabsList className="h-full w-full">
                <TabsTrigger className={"h-full flex-1"} value="/music">
                    首页
                </TabsTrigger>
                <TabsTrigger className={"h-full flex-1"} value="/music/my">
                    我的
                </TabsTrigger>
            </TabsList>
        </Tabs>
    )
}

export default NavTabs
