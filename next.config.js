/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // canvas 모듈 처리
    config.resolve.alias.canvas = false;
    
    // worker 파일 처리
    config.resolve.alias.fs = false;
    config.resolve.alias.path = false;
    
    return config;
  },
  // PDF 파일을 위한 worker 설정
  experimental: {
    optimizePackageImports: ['@react-pdf-viewer/core']
  },
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/PDF_AI_Viewer',
};

module.exports = nextConfig; 