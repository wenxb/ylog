import {getRedisClient} from "@/lib/redis/client"
import {db} from "@/lib/db"
import {Posts} from "@/lib/db/schema"
import {and, eq} from "drizzle-orm"

export const getPostFromCache = async (id) => {
    if (!id) return null
    const redis = await getRedisClient()
    let post = await redis.json.get(`posts:${id}`)
    if (!post) {
        post = await db
            .select()
            .from(Posts)
            .where(and(eq(Posts.id, parseInt(id))))
            .then((res) => res[0])

        if (post) {
            await redis.json.set(`posts:${id}`, "$", post)
        }
    }

    return post
}
