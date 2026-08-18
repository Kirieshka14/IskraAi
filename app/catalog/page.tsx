"use client";
import{Search}from"lucide-react";
import{useEffect,useMemo,useState}from"react";
import{CharacterPoster}from"@/components/content-card";
import{genreLabels}from"@/lib/mock-data";
import{HttpApiClient,type ApiBot}from"@/lib/api";
import type{Genre}from"@/lib/types";
const api=new HttpApiClient();
export default function CatalogPage(){const[bots,setBots]=useState<ApiBot[]>([]),[query,setQuery]=useState("");useEffect(()=>{api.getBots().then(setBots).catch(()=>setBots([]))},[]);const visible=useMemo(()=>bots.filter(item=>(item.name+" "+(item.description??"")).toLowerCase().includes(query.toLowerCase())),[bots,query]);const groups=useMemo(()=>Object.entries(genreLabels).map(([key,label])=>({key:key as Genre,label,items:visible.filter(item=>item.genre===key)})).filter(group=>group.items.length),[visible]);return <main className="page-wrap"><header className="page-heading"><div><span className="eyebrow">Все персонажи</span><h1>Каталог</h1><p>Персонажи разделены по жанрам и отсортированы по лайкам.</p></div><label className="catalog-search"><Search size={18}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Найти персонажа"/></label></header>{visible.length>0&&<section className="content-rail"><header><h2>Популярное</h2></header><div className="rail-scroll">{visible.slice(0,8).map((item,index)=><CharacterPoster key={item.id} item={item} index={index}/>)}</div></section>}{groups.map(group=><section className="content-rail" key={group.key}><header><h2>{group.label}</h2><span>{group.items.length}</span></header><div className="rail-scroll">{group.items.map((item,index)=><CharacterPoster key={item.id} item={item} index={index}/>)}</div></section>)}{!visible.length&&<div className="empty-panel">Персонажей пока нет.</div>}</main>}
