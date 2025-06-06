/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['www.adanirealty.com', 'picsum.photos', 'img.clerk.com','www.colive.com', 'cdn.vectorstock.com',
        'www.zillowstatic.com'], //make it 'your-domain.com'
    },
    rewrites: async () => [
        {
            source: '/auth/:path*',
            destination: 'http://localhost:8080/auth/:path*',
        }
    ]
};

export default nextConfig;
