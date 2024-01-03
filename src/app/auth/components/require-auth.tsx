"use client"

import axios from 'axios';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation'
import { useRouter } from "next/navigation";

import {
    useSelector,
    selectIsAuthenticated,
    selectOAuthToken,
    authSlice,
    JWT,
    useDispatch
} from '@/lib/redux'
import { Icons } from '@/components/core/icons';


export default function RequireAuth({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const dispatch = useDispatch()

    const isAuthenticated = useSelector<boolean>(selectIsAuthenticated)
    const oAuthToken = useSelector<JWT | undefined>(selectOAuthToken)

    useEffect(() => {
        if (!isAuthenticated) {
            router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`)
        }
    }, [isAuthenticated, pathname, router]);

    useEffect(() => {
        axios.interceptors.request.clear()
        if (oAuthToken != undefined) {
            axios.interceptors.request.use(async (config) => {
                let expiration = new Date(0).setUTCSeconds(oAuthToken.expires);
                if (Date.now() < expiration - 10 /*10 is slight buffer to ensure request won't expire in transit*/) {
                    config.headers.Authorization = `Bearer ${oAuthToken.accessToken}`
                } else {
                    dispatch(authSlice.actions.logoff())
                }
                return config
            });
        }
        return () => { axios.interceptors.request.clear() }
    }, [oAuthToken, dispatch])

    return (
        <>
            {!isAuthenticated ?
                <div className="m-auto">
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                </div>
                :
                <div>
                    {children}
                </div>
            }
        </>
    )
}
