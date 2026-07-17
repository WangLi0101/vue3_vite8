import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig, loadEnv } from "vite";
import svgLoader from "vite-svg-loader";

const DEFAULT_ASSET_DIR = "assets";

const assetDirectoryMap: Record<string, string> = {
  css: "css",
  png: "img",
  jpg: "img",
  jpeg: "img",
  gif: "img",
  svg: "img",
  webp: "img",
  avif: "img",
  ico: "img",
  woff: "fonts",
  woff2: "fonts",
  eot: "fonts",
  ttf: "fonts",
  otf: "fonts",
};

const vendorChunkGroups = [
  { name: "vue-vendor", test: /[\\/]node_modules[\\/](vue|vue-router|pinia)[\\/]/ },
  { name: "axios", test: /[\\/]node_modules[\\/]axios[\\/]/ },
] as const;

const normalizeBaseUrl = (baseUrl?: string) => {
  const trimmedBaseUrl = baseUrl?.trim();

  if (!trimmedBaseUrl) {
    return "/";
  }

  let normalizedBaseUrl = trimmedBaseUrl;

  if (!normalizedBaseUrl.startsWith("/")) {
    normalizedBaseUrl = `/${normalizedBaseUrl}`;
  }

  if (!normalizedBaseUrl.endsWith("/")) {
    normalizedBaseUrl = `${normalizedBaseUrl}/`;
  }

  return normalizedBaseUrl;
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isDevelopment = mode === "development";
  const isProduction = mode === "production";
  const baseUrl = normalizeBaseUrl(env.VITE_APP_BASE_URL);

  return {
    base: baseUrl,
    plugins: [
      svgLoader({
        defaultImport: "url",
      }),
      vue(),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      host: "0.0.0.0",
      port: 5174,
    },
    build: {
      sourcemap: isDevelopment,
      reportCompressedSize: isProduction,
      chunkSizeWarningLimit: 1000,
      rolldownOptions: {
        output: {
          entryFileNames: "js/[name]-[hash].js",
          chunkFileNames: "js/[name]-[hash].js",
          assetFileNames(assetInfo) {
            const extension = assetInfo.name?.split(".").pop()?.toLowerCase();
            const directory = extension
              ? (assetDirectoryMap[extension] ?? DEFAULT_ASSET_DIR)
              : DEFAULT_ASSET_DIR;

            return `${directory}/[name]-[hash][extname]`;
          },
          codeSplitting: {
            groups: [...vendorChunkGroups],
          },
        },
      },
    },
  };
});
