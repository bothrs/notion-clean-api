/** @type {import('next').NextConfig} */

module.exports = module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.example.com/:path*",
      },
    ];
  },
};
