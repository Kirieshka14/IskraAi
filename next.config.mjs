/** @type {import("next").NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGitHubPages ? "/IskraAi" : "";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
};

export default nextConfig;
