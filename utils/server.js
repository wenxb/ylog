import {db} from "@/lib/db"
import {Settings, Users} from "@/lib/db/schema"
import {eq, or} from "drizzle-orm"
import {getRedisClient} from "@/lib/redis/client"

export const getSettingsByKeys = async (keys = []) => {
    const redis = await getRedisClient()

    const redisResults = await redis.mGet(keys.map((k) => `settings:${k}`))

    const missingKeys = []
    const redisValues = {}
    keys.forEach((key, idx) => {
        if (redisResults[idx] !== null) {
            redisValues[key] = redisResults[idx]
        } else {
            missingKeys.push(key) // 记录缺失的 keys
        }
    })

    let dbValues = {}
    if (missingKeys.length > 0) {
        const where = or(...missingKeys.map((k) => eq(Settings.key, k)))
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

        for (const [key, value] of Object.entries(dbValues)) {
            await redis.set(`settings:${key}`, value)
        }
    }

    return {...redisValues, ...dbValues}
}

export const clearSettingsCache = async () => {
    const redis = await getRedisClient()
    const keys = await redis.keys("settings:*")
    if (keys.length > 0) {
        await redis.del(keys)
    }
}

export const getAdminUser = async (skipCache=false) => {
    const redis = await getRedisClient()
    let user = await redis.json.get("admin_user")

    try {
        if (!user || skipCache) {
            user = await db
                .select()
                .from(Users)
                .where(eq(Users.role, "admin"))
                .then((res) => res[0])
            if (user) {
                await redis.json.set("admin_user", "$", user)
            }
        }

        return user
    } catch (err) {
        console.error(err)
        return null
    }
}
