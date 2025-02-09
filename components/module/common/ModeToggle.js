"use client"
import * as React from "react"
import {Moon, Sun, SunMoonIcon} from "lucide-react"
import {useTheme} from "next-themes"

import {Button} from "@/components/ui/button"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip"

const selectedClass = "bg-blue-500/10 text-blue-500 focus:bg-blue-500/10 focus:text-blue-500"
export function ModeToggle() {
    const {theme, setTheme} = useTheme()

    return (
        <DropdownMenu>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>主题</TooltipContent>
            </Tooltip>
            <DropdownMenuContent className={"w-40 z-[1201]"} align="center">
                <DropdownMenuItem className={theme === "light" && selectedClass} onClick={() => setTheme("light")}>
                    <Sun />
                    亮色
                </DropdownMenuItem>
                <DropdownMenuItem className={theme === "dark" && selectedClass} onClick={() => setTheme("dark")}>
                    <Moon />
                    暗色
                </DropdownMenuItem>
                <DropdownMenuItem className={theme === "system" && selectedClass} onClick={() => setTheme("system")}>
                    <SunMoonIcon />
                    自动
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
