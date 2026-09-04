interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_CONTACT_EMAIL?: string;
  readonly PUBLIC_SUBSCRIBE_ACTION?: string;
  readonly PUBLIC_SUBSCRIBE_EMAIL_FIELD?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
