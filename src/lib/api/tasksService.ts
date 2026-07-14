import { supabase } from "@/integrations/supabase/client";
import { Task, TaskInsert, TaskUpdate } from "@/types";
import { PostgrestError } from "@supabase/supabase-js";

const TASKS_TABLE = "tasks";

/**
 * Fetch paginated tasks for the current user with optional filters/search/sort.
 */
export async function fetchTasks({
  userId,
  limit = 20,
  offset = 0,
  status,
  priority,
  q,
  sortBy = "created_at",
  sortDir = "desc",
}: {
  userId: string;
  limit?: number;
  offset?: number;
  status?: string | null;
  priority?: string | null;
  q?: string | null;
  sortBy?: "created_at" | "due_date";
  sortDir?: "asc" | "desc";
}) {
  let query = supabase.from<Task>(TASKS_TABLE).select("*").eq("user_id", userId);

  if (status) query = query.eq("status", status);
  if (priority) query = query.eq("priority", priority);
  if (q) {
    // simple full-text-like search on title and description
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  }

  query = query.order(sortBy === "due_date" ? "due_date" : "created_at", { ascending: sortDir === "asc" });
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query.throwOnError().maybeSingle(); // we'll handle below

  // Supabase range + select without count in simple way: use .range and get data array.
  // But .maybeSingle above isn't suitable; instead re-run properly:
  const res = await supabase
    .from<Task>(TASKS_TABLE)
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .modify((q) => {
      if (status) q.eq("status", status);
      if (priority) q.eq("priority", priority);
      if (q) q.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
    })
    .order(sortBy === "due_date" ? "due_date" : "created_at", { ascending: sortDir === "asc" })
    .range(offset, offset + limit - 1);

  if (res.error) throw res.error;
  return { tasks: res.data ?? [], count: res.count ?? 0 };
}

export async function createTask(payload: TaskInsert) {
  const res = await supabase.from<Task>(TASKS_TABLE).insert(payload).select().single();
  if (res.error) throw res.error;
  return res.data;
}

export async function updateTask(id: string, payload: TaskUpdate) {
  const res = await supabase.from<Task>(TASKS_TABLE).update(payload).eq("id", id).select().single();
  if (res.error) throw res.error;
  return res.data;
}

export async function deleteTask(id: string) {
  const res = await supabase.from<Task>(TASKS_TABLE).delete().eq("id", id).select().single();
  if (res.error) throw res.error;
  return res.data;
}
