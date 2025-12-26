/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_SERVICE_URL: string
  readonly VITE_EVENT_SERVICE_URL: string
  readonly VITE_RESERVATION_SERVICE_URL: string
  readonly VITE_NOTIFICATION_SERVICE_URL: string
  readonly VITE_API_GATEWAY_URL: string
  readonly VITE_WS_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
