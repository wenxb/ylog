import {db} from "@/lib/db"
import {Category} from "@/lib/db/schema"
import {eq} from "drizzle-orm"

export const GET = async (req) => {
    const searchParams = req.nextUrl.searchParams
    const name = searchParams.get("name")

    try {
        let record = await db
            .select()
            .from(Category)
            .where(eq(Category.name, name))
            .then((result) => result[0])

        if (!record) {
            record = await db
                .insert(Category)
                .values({
                    name: name,
                })
                .returning({
                    id: Category.id,
                    name: Category.name,
                })
                .onConflictDoNothing({
                    target: Category.name,
                })
        }
        return Response.json(record)
    } catch (e) {
        console.error(e)
        return Response.error()
    }
}
