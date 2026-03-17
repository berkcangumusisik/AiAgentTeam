"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRunStore } from "@/lib/stores/run.store";
import type { RunEvent } from "@/lib/types";

export function useRunEvents(runId: string | null) {
  const { addEvent, clearEvents, events, fetchRunById, currentRun } = useRunStore();
  const eventSourceRef = useRef<EventSource | null>(null);

  const connect = useCallback(() => {
    if (!runId) return;

    clearEvents();
    fetchRunById(runId);

    const eventSource = new EventSource(`/api/runs/${runId}/events`);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (e) => {
      try {
        const raw = JSON.parse(e.data) as Record<string, unknown>;
        if (raw.type === "run:end") {
          fetchRunById(runId);
          eventSource.close();
          return;
        }
        addEvent(raw as unknown as RunEvent);
      } catch {
        // ignore parse errors
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      // Retry after 3 seconds
      setTimeout(() => {
        if (eventSourceRef.current === eventSource) {
          connect();
        }
      }, 3000);
    };
  }, [runId]);

  useEffect(() => {
    connect();
    return () => {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
    };
  }, [connect]);

  return { events, currentRun };
}
