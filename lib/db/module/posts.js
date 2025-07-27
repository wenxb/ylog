import {db} from "@/lib/db"
import {Posts} from "@/lib/db/schema"
import {and, eq} from "drizzle-orm"

export const getPost = async (id) => {
    if (!id) return null
    return await db
        .select()
        .from(Posts)
        .where(and(eq(Posts.id, parseInt(id))))
        .then((res) => res[0])
}
