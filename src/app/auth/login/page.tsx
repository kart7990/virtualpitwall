"use client"

import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_V2_URL } from "@/config/urls"
import { useGoogleLogin } from '@react-oauth/google'
import { Button } from "@/components/core/ui/button"
import { ExternalLoginData, OAuthProviderData } from "../models"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/core/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"


export default function Login() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [serverError, setServerError] = useState<string | null>(null);
    const [externalData, setOAuthProviderData] = useState();
    const [displayRegister, setDisplayRegister] = useState(false);
    const [displayReturnToApp, setDisplayReturnToApp] = useState(false);

    const [loading, setLoading] = useState(false);

    const googleLogin = useGoogleLogin({
        onSuccess: async tokenResponse => {
            console.log(tokenResponse);
            // fetching userinfo can be done on the client or the server
            const userInfo = await axios
                .get('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                })
                .then(res => res.data);

            await onOAuthSuccess({
                email: userInfo.email,
                name: userInfo.name,
                provider: 'google',
                token: tokenResponse.access_token
            })
        },
    })

    const onOAuthSuccess = async (data: OAuthProviderData) => {
        setLoading(true)
        setServerError(null)
        try {
            var loginResponse = await axios.post(`${API_V2_URL}/authentication/loginexternal`, { provider: data.provider, token: data.token });
            setLoading(false)
            if (loginResponse.status === 200) {
                let webRedirectUrl = searchParams.get("redirect");
                let appRedirectUrl = searchParams.get("redirect_uri");
                if (appRedirectUrl != null) {
                    let config = {
                        headers: {
                            Authorization: loginResponse.data.accessToken,
                        }
                    }
                    setLoading(true)
                    //dispatch(auth.onAuthSuccess(loginResponse.data, false))
                    await axios.post(`${appRedirectUrl}`, null, config);
                    setLoading(false)
                    setDisplayReturnToApp(true)
                } else if (webRedirectUrl != null) {
                    //dispatch(auth.onAuthSuccess(loginResponse.data, false))
                    router.replace(webRedirectUrl)
                } else {
                    router.replace('/pitwall/home')
                }
            } else if (loginResponse.status === 202) {
                router.replace('/auth/register')
            } else {
                setServerError("Request failed, please try again.");
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
            setServerError("Request failed, please try again.");
        }
    }

    return (
        <div className="m-auto">
            <div className="grid grid-rows-4 grid-flow-col justify-items-center">
                <div className="row-span-1">
                    <h2 className="scroll-m-20 text-center border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                        SIGN IN
                    </h2>
                </div>
                <div className="row-span-1">
                    <Button onClick={() => googleLogin()}>Sign in with Google 🚀</Button>
                </div>
                {serverError &&
                    <div>
                        <Alert variant="destructive">
                            <ExclamationTriangleIcon className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {serverError}
                            </AlertDescription>
                        </Alert>
                    </div>
                }
                <div className="row-span-1">
                    <div id="alert-additional-content-4" className=" p-4 mb-4 text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800" role="alert">
                        <div className="flex items-center">
                            <svg className="flex-shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                            </svg>
                            <span className="sr-only">Info</span>
                            <h3 className="text-lg font-medium">More auth providers coming soon.</h3>
                        </div>
                        <div className="mt-2 mb-4 text-sm">
                            If you don't have a Google account, it only takes a few minutes to create one. We expect to add more login providers in the future.
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}