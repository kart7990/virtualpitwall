import RequireAuth from "../auth/components/require-auth";
import { SiteFooter } from "@/components/core/site-footer";
import { SiteHeader } from "@/components/core/site-header";

export default function PitWallLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <div className="relative flex min-h-screen flex-col">
        <SiteHeader isPublic={false} />
        <div className="flex-1 border-b">{children}</div>
        <SiteFooter />
      </div>
    </RequireAuth>
  );
}
