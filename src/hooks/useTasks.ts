import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTasks, createTask, updateTask, deleteTask } from "@/lib/api/tasksService";
import { TaskInsert, TaskUpdate } from "@/types";

export function useTasks(userId?: string, options?: { limit?: number }) {
  const queryClient = useQueryClient();
  const limit = options?.limit ?? 20;

  const queryKey = ["tasks", userId, limit];

  const query = useQuery(
    queryKey,
    async () => {
      if (!userId) throw new Error("No user id");
      const res = await fetchTasks({ userId, limit, offset: 0 });
      return res;
    },
    { enabled: !!userId }
  );

  const createMut = useMutation((payload: TaskInsert) => createTask(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", userId]);
    },
  });

  const updateMut = useMutation(({ id, payload }: { id: string; payload: TaskUpdate }) => updateTask(id, payload), {
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", userId]);
    },
  });

  const deleteMut = useMutation((id: string) => deleteTask(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", userId]);
    },
  });

  return { query, createMut, updateMut, deleteMut, queryClient };
}
