import {
    bigint,
    boolean,
    int,
    json,
    mysqlEnum,
    mysqlTable,
    primaryKey,
    serial,
    text,
    timestamp,
    uniqueIndex,
    varchar,
} from "drizzle-orm/mysql-core"
import type {AdapterAccountType} from "next-auth/adapters"
import {timestamps} from "@/lib/db/util"

export const rolesEnum = mysqlEnum("role", ["guest", "user", "admin"])
export const postStatusEnum = mysqlEnum("status", ["draft", "publish"])

export const Settings = mysqlTable("settings", {
    id: serial().primaryKey(),
    key: varchar("setting_key", {length: 255}).unique().notNull(),
    value: text("value"),
})

export const PostComments = mysqlTable("post_comments", {
    id: serial().primaryKey(),
    content: text("content").notNull(),
    userId: varchar("user_id", {length: 255})
        .notNull()
        .references(() => Users.id, {onDelete: "cascade"}),
    parentId: bigint("parent_id", {unsigned: true, mode: "number"}),
    postId: bigint("post_id", {unsigned: true, mode: "number"})
        .references(() => Posts.id, {onDelete: "cascade"})
        .notNull(),
    ip: varchar("ip", {length: 255}),
    ...timestamps,
})

export const Posts = mysqlTable("posts", {
    id: serial().primaryKey(),
    title: varchar("title", {length: 255}),
    cover: varchar("cover", {length: 255}),
    summary: varchar("summary", {length: 255}),
    content: json("content"),
    views: bigint("views", {mode: "number", unsigned: true}).default(0),
    status: postStatusEnum.default("draft"),
    userId: varchar("user_id", {length: 255})
        .notNull()
        .references(() => Users.id, {onDelete: "cascade"}),
    ...timestamps,
})

export const Easay = mysqlTable("easays", {
    id: serial().primaryKey(),
    content: text(),
    userId: varchar("user_id", {length: 255})
        .notNull()
        .references(() => Users.id, {onDelete: "cascade"}),
    ...timestamps,
})

export const EasayMedia = mysqlTable("easay_medias", {
    id: serial().primaryKey(),
    easayId: bigint("easay_id", {unsigned: true, mode: "number"})
        .notNull()
        .references(() => Easay.id, {onDelete: "cascade"}),
    url: varchar("url", {length: 255}),
    type: varchar("type", {length: 255}),
})

export const Category = mysqlTable("categories", {
    id: serial().primaryKey(),
    name: varchar("name", {length: 255}).unique().notNull(),
})

export const Users = mysqlTable(
    "users",
    {
        id: varchar("id", {length: 255})
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        name: varchar("name", {length: 255}),
        email: varchar("email", {length: 255}).notNull().unique(),
        role: rolesEnum.default("user"),
        emailVerified: timestamp("emailVerified", {mode: "date", fsp: 3}),
        image: varchar("image", {length: 255}),
    },
    (table) => [uniqueIndex("email_idx").on(table.email)]
)

export const PostToCategory = mysqlTable(
    "posts_to_category",
    {
        postId: bigint("post_id", {unsigned: true, mode: "number"})
            .notNull()
            .references(() => Posts.id, {onDelete: "cascade"}),
        categoryId: bigint("category_id", {unsigned: true, mode: "number"})
            .notNull()
            .references(() => Category.id, {onDelete: "cascade"}),
    },
    (t) => [primaryKey({columns: [t.postId, t.categoryId]})]
)

export const Accounts = mysqlTable(
    "account",
    {
        userId: varchar("userId", {length: 255})
            .notNull()
            .references(() => Users.id, {onDelete: "cascade"}),
        type: varchar("type", {length: 255}).$type<AdapterAccountType>().notNull(),
        provider: varchar("provider", {length: 255}).notNull(),
        providerAccountId: varchar("providerAccountId", {length: 255}).notNull(),
        refresh_token: varchar("refresh_token", {length: 255}),
        access_token: varchar("access_token", {length: 255}),
        expires_at: int("expires_at"),
        token_type: varchar("token_type", {length: 255}),
        scope: varchar("scope", {length: 255}),
        id_token: varchar("id_token", {length: 2048}),
        session_state: varchar("session_state", {length: 255}),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    })
)

export const Sessions = mysqlTable("session", {
    sessionToken: varchar("sessionToken", {length: 255}).primaryKey(),
    userId: varchar("userId", {length: 255})
        .notNull()
        .references(() => Users.id, {onDelete: "cascade"}),
    expires: timestamp("expires", {mode: "date"}).notNull(),
})

export const VerificationTokens = mysqlTable(
    "verificationToken",
    {
        identifier: varchar("identifier", {length: 255}).notNull(),
        token: varchar("token", {length: 255}).notNull(),
        expires: timestamp("expires", {mode: "date"}).notNull(),
    },
    (verificationToken) => ({
        compositePk: primaryKey({
            columns: [verificationToken.identifier, verificationToken.token],
        }),
    })
)

export const Authenticators = mysqlTable(
    "authenticator",
    {
        credentialID: varchar("credentialID", {length: 255}).notNull().unique(),
        userId: varchar("userId", {length: 255})
            .notNull()
            .references(() => Users.id, {onDelete: "cascade"}),
        providerAccountId: varchar("providerAccountId", {length: 255}).notNull(),
        credentialPublicKey: varchar("credentialPublicKey", {
            length: 255,
        }).notNull(),
        counter: int("counter").notNull(),
        credentialDeviceType: varchar("credentialDeviceType", {
            length: 255,
        }).notNull(),
        credentialBackedUp: boolean("credentialBackedUp").notNull(),
        transports: varchar("transports", {length: 255}),
    },
    (authenticator) => ({
        compositePk: primaryKey({
            columns: [authenticator.userId, authenticator.credentialID],
        }),
    })
)
