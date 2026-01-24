import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { withSentryConfig } from "@sentry/nextjs";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  /* config options here */
};

// Sentry configuration - combined into single object
const sentryBuildOptions = {
  // Suppresses source map uploading logs during build
  silent: true,
  // Organization and project from Sentry dashboard
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // Upload source maps for better error tracking
  widenClientFileUpload: true,
  // Hide source maps from generated client bundles
  hideSourceMaps: true,
  // Disable logger in production
  disableLogger: true,
};

export default withSentryConfig(withNextIntl(nextConfig), sentryBuildOptions);
