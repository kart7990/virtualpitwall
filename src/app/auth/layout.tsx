import { SiteHeader } from '@/components/core/site-header'
import { SiteFooter } from '@/components/core/site-footer'
import RequireAuth from '../auth/components/RequireAuth'

export default function AuthLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="relative flex min-h-screen flex-col">
            <SiteHeader isPublic={true} />
            <div className="flex h-screen border-b">{children}</div>
            <SiteFooter />
        </div>
    )
}

