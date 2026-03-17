import { NextRequest } from "next/server";
import { getRunService } from "@/lib/services/run.service";

type RouteContext = { params: Promise<{ runId: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const { runId } = await context.params;
  const service = getRunService();

  const encoder = new TextEncoder();
  let closed = false;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: unknown) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          closed = true;
        }
      };

      let lastTimestamp: string | undefined;

      const poll = async () => {
        while (!closed) {
          try {
            const events = await service.getEvents(runId, lastTimestamp);
            for (const event of events) {
              send(event);
              lastTimestamp = event.timestamp;
            }

            // Check if run is done
            const run = await service.getRunById(runId);
            if (run && ["completed", "failed", "stopped"].includes(run.status)) {
              send({ type: "run:end", status: run.status });
              closed = true;
              controller.close();
              return;
            }
          } catch {
            // Ignore errors during polling
          }
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      };

      poll();
    },
    cancel() {
      closed = true;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
