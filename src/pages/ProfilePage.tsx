import React, { useRef, useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { user } = useAuth();
  const userId = user?.id;
  const { query, updateMut, uploadMut } = useProfile(userId);
  const [name, setName] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (query.data) {
      setName(query.data.name ?? "");
    }
  }, [query.data]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateMut.mutateAsync({ name });
      window.alert("Profile updated");
    } catch (err: any) {
      window.alert(err.message ?? "Failed to update profile");
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    if (file.size > 2_000_000) return window.alert("Max 2MB");
    try {
      await uploadMut.mutateAsync(file);
      window.alert("Avatar updated");
    } catch (err: any) {
      window.alert(err.message ?? "Failed to upload avatar");
    }
  }

  return (
    <PageLayout>
      <PageLayout.Header>
        <h1 className="text-xl font-bold">Profile</h1>
      </PageLayout.Header>

      <PageLayout.Content>
        {query.isLoading && <div>Loading...</div>}
        {query.isError && <div className="text-red-600">Failed to load profile</div>}
        {query.data && (
          <form onSubmit={handleSave} className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded border p-2" />
            </div>

            <div>
              <label className="block text-sm font-medium">Email</label>
              <div className="mt-1 text-sm">{user?.email}</div>
            </div>

            <div>
              <label className="block text-sm font-medium">Avatar</label>
              <div className="mt-1 flex items-center gap-3">
                {query.data.avatar_url ? <img src={query.data.avatar_url} alt="avatar" className="w-16 h-16 rounded" /> : <div className="w-16 h-16 bg-slate-100 rounded flex items-center justify-center">No avatar</div>}
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={updateMut.isLoading}>
                {updateMut.isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        )}
      </PageLayout.Content>
    </PageLayout>
  );
}
