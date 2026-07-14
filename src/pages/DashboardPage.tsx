import React, { useMemo, useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useTasks } from "@/hooks/useTasks";
import { TaskItem } from "@/components/tasks/TaskItem";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { Button } from "@/components/ui/button";
import { Task } from "@/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const userId = user?.id;
  const { query: profileQuery } = useProfile(userId);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [priority, setPriority] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("newest");

  const { query, createMut, updateMut, deleteMut } = useTasks(userId);

  const tasks = query.data?.tasks ?? [];
  const counts = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const inProgress = tasks.filter((t) => t.status === "in_progress").length;
    const todo = tasks.filter((t) => t.status === "todo").length;
    return { total, completed, inProgress, todo };
  }, [tasks]);

  // local client-side filters for quick responsiveness; main fetch is paginated
  const filtered = tasks
    .filter((t) => (q ? `${t.title} ${t.description}`.toLowerCase().includes(q.toLowerCase()) : true))
    .filter((t) => (status ? t.status === status : true))
    .filter((t) => (priority ? t.priority === priority : true))
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === "due_date") {
        return new Date((a.due_date || "") as string).getTime() - new Date((b.due_date || "") as string).getTime();
      }
      return 0;
    });

  function openCreate() {
    setEditing(null);
    setShowForm(true);
  }

  async function handleCreate(values: any) {
    if (!userId) return window.alert("User not authenticated");
    try {
      await createMut.mutateAsync({
        title: values.title,
        description: values.description,
        due_date: values.due_date || null,
        priority: values.priority,
        status: values.status,
        user_id: userId,
      });
      window.alert("Task created");
      setShowForm(false);
    } catch (err: any) {
      window.alert(err.message ?? "Failed to create task");
    }
  }

  function handleEdit(task: Task) {
    setEditing(task);
    setShowForm(true);
  }

  async function handleUpdate(values: any) {
    if (!editing) return;
    try {
      await updateMut.mutateAsync({ id: editing.id, payload: { ...values, due_date: values.due_date || null } });
      window.alert("Task updated");
      setShowForm(false);
    } catch (err: any) {
      window.alert(err.message ?? "Failed to update task");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this task?")) return;
    try {
      await deleteMut.mutateAsync(id);
      window.alert("Task deleted");
    } catch (err: any) {
      window.alert(err.message ?? "Failed to delete task");
    }
  }

  async function handleToggleStatus(task: Task) {
    const next =
      task.status === "completed" ? "todo" : task.status === "in_progress" ? "completed" : "in_progress";
    try {
      await updateMut.mutateAsync({ id: task.id, payload: { status: next } });
      window.alert("Task status updated");
    } catch (err: any) {
      window.alert(err.message ?? "Failed to update status");
    }
  }

  return (
    <PageLayout>
      <PageLayout.Header>
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-xl font-bold">Dashboard</h1>
            <div className="text-sm text-slate-600">Welcome back{profileQuery.data?.name ? `, ${profileQuery.data.name}` : ""}.</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm">
              <div>Total: {counts.total}</div>
              <div>Completed: {counts.completed}</div>
              <div>In progress: {counts.inProgress}</div>
            </div>
            <Button onClick={openCreate}>Create task</Button>
          </div>
        </div>
      </PageLayout.Header>

      <PageLayout.Content>
        <div className="space-y-4">
          <TaskFilters
            q={q}
            onSearch={setQ}
            status={status}
            priority={priority}
            onStatusChange={setStatus}
            onPriorityChange={setPriority}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {query.isLoading && <div>Loading tasks...</div>}
          {query.isError && <div className="text-red-600">Failed to load tasks: {(query.error as any)?.message}</div>}
          {query.isSuccess && filtered.length === 0 && <div className="text-sm text-slate-600">No tasks yet. Create one!</div>}

          <div className="grid gap-3">
            {filtered.map((t) => (
              <TaskItem key={t.id} task={t} onEdit={handleEdit} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />
            ))}
          </div>
        </div>
      </PageLayout.Content>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded p-4 w-full max-w-lg">
            <h2 className="text-lg font-medium mb-3">{editing ? "Edit task" : "Create task"}</h2>
            <TaskForm
              initialValues={
                editing
                  ? {
                      title: editing.title,
                      description: editing.description,
                      due_date: editing.due_date ? String(editing.due_date).slice(0, 10) : undefined,
                      priority: editing.priority as any,
                      status: editing.status as any,
                    }
                  : undefined
              }
              onCancel={() => setShowForm(false)}
              onSubmit={editing ? handleUpdate : handleCreate}
              loading={createMut.isLoading || updateMut.isLoading}
            />
          </div>
        </div>
      )}
    </PageLayout>
  );
}
