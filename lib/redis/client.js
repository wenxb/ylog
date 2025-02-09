import {createClient} from "redis"

let redisClient

export async function getRedisClient() {
    if (!redisClient) {
        redisClient = await createClient({
            url: process.env.REDIS_URL,
            database: process.env.REDIS_DB ? parseInt(process.env.REDIS_DB) : 1,
        })
            .on("error", (err) => {
                console.error("Redis Client Error", err)
            })
            .connect()
    }

    return redisClient
}
