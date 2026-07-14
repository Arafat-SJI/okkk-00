import React from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <PageLayout>
      <PageLayout.Header>
        <h1 className="text-2xl font-bold">TaskFlow</h1>
        <p className="text-sm text-slate-600">Team task management made simple.</p>
      </PageLayout.Header>

      <PageLayout.Content>
        <div className="max-w-2xl">
          <p className="mb-4">
            Welcome to TaskFlow. Sign in to manage your tasks, or create an account from the login screen.
          </p>

          <div className="flex gap-3">
            <Link to="/login" className="rounded bg-slate-800 text-white px-4 py-2">
              Get started
            </Link>
            <Link to="/dashboard" className="rounded border px-4 py-2">
              Demo (requires auth)
            </Link>
          </div>
        </div>
      </PageLayout.Content>
    </PageLayout>
  );
}
