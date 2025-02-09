"use client"
import Link from "next/link"
import {cn} from "@/utils"
import {usePathname} from "next/navigation"

const MenuItem = ({children, icon, href, ...props}) => {
    const pathname = usePathname()
    const isActive = pathname === href

    return (
        <li className="max-sm:w-full">
            <Link
                className={cn(
                    "group flex h-14 w-full items-center rounded-full px-4 transition-colors hover:bg-accent max-xl:w-14 max-sm:w-full",
                )}
                href={href}
                {...props}
            >
                <div className={cn("text-foreground/80", isActive && "text-foreground")}>{icon}</div>
                <span
                    className={cn(
                        "ml-4 text-xl text-foreground/80 max-xl:hidden max-sm:block",
                        isActive && "font-bold text-foreground"
                    )}
                >
                    {children}
                </span>
            </Link>
        </li>
    )
}

export default MenuItem
