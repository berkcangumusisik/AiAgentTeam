import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusDot } from "@/components/shared/status-dot";
import { cn } from "@/lib/utils";
import type { RunAgentState } from "@/lib/types";

interface RunAgentStatusProps {
  agentStates: RunAgentState[];
}

const agentStatusToDotStatus: Record<
  RunAgentState["status"],
  "idle" | "warning" | "info" | "success" | "error"
> = {
  idle: "idle",
  thinking: "warning",
  "tool-calling": "info",
  done: "success",
  error: "error",
};

const agentStatusLabel: Record<RunAgentState["status"], string> = {
  idle: "Boşta",
  thinking: "Düşünüyor",
  "tool-calling": "Araç Çağrısı",
  done: "Tamamlandı",
  error: "Hata",
};

function shouldPulse(status: RunAgentState["status"]): boolean {
  return status === "thinking" || status === "tool-calling";
}

export function RunAgentStatus({ agentStates }: RunAgentStatusProps) {
  if (agentStates.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Ajanlar</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Aktif ajan yok</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Ajanlar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {agentStates.map((agent) => (
            <div
              key={agent.agentId}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-3 transition-colors",
                agent.status === "thinking" && "border-amber-500/30 bg-amber-500/5",
                agent.status === "tool-calling" && "border-blue-500/30 bg-blue-500/5",
                agent.status === "error" && "border-red-500/30 bg-red-500/5",
                agent.status === "done" && "border-emerald-500/30 bg-emerald-500/5"
              )}
            >
              <StatusDot
                status={agentStatusToDotStatus[agent.status]}
                pulse={shouldPulse(agent.status)}
                className="mt-1.5"
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{agent.agentName}</span>
                  <span className="text-xs text-muted-foreground">
                    {agentStatusLabel[agent.status]}
                  </span>
                </div>
                {agent.currentActivity && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {agent.currentActivity}
                  </p>
                )}
                <div className="text-xs text-muted-foreground">
                  {agent.tokensUsed.toLocaleString()} token kullanıldı
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
