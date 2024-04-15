/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['openweathermap.org'],
    },
    experimental: {
      missingSuspenseWithCSRBailout: false,
    },
  };
  
  export default nextConfig;
  
