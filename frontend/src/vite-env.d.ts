/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 'true' (padrão) usa dados simulados; 'false' chama a API real. */
  readonly VITE_USE_MOCKS?: string;
  /** Base da API real, ex: http://localhost:3333/api */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
