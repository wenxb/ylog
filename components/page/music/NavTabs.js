"use client"
import {Tabs} from "@arco-design/web-react"
import {usePathname, useRouter} from "next/navigation"

const NavTabs = () => {
    const router = useRouter()
    const pathname = usePathname()

    return (
        <Tabs activeKey={pathname} onChange={(key) => router.replace(key)} className="h-full w-full">
            <Tabs.TabPane key="/music" title="首页" />
            <Tabs.TabPane key="/music/my" title="我的" />
        </Tabs>
    )
}

export default NavTabs
