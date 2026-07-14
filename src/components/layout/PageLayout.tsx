import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageLayoutProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

/**
 * Compound page shell â compose Header / Content / Footer as children.
 *
 * @example
 * <PageLayout>
 *   <PageLayout.Header title="Inbox" actions={<Button>New</Button>} />
 *   <PageLayout.Content>{list}</PageLayout.Content>
 *   <PageLayout.Footer>Optional meta</PageLayout.Footer>
 * </PageLayout>
 */
function PageLayoutRoot({ children, className, ...props }: PageLayoutProps) {
  return (
    <div className={cn("flex min-h-screen flex-col bg-background", className)} {...props}>
      {children}
    </div>
  );
}

type HeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

function PageLayoutHeader({ title, description, actions, className }: HeaderProps) {
  return (
    <header className={cn("border-b border-border", className)}>
      <div className="container mx-auto flex max-w-3xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}

type ContentProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  /** Narrow readable column (default) vs full width */
  width?: "default" | "wide" | "full";
};

function PageLayoutContent({ children, className, width = "default", ...props }: ContentProps) {
  const widthClass =
    width === "full" ? "max-w-none" : width === "wide" ? "max-w-5xl" : "max-w-3xl";

  return (
    <main
      className={cn("container mx-auto flex-1 px-4 py-8 animate-fade-in", widthClass, className)}
      {...props}
    >
      {children}
    </main>
  );
}

type FooterProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

function PageLayoutFooter({ children, className, ...props }: FooterProps) {
  return (
    <footer className={cn("border-t border-border", className)} {...props}>
      <div className="container mx-auto max-w-3xl px-4 py-4 text-sm text-muted-foreground">
        {children}
      </div>
    </footer>
  );
}

export const PageLayout = Object.assign(PageLayoutRoot, {
  Header: PageLayoutHeader,
  Content: PageLayoutContent,
  Footer: PageLayoutFooter,
});
