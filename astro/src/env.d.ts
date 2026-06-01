/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_MICROCMS_SERVICE_DOMAIN?: string;
  readonly MICROCMS_API_KEY?: string;
  readonly CONTACT_ADMIN_EMAIL?: string;
  readonly CONTACT_FROM_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
