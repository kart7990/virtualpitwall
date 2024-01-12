/** @type {import('next').NextConfig} */

const environment = process.env.TARGET_ENV || process.env.NODE_ENV;

const nextConfig = {
  productionBrowserSourceMaps: true,
  reactStrictMode: false,
  swcMinify: true,
  env: getEnvConfig(),
  output: "standalone",
};

function getEnvConfig() {
  // for multi-file config
  return require(`./env/env-${environment}.json`);
}

module.exports = nextConfig;
