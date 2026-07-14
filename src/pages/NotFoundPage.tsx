import { Link } from "react-router-dom";

import { EmptyState } from "@/components/layout/EmptyState";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <PageLayout>
      <PageLayout.Content className="flex items-center justify-center py-24">
        <EmptyState
          title="Page not found"
          description="The page you requested does not exist."
          action={
            <Button asChild>
              <Link to="/">Back home</Link>
            </Button>
          }
        />
      </PageLayout.Content>
    </PageLayout>
  );
}
