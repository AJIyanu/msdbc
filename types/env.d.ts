/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    NEXT_PUBLIC_SUPABASE_SERVICE_KEY: string;
    SUPABASE_SECRET_KEY: string;
  }
}

declare module "process" {
  interface Env extends NodeJS.ProcessEnv {}
}
