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
  let envs = require(`./env/env-${environment}.json`);
  envs = {
    ...envs,
    MOCKING: process.env.MOCKING,
  };
  return envs;
}

module.exports = nextConfig;
