"use client"
import Link from "next/link"
import {HomeLine} from "@/components/common/icons"
import {Button} from "@/components/ui/button"
import {MenuIcon, PlusIcon} from "lucide-react"
import {useAppStore} from "@/stores/app"

const LinkItem = ({label, icon, href, isLink = true, ...p}) => {
    const Com = isLink ? Link : "div"
    return (
        <Com href={href} {...p} className="flex flex-1 flex-col items-center justify-center">
            {icon}
            <span className="text-sm">{label}</span>
        </Com>
    )
}

const GlobalBottomNav = () => {
    const app = useAppStore()

    return (
        <nav
            role="navigation"
            className="fixed bottom-0 left-0 z-[30] hidden h-12 w-full border-t bg-background max-sm:flex"
        >
            <div className="flex flex-1 items-center">
                <LinkItem href="/" icon={<HomeLine className="text-xl" />} label="首页" />
                <Button size="sm" asChild>
                    <Link href="/compose/write">
                        <PlusIcon className="!size-4 stroke-[2.5]" />
                    </Link>
                </Button>
                <LinkItem isLink={false} onClick={() => app.setShowMobileSide(true)} icon={<MenuIcon size={20}/>} label="菜单" />
            </div>
        </nav>
    )
}

export default GlobalBottomNav
