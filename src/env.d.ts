/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_BASE_URL: string;
  /** External administration system that hosts the login page. */
  readonly VITE_ADMIN_APP_URL?: string;
  /** Public URL that the login system redirects back to after successful authentication. */
  readonly VITE_APP_EXTERNAL_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
