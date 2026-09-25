/** @type {import('next').NextConfig} */
const nextConfig = {
  // About now lives on the home page; keep any shared /about links working.
  async redirects() {
    return [
      // Skills moved onto the Work & Experience page.
      { source: "/skills", destination: "/experience#skills", permanent: false },
      // The resume used to live at /resume.pdf; keep old links working.
      { source: "/resume.pdf", destination: "/Atef_Mohamed_Resume.pdf", permanent: true },
    ];
  },
  // Show the resume in the browser's PDF viewer, and save it under a real name if downloaded.
  async headers() {
    return [
      {
        source: "/Atef_Mohamed_Resume.pdf",
        headers: [{ key: "Content-Disposition", value: 'inline; filename="Atef_Mohamed_Resume.pdf"' }],
      },
    ];
  },
};

export default nextConfig;
