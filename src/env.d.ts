/// <reference types="vite/client" />

declare module "*.css";
declare module "swiper/css";
declare module "swiper/css/pagination";

interface ImportMetaEnv {
  readonly VITE_APP_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
