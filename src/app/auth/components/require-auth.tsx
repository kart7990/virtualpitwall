"use client"
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from "next/navigation";

import {
    useSelector,
    selectIsAuthenticated
} from '@/lib/redux'
import { Icons } from '@/components/core/icons';
import { delay } from '@/lib/utils';


export default function RequireAuth({ children }: { children: React.ReactNode }) {
    //const authentication = useSelector(state => state.authentication)
    const pathname = usePathname()
    const params = useSearchParams()
    const router = useRouter()

    const isAuthenticated = useSelector<boolean>(selectIsAuthenticated)

    useEffect(() => {
        if (!isAuthenticated) {
            router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`)
        }
    }, [isAuthenticated, pathname]);

    return (
        <>
            {!isAuthenticated ?
                <div className="m-auto">
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                </div>
                :
                { children }
            }
        </>
    )
}
