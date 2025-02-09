import LoadingBox from "@/components/common/LoadingBox"
import MainColumn from "@/components/module/common/MainColumn"

const PageLoadingBlock = () => {
    return (
        <MainColumn>
            <LoadingBox className={"min-h-28"} loading />
        </MainColumn>
    )
}

export default PageLoadingBlock
