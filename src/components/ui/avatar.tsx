import * as React from "react";
import { cn } from "@/lib/utils";

export function Avatar({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("relative h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}>{children}</div>;
}

export function AvatarImage({ src, alt }: { src: string; alt?: string }) {
  return <img className="aspect-square h-full w-full object-cover" src={src} alt={alt} />;
}

export function AvatarFallback({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-muted text-sm font-medium text-muted-foreground">
      {children}
    </div>
  );
}
