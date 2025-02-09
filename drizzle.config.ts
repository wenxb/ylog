import {defineConfig} from "drizzle-kit"

export default defineConfig({
    dialect: "postgresql",
    schema: "./lib/db/schema.ts",
    out: "./drizzle",
    dbCredentials: {
        url: process.env.AUTH_DRIZZLE_URL!,
    },
})
