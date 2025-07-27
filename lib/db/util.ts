import {boolean, timestamp} from "drizzle-orm/mysql-core"
import {sql} from "drizzle-orm"

export function generateUniqueString(length: number = 12): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let uniqueString = ""
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length)
        uniqueString += characters[randomIndex]
    }
    return uniqueString
}

export const timestamps = {
    created_at: timestamp({mode: "string", fsp: 3})
        .default(sql`CURRENT_TIMESTAMP(3)`)
        .notNull(),
    updated_at: timestamp({mode: "string", fsp: 3})
        .default(sql`CURRENT_TIMESTAMP(3)`)
        .$onUpdate(() => sql`CURRENT_TIMESTAMP(3)`),
    deleted: boolean().default(false).notNull(),
}
