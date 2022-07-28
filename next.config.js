require("dotenv").config()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    API_KEY: process.env.ALCHMEY_API_KEY,
  }
}

module.exports = nextConfig
