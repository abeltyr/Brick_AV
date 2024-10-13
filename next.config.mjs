/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        DATABASE_URL: process.env.DATABASE_URL ?? "",
    },
    reactStrictMode: true,
    // output: 'export',
};

export default nextConfig;