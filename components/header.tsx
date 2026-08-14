"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, PenLine, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { hasCachedSession } from "@/lib/session";
const links=[{href:"/",label:"Персонажи"},{href:"/create",label:"Создать"},{href:"/creator",label:"Автору"},{href:"/profile",label:"Профиль"}];
export function Header(){const path=usePathname();const [open,setOpen]=useState(false);const [loggedIn,setLoggedIn]=useState(false);useEffect(()=>setOpen(false),[path]);useEffect(()=>{setLoggedIn(hasCachedSession())},[path]);if(path==="/auth"||path==="/register")return null;return <header className="site-header"><div className="site-header-inner"><Link href="/" className="brand-link" aria-label="IskraAi — на главную"><BrandMark className="h-9 w-9"/><span>IskraAi</span></Link><nav className="desktop-nav" aria-label="Основная навигация">{links.map(l=><Link key={l.href} href={l.href} className={cn("nav-link",path===l.href&&"is-active")}>{l.label}</Link>)}</nav><div className="header-actions"><ThemeToggle/><Link href="/create" aria-label="Создать персонажа" className="icon-button"><PenLine size={18}/></Link>{loggedIn?<Link href="/profile" className="profile-button"><UserRound size={18}/><span>Профиль</span></Link>:<Link href="/auth" className="profile-button"><UserRound size={18}/><span>Войти</span></Link>}</div><button className="menu-button" onClick={()=>setOpen(!open)} aria-label={open?"Закрыть меню":"Открыть меню"} aria-expanded={open}>{open?<X/>:<Menu/>}</button></div>{open&&<nav className="mobile-nav" aria-label="Мобильная навигация">{links.map(l=><Link key={l.href} href={l.href} className={cn("mobile-nav-link",path===l.href&&"is-active")}>{l.label}</Link>)}<div className="flex items-center justify-between px-2"><Link href="/auth" className="mobile-nav-link">Войти</Link><ThemeToggle/></div></nav>}</header>}
