import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Root AGENTS.md is reserved for the project contract (see devpack AGENT/AGENTS.md), not Next boilerplate.
  agentRules: false,
};

export default nextConfig;
