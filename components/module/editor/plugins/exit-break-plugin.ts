"use client"

import {ExitBreakPlugin} from "@udecode/plate-break/react"
import {HEADING_LEVELS} from "@udecode/plate-heading"
import {KbdPlugin} from "@udecode/plate-kbd/react"
import {CodePlugin} from "@udecode/plate-basic-marks/react"

export const exitBreakPlugin = ExitBreakPlugin.configure({
    options: {
        rules: [
            {
                hotkey: "mod+enter",
            },
            {
                before: true,
                hotkey: "mod+shift+enter",
            },
            {
                hotkey: "enter",
                level: 1,
                query: {
                    allow: [...HEADING_LEVELS, KbdPlugin.key, CodePlugin.key],
                    end: true,
                    start: true,
                },
                relative: true,
            },
        ],
    },
})
