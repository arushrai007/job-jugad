"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Coffee, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-2 p-1 rounded-full border bg-background/50 backdrop-blur-sm">
      <Button
        variant={theme === "light" ? "default" : "ghost"}
        size="icon"
        className="rounded-full h-8 w-8"
        onClick={() => setTheme("light")}
        title="Light Mode"
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant={theme === "dark" ? "default" : "ghost"}
        size="icon"
        className="rounded-full h-8 w-8"
        onClick={() => setTheme("dark")}
        title="Dark Mode"
      >
        <Moon className="h-4 w-4" />
      </Button>
      <Button
        variant={theme === "zen" ? "default" : "ghost"}
        size="icon"
        className="rounded-full h-8 w-8"
        onClick={() => setTheme("zen")}
        title="Zen Mode"
      >
        <Coffee className="h-4 w-4" />
      </Button>
      <Button
        variant={theme === "system" ? "default" : "ghost"}
        size="icon"
        className="rounded-full h-8 w-8"
        onClick={() => setTheme("system")}
        title="System Mode"
      >
        <Laptop className="h-4 w-4" />
      </Button>
    </div>
  );
}
