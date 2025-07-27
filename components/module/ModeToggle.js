"use client"
import * as React from "react"
import {useEffect, useState} from "react"
import {Moon, Sun, SunMoonIcon} from "lucide-react"
import {useTheme} from "next-themes"

import {Button} from "@/components/ui/button"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip"

const selectedClass = "bg-blue-500/10 text-blue-500 focus:bg-blue-500/10 focus:text-blue-500"

export function ModeToggle() {
    const {theme, setTheme} = useTheme()
    const [themed, setThemed] = useState("system")
    useEffect(() => {
        setTheme(theme)
    }, [theme])

    return (
        <DropdownMenu>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            {themed === "dark" && <Moon />}
                            {themed === "light" && <Sun />}
                            {themed === "system" && <SunMoonIcon />}
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>主题</TooltipContent>
            </Tooltip>
            <DropdownMenuContent className={"z-[1201] w-40"} align="center">
                <DropdownMenuItem className={themed === "light" && selectedClass} onClick={() => setTheme("light")}>
                    <Sun />
                    亮色
                </DropdownMenuItem>
                <DropdownMenuItem className={themed === "dark" && selectedClass} onClick={() => setTheme("dark")}>
                    <Moon />
                    暗色
                </DropdownMenuItem>
                <DropdownMenuItem className={themed === "system" && selectedClass} onClick={() => setTheme("system")}>
                    <SunMoonIcon />
                    自动
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
