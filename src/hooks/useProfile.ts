import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile, uploadAvatar } from "@/lib/api/profileService";

export function useProfile(userId?: string) {
  const queryClient = useQueryClient();
  const query = useQuery(["profile", userId], async () => {
    if (!userId) throw new Error("No user id");
    return getProfile(userId);
  }, { enabled: !!userId });

  const updateMut = useMutation((updates: any) => updateProfile(userId!, updates), {
    onSuccess: () => queryClient.invalidateQueries(["profile", userId]),
  });

  const uploadMut = useMutation((file: File) => uploadAvatar(userId!, file), {
    onSuccess: () => queryClient.invalidateQueries(["profile", userId]),
  });

  return { query, updateMut, uploadMut };
}
