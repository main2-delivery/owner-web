/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TEST_USER_ID?: string
  readonly VITE_TEST_ROLE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
