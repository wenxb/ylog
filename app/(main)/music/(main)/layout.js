import MainColumn from "@/components/module/common/MainColumn"
import NavTabs from "@/components/page/music/NavTabs"
import PageHeader from "@/components/module/common/PageHeader"
import {Button} from "@/components/ui/button"
import {HouseIcon} from "lucide-react"
import Link from "next/link"

const Layout = ({children}) => {
    return (
        <>
            <MainColumn>
                <PageHeader hideBack noPadding showMobileMenu={false}>
                    <NavTabs />
                </PageHeader>
                <div className={"pb-10"}>{children}</div>
                <div className="fixed right-0 rounded-l-full pr-2 pl-0.5 shadow-md bottom-12 z-10 sm:hidden">
                    <Button asChild size="icon" variant="ghost">
                        <Link href="/">
                            <HouseIcon className="!size-5"/>
                        </Link>
                    </Button>
                </div>
            </MainColumn>
        </>
    )
}

export default Layout
