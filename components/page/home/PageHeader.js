import HeaderDesc from "@/components/page/home/HeaderDesc"
import PageHeaderWrap from "@/components/module/PageHeaderWrap"
import HeaderBar from "@/components/page/home/HeaderBar"

const PageHeader = ({title}) => {
    return (
        <PageHeaderWrap hideBar>
            <div className="-mt-2">
                <HeaderBar />
            </div>
            <div className="my-3 text-2xl font-semibold">{title}</div>
            <HeaderDesc />
        </PageHeaderWrap>
    )
}

export default PageHeader
