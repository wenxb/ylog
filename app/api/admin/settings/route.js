import {db} from "@/lib/db"
import {Settings, Users} from "@/lib/db/schema"
import {eq, not} from "drizzle-orm"
import {z} from "zod"
import {clearSettingsCache, getAdminUser} from "@/utils/server"

export const GET = async () => {
    const user = await getAdminUser()
    try {
        const record = await db
            .select({
                key: Settings.key,
                value: Settings.value,
            })
            .from(Settings)
            .where(not(eq(Settings.key, "initialized")))

        const result = record.reduce((acc, {key, value}) => {
            acc[key] = value
            return acc
        }, {})

        result.user_name = user.name
        result.user_image = user.image

        return Response.json(result)
    } catch (err) {
        console.error(err)
        return Response.error()
    }
}

const verBody = z.object({
    site_url: z.string().optional(),
    site_title: z.string().optional(),
    site_description: z.string().optional(),
    site_keyword: z.string().optional(),
    site_icon: z.string().optional(),
    default_theme: z.string().optional(),
    user_image: z.string().optional(),
    user_name: z.string().optional(),
    social_github: z.string().optional(),
    social_facebook: z.string().optional(),
    social_email: z.string().optional(),
    social_bilibili: z.string().optional(),
    social_x: z.string().optional(),
    enable_comment: z.preprocess((v) => String(v), z.string()).optional(),
    image_api_url: z.string().optional(),
    image_api_key: z.string().optional(),
    music_cookie: z.string().optional(),
    icp_str: z.string().optional(),
    image_album_id: z.string().optional(),
    home_desc_mode: z.enum(["one_api", "text"]).optional(),
    home_desc_text: z.string().optional(),
    tool_enable: z.string().optional(),
})

export const POST = async (req) => {
    const body = await req.json()
    const user = await getAdminUser()

    const result = verBody.safeParse(body)
    if (!result.success) {
        return Response.json({error: result.error.errors[0].message}, {status: 400})
    }
    const parseBody = result.data

    try {
        await db
            .update(Users)
            .set({
                name: parseBody.user_name,
                image: parseBody.user_image,
            })
            .where(eq(Users.id, user.id))

        const keys = Object.keys(body)

        for (const key of keys) {
            await db
                .update(Settings)
                .set({
                    value: parseBody[key],
                })
                .where(eq(Settings.key, key))
        }

        await clearSettingsCache()
    } catch (err) {
        console.error(err)
        return Response.error()
    }

    return Response.json({})
}
