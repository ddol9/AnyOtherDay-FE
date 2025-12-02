import type { NextConfig } from "next";

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: false,
  swcMinify: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  // 👇 [핵심] 여기에 rewrites 설정을 추가해서 CORS를 우회합니다.
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*", // 프론트에서 '/api/v1/어쩌구'로 요청하면
        destination: "https://ynn-production.up.railway.app/api/v1/:path*", // Next.js가 백엔드로 대신 요청을 쏴줍니다.
      },
    ];
  },
};

export default withPWA(nextConfig);
