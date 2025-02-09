import "dotenv/config"
import {migrate} from "drizzle-orm/node-postgres/migrator"
import {db} from "@/lib/db"

await migrate(db, {migrationsFolder: "./drizzle"})
