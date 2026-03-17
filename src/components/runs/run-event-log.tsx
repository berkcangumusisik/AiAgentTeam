"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { RunEvent, RunEventType } from "@/lib/types";

interface RunEventLogProps {
  events: RunEvent[];
}

const eventTypeLabels: Record<string, string> = {
  "run:started": "Çalıştırma Başladı",
  "run:completed": "Çalıştırma Tamamlandı",
  "run:failed": "Çalıştırma Başarısız",
  "run:stopped": "Çalıştırma Durduruldu",
  "stage:started": "Aşama Başladı",
  "stage:completed": "Aşama Tamamlandı",
  "stage:failed": "Aşama Başarısız",
  "agent:thinking": "Düşünüyor",
  "agent:response": "Yanıt",
  "agent:tool-call": "Araç Çağrısı",
  "agent:tool-result": "Araç Sonucu",
  "agent:error": "Ajan Hatası",
  "agent:done": "Ajan Tamamlandı",
  "terminal:output": "Terminal",
  "file:changed": "Dosya Değişikliği",
  "cost:updated": "Maliyet",
  "log:info": "Bilgi",
  "log:warn": "Uyarı",
  "log:error": "Hata",
};

const eventTypeBadgeVariant: Record<string, string> = {
  "run:started": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "run:completed": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "run:failed": "bg-red-500/10 text-red-600 border-red-500/20",
  "run:stopped": "bg-gray-500/10 text-gray-600 border-gray-500/20",
  "stage:started": "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "stage:completed": "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "stage:failed": "bg-red-500/10 text-red-600 border-red-500/20",
  "agent:thinking": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  "agent:response": "bg-violet-500/10 text-violet-600 border-violet-500/20",
  "agent:tool-call": "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "agent:tool-result": "bg-blue-400/10 text-blue-500 border-blue-400/20",
  "agent:error": "bg-red-500/10 text-red-600 border-red-500/20",
  "agent:done": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "terminal:output": "bg-green-500/10 text-green-600 border-green-500/20",
  "file:changed": "bg-orange-500/10 text-orange-600 border-orange-500/20",
  "cost:updated": "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  "log:info": "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "log:warn": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  "log:error": "bg-red-500/10 text-red-600 border-red-500/20",
};

const filterCategories: { label: string; types: RunEventType[] }[] = [
  {
    label: "Tümü",
    types: [],
  },
  {
    label: "Ajan",
    types: [
      "agent:thinking",
      "agent:response",
      "agent:tool-call",
      "agent:tool-result",
      "agent:error",
      "agent:done",
    ],
  },
  {
    label: "Çalıştırma",
    types: [
      "run:started",
      "run:completed",
      "run:failed",
      "run:stopped",
      "stage:started",
      "stage:completed",
      "stage:failed",
    ],
  },
  {
    label: "Terminal",
    types: ["terminal:output"],
  },
  {
    label: "Günlükler",
    types: ["log:info", "log:warn", "log:error"],
  },
];

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function RunEventLog({ events }: RunEventLogProps) {
  const [activeFilter, setActiveFilter] = useState<string>("Tümü");
  const bottomRef = useRef<HTMLDivElement>(null);

  const filteredEvents = useMemo(() => {
    const category = filterCategories.find((c) => c.label === activeFilter);
    if (!category || category.types.length === 0) return events;
    return events.filter((e) => category.types.includes(e.type));
  }, [events, activeFilter]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [filteredEvents.length]);

  return (
    <div className="space-y-3">
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-1.5">
        {filterCategories.map((category) => (
          <Button
            key={category.label}
            variant={activeFilter === category.label ? "default" : "outline"}
            size="xs"
            onClick={() => setActiveFilter(category.label)}
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Event list */}
      <ScrollArea className="h-[500px] rounded-lg border">
        <div className="divide-y">
          {filteredEvents.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
              Görüntülenecek olay yok
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors"
              >
                {/* Type badge */}
                <Badge
                  variant="outline"
                  className={cn(
                    "shrink-0 text-[10px] min-w-[80px] justify-center",
                    eventTypeBadgeVariant[event.type]
                  )}
                >
                  {eventTypeLabels[event.type] ?? event.type}
                </Badge>

                {/* Timestamp */}
                <span className="shrink-0 text-xs font-mono text-muted-foreground pt-0.5">
                  {formatTimestamp(event.timestamp)}
                </span>

                {/* Message */}
                <span className="flex-1 text-sm text-foreground/90 leading-snug">
                  {event.agentName && (
                    <span className="font-medium text-foreground mr-1.5">
                      [{event.agentName}]
                    </span>
                  )}
                  {event.message}
                </span>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
  );
}
