import type { Metadata, Viewport } from "next";
import { Manrope, Literata } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
const manrope=Manrope({subsets:["cyrillic"],variable:"--font-manrope"});
const literata=Literata({subsets:["cyrillic"],variable:"--font-literata"});
const basePath=process.env.GITHUB_PAGES === "true" ? "/IskraAi" : "";
export const metadata:Metadata={
  title:"IskraAi — истории, которые отвечают",
  description:"Платформа текстового ролевого общения с авторскими ИИ-персонажами",
  applicationName:"IskraAi",
  manifest:`${basePath}/site.webmanifest`,
  icons:{
    icon:[
      {url:`${basePath}/favicon.svg`,type:"image/svg+xml"},
      {url:`${basePath}/icon-192.png`,sizes:"192x192",type:"image/png"},
    ],
    apple:[{url:`${basePath}/apple-touch-icon.png`,sizes:"180x180",type:"image/png"}],
  },
};
export const viewport:Viewport={width:"device-width",initialScale:1,viewportFit:"cover",themeColor:"#f7f4ee"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ru"><body className={`${manrope.variable} ${literata.variable}`}><Header/>{children}<footer className="border-t border-stone-200"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] text-xs leading-5 text-stone-500 sm:flex-row sm:justify-between md:px-6"><span>© 2026 IskraAi · Только для пользователей 18+</span><span>Все диалоги могут использоваться для улучшения сервиса · Условия · Конфиденциальность</span></div></footer></body></html>}
