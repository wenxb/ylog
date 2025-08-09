"use client"
import * as React from "react"
import {useEffect, useState} from "react"
import {Moon, Sun, SunMoonIcon} from "lucide-react"
import {useTheme} from "next-themes"

import {Button, Dropdown, Menu, Tooltip} from "@arco-design/web-react"

const selectedClass = "bg-blue-500/10 text-blue-500 focus:bg-blue-500/10 focus:text-blue-500"

export function ModeToggle() {
    const {theme, setTheme} = useTheme()
    const [themed, setThemed] = useState("system")
    useEffect(() => {
        setTheme(theme)
    }, [theme])

    const menu = (
        <Menu onClickMenuItem={(key) => {setTheme(key); setThemed(key)}}>
            <Menu.Item key="light" className={themed === "light" ? selectedClass : undefined}>
                <Sun /> 亮色
            </Menu.Item>
            <Menu.Item key="dark" className={themed === "dark" ? selectedClass : undefined}>
                <Moon /> 暗色
            </Menu.Item>
            <Menu.Item key="system" className={themed === "system" ? selectedClass : undefined}>
                <SunMoonIcon /> 自动
            </Menu.Item>
        </Menu>
    )

    return (
        <Dropdown droplist={menu} trigger="click" position="br">
            <Tooltip content="主题">
                <Button shape="circle" type="text">
                    {themed === "dark" && <Moon />}
                    {themed === "light" && <Sun />}
                    {themed === "system" && <SunMoonIcon />}
                </Button>
            </Tooltip>
        </Dropdown>
    )
}
