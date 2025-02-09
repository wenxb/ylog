"use client"
import UploadEasay from "@/components/page/easay/UploadEasay"
import Auth from "@/utils/Auth"

const EasayPageHeader = () => {
    return Auth.isAdmin() ? <UploadEasay /> : null
}

export default EasayPageHeader
