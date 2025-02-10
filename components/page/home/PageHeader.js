import HeaderDesc from "@/components/page/home/HeaderDesc"
import PageHeaderWrap from "@/components/module/common/PageHeaderWrap"
import HeaderBar from "@/components/page/home/HeaderBar"

const PageHeader = ({title}) => {

    return (
        <PageHeaderWrap hideBar>
            <div className="-mt-2">
                <HeaderBar/>
            </div>
            <div className="text-2xl my-3 font-semibold">{title}</div>
            <HeaderDesc />
        </PageHeaderWrap>
    )
}

export default PageHeader
