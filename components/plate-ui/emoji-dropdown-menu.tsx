"use client"

import React from "react"

import {type EmojiDropdownMenuOptions, useEmojiDropdownMenuState} from "@udecode/plate-emoji/react"
import {Smile} from "lucide-react"

import {emojiCategoryIcons, emojiSearchIcons} from "./emoji-icons"
import {EmojiPicker} from "./emoji-picker"
import {EmojiToolbarDropdown} from "./emoji-toolbar-dropdown"
import {ToolbarButton} from "./toolbar"

type EmojiDropdownMenuProps = {
    options?: EmojiDropdownMenuOptions
} & React.ComponentPropsWithoutRef<typeof ToolbarButton>

const i18n = {
    categories: {
        activity: "活动",
        custom: "自定义",
        flags: "旗帜",
        foods: "食物与饮品",
        frequent: "常用",
        nature: "动物与自然",
        objects: "物体",
        people: "表情符号与人物",
        places: "旅行与地点",
        symbols: "符号",
    },
    clear: "清空",
    pick: "选择一个表情符号...",
    search: "搜索所有表情符号",
    searchNoResultsSubtitle: "未找到该表情符号",
    searchNoResultsTitle: "哦，不！",
    searchResult: "搜索结果",
    skins: {
        "1": "默认",
        "2": "浅色",
        "3": "浅色偏中",
        "4": "中等色",
        "5": "中暗色",
        "6": "暗色",
        choose: "选择默认肤色",
    },
}
export function EmojiDropdownMenu({options, ...props}: EmojiDropdownMenuProps) {
    const {emojiPickerState, isOpen, setIsOpen} = useEmojiDropdownMenuState(options)

    return (
        <EmojiToolbarDropdown
            control={
                <ToolbarButton pressed={isOpen} tooltip="表情符号" isDropdown {...props}>
                    <Smile />
                </ToolbarButton>
            }
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        >
            <EmojiPicker
                {...emojiPickerState}
                icons={{
                    categories: emojiCategoryIcons,
                    search: emojiSearchIcons,
                }}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                settings={options?.settings}
                i18n={i18n}
            />
        </EmojiToolbarDropdown>
    )
}
