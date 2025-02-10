import {
    bigint,
    boolean,
    index,
    integer,
    jsonb,
    pgEnum,
    pgTable,
    primaryKey,
    serial,
    text,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
} from "drizzle-orm/pg-core"
import type {AdapterAccountType} from "next-auth/adapters"
import {timestamps} from "@/lib/db/util"

export const rolesEnum = pgEnum("roles", ["guest", "user", "admin"])
export const postStatusEnum = pgEnum("status", ["draft", "publish"])

export const Settings = pgTable("settings", {
    id: serial().primaryKey(),
    key: varchar("key").unique().notNull(),
    value: text("value"),
})

export const PostComments = pgTable("post_comments", {
    id: serial().primaryKey(),
    content: text("content").notNull(),
    userId: uuid("user_id")
        .notNull()
        .references(() => Users.id, {onDelete: "cascade"}),
    parentId: integer("parent_id"),
    postId: integer("post_id")
        .references(() => Posts.id, {onDelete: "cascade"})
        .notNull(),
    ip: varchar("ip"),
    ...timestamps,
})

export const Posts = pgTable(
    "posts",
    {
        id: serial().primaryKey(),
        title: varchar({length: 256}),
        cover: varchar("cover"),
        summary: text("summary"),
        content: jsonb("content"),
        contentHtml: text("content_html"),
        views: bigint({mode: "number"}).default(0),
        status: postStatusEnum().default("draft"),
        userId: uuid("user_id")
            .notNull()
            .references(() => Users.id, {onDelete: "cascade"}),
        ...timestamps,
    },
    (table) => [index("title_idx").on(table.title)]
)

export const Easay = pgTable("easays", {
    id: serial().primaryKey(),
    content: text(),
    userId: uuid("user_id")
        .notNull()
        .references(() => Users.id, {onDelete: "cascade"}),
    ...timestamps,
})

export const EasayMedia = pgTable("easay_medias", {
    id: serial().primaryKey(),
    easayId: integer("easay_id")
        .notNull()
        .references(() => Easay.id, {onDelete: "cascade"}),
    url: varchar(),
    type: varchar("type"),
})

export const Category = pgTable("categories", {
    id: serial().primaryKey(),
    name: varchar().unique().notNull(),
})

export const Users = pgTable(
    "users",
    {
        id: uuid("id")
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        name: varchar("name"),
        email: varchar("email").notNull().unique(),
        role: rolesEnum().default("user"),
        emailVerified: timestamp("emailVerified", {mode: "date", withTimezone: true}),
        image: varchar("image"),
        ...timestamps,
    },
    (table) => [uniqueIndex("email_idx").on(table.email)]
)

export const PostToCategory = pgTable(
    "posts_to_category",
    {
        postId: integer("post_id")
            .notNull()
            .references(() => Posts.id, {onDelete: "cascade"}),
        categoryId: integer("category_id")
            .notNull()
            .references(() => Category.id, {onDelete: "cascade"}),
    },
    (t) => [primaryKey({columns: [t.postId, t.categoryId]})]
)

export const Accounts = pgTable(
    "account",
    {
        userId: uuid("userId")
            .notNull()
            .references(() => Users.id, {onDelete: "cascade"}),
        type: varchar("type").$type<AdapterAccountType>().notNull(),
        provider: varchar("provider").notNull(),
        providerAccountId: varchar("providerAccountId").notNull(),
        refresh_token: varchar("refresh_token"),
        access_token: varchar("access_token"),
        expires_at: integer("expires_at"),
        token_type: varchar("token_type"),
        scope: varchar("scope"),
        id_token: varchar("id_token"),
        session_state: varchar("session_state"),
    },
    (account) => [
        {
            compoundKey: primaryKey({
                columns: [account.provider, account.providerAccountId],
            }),
        },
    ]
)

export const Sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: uuid("userId")
        .notNull()
        .references(() => Users.id, {onDelete: "cascade"}),
    expires: timestamp("expires", {mode: "date", withTimezone: true}).notNull(),
})

export const VerificationTokens = pgTable(
    "verificationToken",
    {
        identifier: varchar("identifier").notNull(),
        token: varchar("token").notNull(),
        expires: timestamp("expires", {mode: "date", withTimezone: true}).notNull(),
    },
    (verificationToken) => [
        {
            compositePk: primaryKey({
                columns: [verificationToken.identifier, verificationToken.token],
            }),
        },
    ]
)

export const Authenticators = pgTable(
    "authenticator",
    {
        credentialID: text("credentialID").notNull().unique(),
        userId: uuid("userId")
            .notNull()
            .references(() => Users.id, {onDelete: "cascade"}),
        providerAccountId: varchar("providerAccountId").notNull(),
        credentialPublicKey: varchar("credentialPublicKey").notNull(),
        counter: integer("counter").notNull(),
        credentialDeviceType: varchar("credentialDeviceType").notNull(),
        credentialBackedUp: boolean("credentialBackedUp").notNull(),
        transports: varchar("transports"),
    },
    (authenticator) => [
        {
            compositePK: primaryKey({
                columns: [authenticator.userId, authenticator.credentialID],
            }),
        },
    ]
)
