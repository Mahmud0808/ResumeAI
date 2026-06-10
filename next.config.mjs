/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Old shareable-link pattern; keep working forever.
      {
        source: "/my-resume/:id/view",
        destination: "/resume/:id",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
