import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@swc/core-linux-x64-gnu',
      'node_modules/@swc/core-linux-x64-musl',
      'node_modules/@esbuild/linux-x64',
      'node_modules/terser',
      'node_modules/webpack',
      'node_modules/lightningcss-win32-x64-msvc',
    ],
  },
};

export default nextConfig;
