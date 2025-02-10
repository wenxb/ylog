"use client"

import {BlockMenuPlugin} from "@udecode/plate-selection/react"

import {BlockContextMenu} from "@/components/plate-ui/block-context-menu"

export const blockMenuPlugins = [
    BlockMenuPlugin.configure({
        render: {aboveEditable: BlockContextMenu},
    }),
] as const
