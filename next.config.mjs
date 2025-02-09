import createMDX from "@next/mdx"

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    webpack(config) {
        config.module.rules.push({
            test: /\.ya?ml$/,
            use: 'yaml-loader'
        })

        return config
    },
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
    // Add markdown plugins here, as desired
})

export default withMDX(nextConfig)
