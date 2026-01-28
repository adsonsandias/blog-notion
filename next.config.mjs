const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "secure.notion-static.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "s3.us-west-2.amazonaws.com" },
      { protocol: "https", hostname: "prod-files-secure.s3.us-west-2.amazonaws.com" },
    ],
  },
};

export default nextConfig;
