import { NextConfig } from "next"

const config: NextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
  allowedDevOrigins: ["10.0.0.154"],
}

export default config
