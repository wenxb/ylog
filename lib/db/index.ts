import {drizzle} from "drizzle-orm/mysql2"


// @ts-ignore
export const db = drizzle(process.env.AUTH_DRIZZLE_URL)
