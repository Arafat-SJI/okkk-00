import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types";

const PROFILES_TABLE = "profiles";

export async function getProfile(userId: string) {
  const res = await supabase.from<Profile>(PROFILES_TABLE).select("*").eq("id", userId).single();
  if (res.error) throw res.error;
  return res.data;
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const res = await supabase.from<Profile>(PROFILES_TABLE).upsert({ id: userId, ...updates }, { onConflict: "id" }).select().single();
  if (res.error) throw res.error;
  return res.data;
}

export async function uploadAvatar(userId: string, file: File) {
  // store in 'avatars' bucket, file path: userId/<filename>
  const path = `${userId}/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
  if (uploadError) throw uploadError;

  const { publicURL, error } = supabase.storage.from("avatars").getPublicUrl(path);
  if (error) throw error;
  // update profile with avatar_url
  await updateProfile(userId, { avatar_url: publicURL });
  return publicURL;
}
