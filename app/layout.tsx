import type { Metadata,Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import "./polish.css";
import { Header } from "@/components/header";
import { AuthGuard } from "@/components/auth-guard";
const manrope=Manrope({subsets:["cyrillic"],variable:"--font-manrope"});
const basePath=process.env.GITHUB_PAGES==="true"?"/IskraAi":"";
export const metadata:Metadata={title:"IskraAi — истории, которые отвечают",description:"Авторские ИИ-персонажи и интерактивные истории",applicationName:"IskraAi",manifest:`${basePath}/site.webmanifest`,icons:{icon:[{url:`${basePath}/favicon.svg`,type:"image/svg+xml"},{url:`${basePath}/icon-192.png`,sizes:"192x192",type:"image/png"}],apple:[{url:`${basePath}/apple-touch-icon.png`,sizes:"180x180",type:"image/png"}]}};
export const viewport:Viewport={width:"device-width",initialScale:1,viewportFit:"cover",themeColor:"#111114"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ru"><body className={manrope.variable}><AuthGuard><div className="app-shell"><Header/><div className="app-content">{children}<footer className="app-footer"><span>© 2026 IskraAi · 18+</span><span>Условия · Конфиденциальность</span></footer></div></div></AuthGuard></body></html>}
