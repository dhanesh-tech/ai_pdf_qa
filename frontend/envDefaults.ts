/// <reference types="vite/client" />

export const envDefaults = {
    baseUrl: import.meta.env.VITE_NODE_BACKEND_URL || "http://localhost:4000",
}

console.log("envDefaults", envDefaults);