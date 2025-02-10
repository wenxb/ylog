import {defineConfig} from "drizzle-kit"
import {config} from "dotenv"

config({ path: process.env.NODE_ENV === 'development' ? '.env.local' : '.env.production' })

export default defineConfig({
    dialect: "postgresql",
    schema: "./lib/db/schema.ts",
    out: "./drizzle",
    dbCredentials: {
        url: process.env.AUTH_DRIZZLE_URL!,
    },
})
console.log(process.env.NODE_ENV)
