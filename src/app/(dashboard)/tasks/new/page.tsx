"use client";

import { useRouter } from "next/navigation";
import { useTasks } from "@/lib/hooks/use-tasks";
import { PageHeader } from "@/components/shared/page-header";
import { TaskCreateForm } from "@/components/tasks/task-create-form";

export default function NewTaskPage() {
  const router = useRouter();
  const { createTask } = useTasks();

  const handleSubmit = async (data: {
    title: string;
    description: string;
    teamId: string;
    workingDirectory: string;
    priority: string;
    stages: Array<{
      id: string;
      name: string;
      agentId: string;
      description: string;
      order: number;
      dependsOn: string[];
    }>;
  }) => {
    await createTask(data);
    router.push("/tasks");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Yeni Görev"
        description="Yeni bir görev ve iş hattı aşamalarını yapılandırın."
      />
      <TaskCreateForm onSubmit={handleSubmit} />
    </div>
  );
}
