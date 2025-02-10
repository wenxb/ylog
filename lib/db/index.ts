import {drizzle} from "drizzle-orm/node-postgres"
import {Pool} from "pg"
import * as schema from "./schema"
import {config} from "dotenv"

config({ path: process.env.NODE_ENV === 'development' ? '.env.local' : '.env.production' })

const pool = new Pool({
    connectionString: process.env.AUTH_DRIZZLE_URL,
})

export const db = drizzle(pool, {schema})
