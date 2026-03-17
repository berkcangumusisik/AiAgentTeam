"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RunTerminalProps {
  output: string;
}

export function RunTerminal({ output }: RunTerminalProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output]);

  const lines = output.split("\n");

  return (
    <div className="rounded-lg border bg-zinc-950 text-green-400 font-mono text-sm">
      <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-2">
        <div className="size-3 rounded-full bg-red-500" />
        <div className="size-3 rounded-full bg-yellow-500" />
        <div className="size-3 rounded-full bg-green-500" />
        <span className="ml-2 text-xs text-zinc-500">Terminal Çıktısı</span>
      </div>
      <ScrollArea className="h-[500px]">
        <div className="p-4 space-y-px">
          {lines.length === 0 || (lines.length === 1 && lines[0] === "") ? (
            <div className="text-zinc-600">Henüz terminal çıktısı yok...</div>
          ) : (
            lines.map((line, index) => (
              <div
                key={index}
                className="whitespace-pre-wrap break-all leading-relaxed"
              >
                <span className="select-none text-zinc-600 mr-3">
                  {String(index + 1).padStart(3, " ")}
                </span>
                {line || "\u00A0"}
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
  );
}
