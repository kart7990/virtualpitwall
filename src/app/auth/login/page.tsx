"use client"
import Link from "next/link"
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GoogleLogin } from '@react-oauth/google'

export default function Login() {
    return (
        <>
            <div className="m-auto">

                <div className="grid grid-rows-3 grid-flow-col gap-2 justify-items-center">
                    <div className="row-span-1">
                        <h2 className="scroll-m-20 text-center border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                            SIGN IN
                        </h2>
                    </div>
                    <div className="row-span-1">
                        <GoogleOAuthProvider clientId="477697685987-i8d05tutmr4q51s4bqbkbqq7a5h0vigv.apps.googleusercontent.com">
                            <GoogleLogin
                                text="signin_with"
                                onSuccess={credentialResponse => {
                                    console.log(credentialResponse);
                                }}
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                            />
                        </GoogleOAuthProvider>
                    </div>
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
            </div>
        </>
    )
}