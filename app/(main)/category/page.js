import MainColumn from "@/components/module/MainColumn"
import Link from "next/link"
import {db} from "@/lib/db"
import {Category, PostToCategory} from "@/lib/db/schema"
import PageHeader from "@/components/module/PageHeader"
import {eq} from "drizzle-orm"
import {connection} from "next/server"

const Page = async () => {
    await connection()
    const categories = await db
        .select({
            id: Category.id,
            name: Category.name,
        })
        .from(Category)

    for (const category of categories) {
        category.postCount = await db.$count(PostToCategory, eq(PostToCategory.categoryId, category.id))
    }

    return (
        <MainColumn>
            <PageHeader
                title={"分类"}
                hideBack
                secondary={categories.length > 0 ? `${categories.length} 个分类` : "还没有分类"}
            ></PageHeader>
            <div className={"flex flex-col items-center"}>
                <ul className={"w-full py-4"}>
                    {categories.map((category) => (
                        <li key={category.id} className="flex w-full">
                            <Link
                                className={
                                    "flex w-full flex-col justify-center px-4 py-3 transition-colors hover:bg-accent!"
                                }
                                href={"/category/" + category.name}
                            >
                                <div className="font-bold">{category.name}</div>
                                <div className="mt-1 text-sm text-muted-foreground">
                                    {category.postCount + "篇文章"}
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </MainColumn>
    )
}

export default Page
