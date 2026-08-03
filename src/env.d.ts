/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public URL that the login system redirects back to after successful authentication. */
  readonly VITE_APP_EXTERNAL_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
