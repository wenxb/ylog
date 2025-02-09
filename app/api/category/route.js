import {db} from "@/lib/db"
import {Category} from "@/lib/db/schema"

export async function GET() {
    try {
        const record = await db
            .select({
                id: Category.id,
                name: Category.name,
            })
            .from(Category)
            .orderBy(Category.id, Category.name)

        return Response.json(record)
    } catch (err) {
        return Response.json({error: err.message}, {status: 500})
    }
}
