import { SiteHeader } from '@/components/core/site-header'
import { SiteFooter } from '@/components/core/site-footer'
import RequireAuth from './components/require-auth'

import { GoogleOAuthProvider } from '@react-oauth/google'

export default function AuthLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="relative flex h-screen flex-col">
            <SiteHeader isPublic={true} />
            <GoogleOAuthProvider clientId="477697685987-i8d05tutmr4q51s4bqbkbqq7a5h0vigv.apps.googleusercontent.com">
                <div className="flex h-full border-b">{children}</div>
            </GoogleOAuthProvider>
            <SiteFooter />
        </div>
    )
}

