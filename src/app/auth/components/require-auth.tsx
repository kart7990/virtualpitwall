"use client"
import { useEffect } from 'react';
import { useSelector } from "react-redux"
import { RedirectType, redirect } from 'next/navigation'
import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router';


export default function RequireAuth({ children }: { children: React.ReactNode }) {
    //const authentication = useSelector(state => state.authentication)
    const pathname = usePathname()
    const params = useSearchParams()

    useEffect(() => {
        // Redirect if not signed in
        // if (authentication.isAuthenticated === false || getTokens() === null) {
        //   if (authentication.isUserLogout) {
        //     // Use replace instead of push so you don't break back button
        //     history.replace("/");
        //   } else {
        //}
        redirect(`/auth/login?redirect=${encodeURIComponent(pathname)}`)
    }, []);

    return (
        <>
            {children}
        </>
    )
}
