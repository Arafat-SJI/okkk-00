import { Link } from "react-router-dom";

import { ExampleFeature } from "@/components/examples/ExampleFeature";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";

/**
 * Dedicated route that shows React composition end-to-end.
 * Copy this structure when adding real product pages.
 */
export default function CompositionDemoPage() {
  return (
    <PageLayout>
      <PageLayout.Header
        title="Composition patterns"
        description="Compound PageLayout + slot-based Toolbar / EmptyState + render props for lists."
        actions={
          <Button variant="outline" asChild>
            <Link to="/">Back home</Link>
          </Button>
        }
      />
      <PageLayout.Content>
        <ExampleFeature />
      </PageLayout.Content>
    </PageLayout>
  );
}
