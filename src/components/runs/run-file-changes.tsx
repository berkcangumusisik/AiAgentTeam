import { Plus, Edit, Trash, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { FileChange } from "@/lib/types";

interface RunFileChangesProps {
  fileChanges: FileChange[];
}

const changeTypeConfig: Record<
  FileChange["type"],
  { icon: typeof Plus; color: string; label: string }
> = {
  created: { icon: Plus, color: "text-emerald-500", label: "Oluşturulan" },
  modified: { icon: Edit, color: "text-amber-500", label: "Değiştirilen" },
  deleted: { icon: Trash, color: "text-red-500", label: "Silinen" },
};

export function RunFileChanges({ fileChanges }: RunFileChangesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <FileText className="size-4" />
          Dosya Değişiklikleri
          {fileChanges.length > 0 && (
            <span className="ml-auto text-xs font-normal text-muted-foreground">
              {fileChanges.length} dosya
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {fileChanges.length === 0 ? (
          <p className="text-sm text-muted-foreground">Henüz dosya değişikliği yok</p>
        ) : (
          <div className="space-y-2">
            {fileChanges.map((change, index) => {
              const config = changeTypeConfig[change.type];
              const Icon = config.icon;

              return (
                <div
                  key={`${change.path}-${index}`}
                  className="flex items-center gap-2 rounded-md border px-3 py-2"
                >
                  <Icon className={cn("size-4 shrink-0", config.color)} />
                  <span
                    className="flex-1 truncate text-sm font-mono"
                    title={change.path}
                  >
                    {change.path}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 text-xs font-medium",
                      config.color
                    )}
                  >
                    {config.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
