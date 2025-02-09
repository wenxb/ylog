import {timestamp} from "drizzle-orm/pg-core"

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
    updated_at: timestamp({precision: 6, withTimezone: true}).defaultNow(),
    created_at: timestamp({precision: 6, withTimezone: true}).defaultNow().notNull(),
    deleted_at: timestamp({precision: 6, withTimezone: true}),
}
