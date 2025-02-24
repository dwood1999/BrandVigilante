/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly DATABASE_HOST: string
    readonly DATABASE_USER: string
    readonly DATABASE_PASSWORD: string
    readonly DATABASE_NAME: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
} 