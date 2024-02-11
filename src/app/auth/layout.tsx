import { SiteFooter } from "@/components/core/site-footer";
import { SiteHeader } from "@/components/core/site-header";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-screen flex-col">
      <SiteHeader isPublic={true} />
      <GoogleOAuthProvider clientId={process.env.GOOGLE_OAUTH_CLIENT_ID!!}>
        <div className="flex h-full border-b">{children}</div>
      </GoogleOAuthProvider>
      <SiteFooter />
    </div>
  );
}
