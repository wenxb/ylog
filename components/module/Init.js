import {getSettingsByKeys} from "@/utils/server"
import {Users} from "@/lib/db/schema"
import {eq, sql} from "drizzle-orm"
import {db} from "@/lib/db"

const default_settings = {
    site_url: "http://localhost:10001",
    site_title: "YLOG",
    site_description: "一个开源的博客程序",
    site_keyword: "blog,ylog",
    site_icon: "/icon.jpg",
    default_theme: "system",
    social_github: "",
    social_facebook: "",
    social_email: "",
    social_bilibili: "",
    social_x: "",
    enable_comment: "true",
    image_api_url: "",
    image_api_key: "",
    image_album_id: "",
    music_cookie: "",
    home_desc_text: "",
    home_desc_mode: "one_api",
    tool_enable: "true",
}
const Init = async () => {
    const config = await getSettingsByKeys(["initialized"])
    if (!config?.initialized) {
        const user_record = await db.select().from(Users).where(eq(Users.role, "admin"))
        if (user_record?.length) {
            const user = user_record[0]
            default_settings.user_image = user.image
            default_settings.user_name = user.name
        }

        const values = [
            {
                key: "initialized",
                value: "true",
            },
            ...Object.keys(default_settings).map((key) => ({
                key: key,
                value: default_settings[key],
            })),
        ]

        await db.execute(
            sql`INSERT IGNORE INTO settings (setting_key, value) VALUES ${sql.join(
                values.map((v) => sql`(${v.key}, ${v.value})`),
                sql`, `
            )}`
        )
    }

    return null
}

export default Init
