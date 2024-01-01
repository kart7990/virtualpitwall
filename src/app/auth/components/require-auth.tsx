"use client"
import { useEffect } from 'react';
import { RedirectType, redirect } from 'next/navigation'
import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router';

import {
    useSelector,
    selectIsAuthenticated
} from '@/lib/redux'


export default function RequireAuth({ children }: { children: React.ReactNode }) {
    //const authentication = useSelector(state => state.authentication)
    const pathname = usePathname()
    const params = useSearchParams()
    
    const isAuthenticated = useSelector<boolean>(selectIsAuthenticated)

    useEffect(() => {
        // Redirect if not signed in
        // if (authentication.isAuthenticated === false || getTokens() === null) {
        //   if (authentication.isUserLogout) {
        //     // Use replace instead of push so you don't break back button
        //     history.replace("/");
        //   } else {
        //}
        if(!isAuthenticated) {
            redirect(`/auth/login?redirect=${encodeURIComponent(pathname)}`)
        }
    }, [isAuthenticated, pathname]);

    return (
        <>
            {children}
        </>
    )
}
