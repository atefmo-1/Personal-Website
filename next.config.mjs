/** @type {import('next').NextConfig} */
const nextConfig = {
  // About now lives on the home page; keep any shared /about links working.
  async redirects() {
    return [
      // Skills moved onto the Work & Experience page.
      { source: "/skills", destination: "/experience#skills", permanent: false },
    ];
  },
};

export default nextConfig;
