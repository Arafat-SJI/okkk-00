import React from "react";
import { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

type Props = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (task: Task) => void;
};

export function TaskItem({ task, onEdit, onDelete, onToggleStatus }: Props) {
  return (
    <div className="p-4 border rounded-md flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{task.title}</h3>
          <span className="text-sm px-2 py-1 rounded bg-slate-100 text-slate-800">{task.priority}</span>
        </div>
        <p className="text-sm text-slate-600 mt-1">{task.description}</p>
        <div className="text-xs text-slate-500 mt-2">
          Due: {task.due_date ? format(new Date(task.due_date), "PPP") : "No due date"} • Created:{" "}
          {format(new Date(task.created_at), "PPP")}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(task)}>
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(task.id)}>
            Delete
          </Button>
        </div>
        <div>
          <Button size="sm" onClick={() => onToggleStatus(task)}>
            {task.status === "completed" ? "Mark Todo" : task.status === "in_progress" ? "Mark Completed" : "Start"}
          </Button>
        </div>
      </div>
    </div>
  );
}
