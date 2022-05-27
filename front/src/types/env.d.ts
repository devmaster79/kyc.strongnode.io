/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_LOCAL_BLOCKCHAIN_RPC: string
  readonly VITE_APP_LOCAL_BLOCKCHAIN_CHAIN_ID: number
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
