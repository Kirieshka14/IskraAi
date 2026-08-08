import type { Config } from "tailwindcss";
export default { content:["./app/**/*.{js,ts,jsx,tsx,mdx}","./components/**/*.{js,ts,jsx,tsx,mdx}"], theme:{extend:{colors:{ink:"#171717",paper:"#f5f5f4",ember:"#52525b",moss:"#3f3f46",sand:"#e7e5e4"},boxShadow:{soft:"0 10px 30px rgba(0,0,0,.10)"}}},plugins:[] } satisfies Config;
