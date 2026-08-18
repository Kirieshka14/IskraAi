import Link from "next/link";
import {Heart}from"lucide-react";
import type{ApiBot}from"@/lib/api";
import type{StorySummary}from"@/lib/types";
const tones=["#8f706d","#6d748d","#81755f","#6c806f","#796882","#80675f"];
export function CharacterPoster({item,index=0}:{item:ApiBot;index?:number}){const initials=item.name.split(/\s+/).map(x=>x[0]).slice(0,2).join("").toUpperCase();return <Link href={`/chat/?bot=${item.id}`} className="poster-card" style={{background:`linear-gradient(160deg,${tones[index%tones.length]},#18181b 76%)`}}><div className="poster-avatar">{initials}</div><div className="poster-copy"><b>{item.name}</b><span>{item.description||"Новая история"}</span><small><Heart size={12}/>{item.likes_count||0}</small></div></Link>}
export function StoryPoster({item,index=0}:{item:StorySummary;index?:number}){return <Link href={`/stories/${item.id}`} className="story-poster" style={{background:`linear-gradient(135deg,${tones[(index+2)%tones.length]},#17171b)`}}><div><small>{item.mode==="infinite"?"Бесконечная":"Сюжетная"}</small><h3>{item.title}</h3><p>{item.subtitle||item.description}</p></div><span><Heart size={13}/>{item.likes_count}</span></Link>}
