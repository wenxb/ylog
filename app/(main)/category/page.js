import MainColumn from "@/components/module/common/MainColumn"
import Link from "next/link"
import {db} from "@/lib/db"
import {Category} from "@/lib/db/schema"
import PageHeader from "@/components/module/common/PageHeader"

const Page = async () => {
    const categories = await db.select().from(Category)

    return (
        <MainColumn>
            <PageHeader
                title={"分类"}
                hideBack
                secondary={categories.length > 0 ? `${categories.length} 个分类` : "还没有分类"}
            ></PageHeader>
            <div className={"flex flex-col items-center p-6"}>
                <ul className={"flex flex-wrap gap-2 py-6"}>
                    {categories.map((category) => (
                        <li key={category.id}>
                            <Link
                                className={"rounded-xl px-6 py-3 text-xl transition-colors hover:bg-accent"}
                                href={"/category/" + category.name}
                            >
                                {category.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </MainColumn>
    )
}

export default Page
