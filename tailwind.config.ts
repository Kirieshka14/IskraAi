import type { Config } from "tailwindcss";
export default { content:["./app/**/*.{js,ts,jsx,tsx,mdx}","./components/**/*.{js,ts,jsx,tsx,mdx}"], theme:{extend:{colors:{ink:"#22211f",paper:"#f7f4ee",ember:"#c95f3f",moss:"#4f6859",sand:"#e9e2d6"},boxShadow:{soft:"0 10px 30px rgba(46,38,29,.08)"}}},plugins:[] } satisfies Config;
