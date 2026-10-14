import { NextConfig } from "next"

const config: NextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }], unoptimized: true },
}

export default config
