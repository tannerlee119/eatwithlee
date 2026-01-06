/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // UploadThing (common hosts)
      { protocol: 'https', hostname: 'utfs.io' },
      { protocol: 'https', hostname: 'uploadthing.com' },
      { protocol: 'https', hostname: 'utfs.io', pathname: '/f/**' },
      { protocol: 'https', hostname: 'uploadthing.com', pathname: '/f/**' },
    ],
  },
};

module.exports = nextConfig
