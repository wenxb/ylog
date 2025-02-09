import MainColumn from "@/components/module/common/MainColumn"
import EasayList from "@/components/lists/EasayList"
import YPagination from "@/components/common/YPagination"
import {db} from "@/lib/db"
import {Easay, EasayMedia} from "@/lib/db/schema"
import {desc, eq} from "drizzle-orm"
import EasayPageHeader from "@/components/page/easay/PageHeader"
import PageHeader from "@/components/module/common/PageHeader"

export const metadata = {
    title: "随记",
}

const pageSize = 12
const Page = async ({searchParams}) => {
    const page = parseInt((await searchParams)?.page || "1")
    const id = parseInt((await searchParams)?.id)

    let data = await db
        .select()
        .from(Easay)
        .limit(pageSize)
        .offset((page - 1) * pageSize)
        .orderBy(desc(Easay.created_at))
    for (const item of data) {
        item.media = await db.select().from(EasayMedia).where(eq(EasayMedia.easayId, item.id))
    }
    const count = await db.$count(Easay)
    if (id) {
        data = data?.filter((item) => item.id !== id)
    }

    return (
        <MainColumn>
            <PageHeader hideBack title="随记"></PageHeader>
            <EasayPageHeader />
            <div>
                <EasayList actionAfterFlush data={data} />
            </div>
            <div className="py-6">
                <YPagination page={page} pageSize={pageSize} count={count} />
            </div>
        </MainColumn>
    )
}

export default Page
