import {clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function formatCount(num) {
    if (num >= 1e3) {
        return (num / 1e3).toFixed(1) + "K" // 千以上统一转换为 K
    } else {
        return num.toString() // 小于千则直接返回原始数字
    }
}

export function buildCommentTree(data) {
    // 将数据按树形结构组织
    const commentMap = {}

    // 将评论按 id 存储，并初始化每个评论的 children 数组
    data.forEach((comment) => {
        commentMap[comment.id] = {
            ...comment,
            children: [],
            parent: {},
        }
    })

    // 构建树形结构，将子评论根据 parentId 加入到父评论的 children 数组中
    const tree = []
    data.forEach((comment) => {
        if (comment.parentId) {
            const parentComment = commentMap[comment.parentId]
            if (parentComment) {
                const child = commentMap[comment.id]
                child.parent.userName = parentComment.userName
                parentComment.children.push(child)
            }
        } else {
            // 顶级评论直接加入树中
            tree.push(commentMap[comment.id])
        }
    })

    // 将所有评论扁平化到第一级的 children 数组中
    const flattenChildren = (comments) => {
        comments.forEach((comment) => {
            if (comment.children.length > 0) {
                // 扁平化当前评论的所有子评论
                comment.children.forEach((childComment) => {
                    comment.children.push(...childComment.children) // 扁平化子评论的 children
                    childComment.children.length = 0
                    flattenChildren([childComment]) // 递归处理下一级的子评论
                })
            }
        })
    }

    // 扁平化树形结构，确保所有子评论都加入父评论的 children 中
    flattenChildren(tree)

    // 返回扁平化后的树形结构
    return tree
}
