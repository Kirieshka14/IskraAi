"use client";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [light, setLight] = useState(false);
  useEffect(() => {
    const value = localStorage.getItem("iskra-theme") === "light";
    setLight(value);
    document.documentElement.dataset.theme = value ? "light" : "dark";
  }, []);
  function toggle() {
    const next = !light;
    setLight(next);
    document.documentElement.dataset.theme = next ? "light" : "dark";
    localStorage.setItem("iskra-theme", next ? "light" : "dark");
  }
  return <button type="button" className="icon-button" onClick={toggle} aria-label={light ? "Включить тёмную тему" : "Включить светлую тему"} title={light ? "Тёмная тема" : "Светлая тема"}>{light ? <Moon size={18}/> : <Sun size={18}/>}</button>;
}
