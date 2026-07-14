import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  due_date: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  status: z.enum(["todo", "in_progress", "completed"]).default("todo"),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  initialValues?: Partial<FormValues>;
  onCancel: () => void;
  onSubmit: (values: FormValues) => void;
  loading?: boolean;
};

export function TaskForm({ initialValues, onCancel, onSubmit, loading }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialValues?.title ?? "",
      description: initialValues?.description ?? "",
      due_date: initialValues?.due_date ? String(initialValues?.due_date).slice(0, 10) : "",
      priority: (initialValues?.priority as any) ?? "medium",
      status: (initialValues?.status as any) ?? "todo",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input {...register("title")} className="mt-1 block w-full rounded border p-2" />
        {formState.errors.title && <div className="text-xs text-red-600 mt-1">{formState.errors.title.message}</div>}
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea {...register("description")} className="mt-1 block w-full rounded border p-2" />
      </div>

      <div>
        <label className="block text-sm font-medium">Due Date</label>
        <input type="date" {...register("due_date")} className="mt-1 block w-full rounded border p-2" />
      </div>

      <div className="flex gap-3">
        <div>
          <label className="block text-sm font-medium">Priority</label>
          <select {...register("priority")} className="mt-1 rounded border p-2">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Status</label>
          <select {...register("status")} className="mt-1 rounded border p-2">
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
