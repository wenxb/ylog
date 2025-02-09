import "@/styles/index.scss"
import "@/styles/tailwind.css"
import {ThemeProvider} from "@/lib/theme-provider"
import {TooltipProvider} from "@/components/ui/tooltip"
import {Toaster} from "@/components/ui/toaster"
import {SWRProvider} from "@/lib/swr-provider"
import {Analytics} from "@/components/module/common/analytics"
import {SessionProvider} from "next-auth/react"
import {Suspense} from "react"
import {getAdminUser, getSettingsByKeys} from "@/utils/server"
import Init from "@/components/module/Init"
import InitConfig from "@/components/module/InitConfig"

export function generateViewport() {
    return {
        themeColor: [
            {media: "(prefers-color-scheme: light)", color: "white"},
            {media: "(prefers-color-scheme: dark)", color: "#1f1f1f"},
        ],
    }
}

export async function generateMetadata() {
    const settings = await getSettingsByKeys(["site_title", "site_icon", "site_description", "site_keyword"])
    const user = await getAdminUser()

    return {
        icons: {
            icon: settings.site_icon,
            apple: settings.site_icon,
        },
        title: {
            template: `%s - ${settings.site_title}`,
            default: settings.site_title,
        },
        description: settings.site_description,
        keywords: settings.site_keyword,
        authors: [
            {
                name: user?.name,
            },
        ],
        creator: user?.name,
        openGraph: {
            title: settings.site_title,
            description: settings.site_description,
            siteName: settings.site_title,
            locale: "zh_CN",
            type: "website",
        },
    }
}

export default async function RootLayout({children, modal}) {
    const settings = await getSettingsByKeys(["default_theme"])

    return (
        <html lang="zh" suppressHydrationWarning>
            <body>
                <SessionProvider>
                    <SWRProvider>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme={settings.default_theme || "system"}
                            enableSystem
                            disableTransitionOnChange
                        >
                            <TooltipProvider>
                                {children}
                            </TooltipProvider>
                            <Toaster />
                            <Init />
                            <InitConfig />
                        </ThemeProvider>
                    </SWRProvider>
                </SessionProvider>
                <Analytics />
                <Suspense fallback={null}>{modal}</Suspense>
            </body>
        </html>
    )
}
