import {db} from "@/lib/db"
import {Settings, Users} from "@/lib/db/schema"
import {eq, or} from "drizzle-orm"

export const getSettingsByKeys = async (keys = []) => {
    let dbValues = {}
    const where = or(...keys.map((k) => eq(Settings.key, k)))
    const record = await db
        .select({
            key: Settings.key,
            value: Settings.value,
        })
        .from(Settings)
        .where(where)
    dbValues = record.reduce((acc, {key, value}) => {
        acc[key] = value
        return acc
    }, {})

    return dbValues
}

export const getAdminUser = async () => {
    try {
        return await db
            .select()
            .from(Users)
            .where(eq(Users.role, "admin"))
            .then((res) => res[0])
    } catch (err) {
        console.error(err)
        return null
    }
}
