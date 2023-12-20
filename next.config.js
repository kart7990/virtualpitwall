/** @type {import('next').NextConfig} */

const environment = process.env.TARGET_ENV || process.env.NODE_ENV

const nextConfig = {
    productionBrowserSourceMaps: true,
    reactStrictMode: true,
    swcMinify: true,
    env: getEnvConfig()
}

function getEnvConfig() { // for multi-file config
    return require(`./env/env-${environment}.json`)
}

module.exports = nextConfig
