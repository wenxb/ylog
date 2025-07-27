"use client"
import YPagination from "@/components/common/YPagination"

const PostPagination = ({page, count, pageSize}) => {
    return (
        <div className={"my-6"}>
            <YPagination page={page} pageSize={pageSize} count={count} />
        </div>
    )
}

export default PostPagination
