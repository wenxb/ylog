import MainColumn from "@/components/module/MainColumn"
import NavTabs from "@/components/page/music/NavTabs"
import PageHeader from "@/components/module/PageHeader"

const Layout = ({children}) => {
    return (
        <>
            <MainColumn>
                <PageHeader hideBack noPadding>
                    <NavTabs />
                </PageHeader>
                <div className={"pb-10"}>{children}</div>
            </MainColumn>
        </>
    )
}

export default Layout
