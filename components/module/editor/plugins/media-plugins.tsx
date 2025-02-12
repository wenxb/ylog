"use client"

import {CaptionPlugin} from "@udecode/plate-caption/react"
import {ImagePlugin, MediaEmbedPlugin, PlaceholderPlugin} from "@udecode/plate-media/react"

import {ImagePreview} from "@/components/plate-ui/image-preview"
import {MediaUploadToast} from "@/components/plate-ui/media-upload-toast"

export const mediaPlugins = [
    ImagePlugin.extend({
        options: {disableUploadInsert: true},
        render: {afterEditable: ImagePreview},
    }),
    MediaEmbedPlugin,
    CaptionPlugin.configure({
        options: {
            plugins: [ImagePlugin, MediaEmbedPlugin],
        },
    }),
    PlaceholderPlugin.configure({
        options: {disableEmptyPlaceholder: true},
        render: {afterEditable: MediaUploadToast},
    }),
] as const
