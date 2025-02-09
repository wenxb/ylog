import {db} from "@/lib/db"
import {Category} from "@/lib/db/schema"
import {eq} from "drizzle-orm"

export async function DELETE(req) {
    const body = await req.json()

    try {
        if (!body?.name) return Response.error()
        await db.delete(Category).where(eq(Category.name, body?.name))
        return Response.json({})
    } catch (err) {
        console.error(err)
        return Response.error()
    }
}
