"use client"

import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { API_V2_URL } from "@/config/urls"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/core/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/core/ui/form"
import { Input } from "@/components/core/ui/input"
import { useRouter } from "next/navigation";
import {
    authSlice,
    useDispatch
} from '@/lib/redux'
import { Icons } from '@/components/core/icons'

const accountFormSchema = z.object({
    name: z
        .string()
        .min(2, {
            message: "Name must be at least 2 characters.",
        })
        .max(50, {
            message: "Name must not be longer than 50 characters.",
        }),
    email: z.string({
        required_error: "Email is required.",
    }),
    provider: z.string({
        required_error: "Provider is required.",
    }),
    token: z.string({
        required_error: "Token is required.",
    }),
    iracingCustomerId: z.string({

    })
})

type AccountFormValues = z.infer<typeof accountFormSchema>

const defaultValues: Partial<AccountFormValues> = {
    iracingCustomerId: "",
}

export default function Register({ accountFormValues }: { accountFormValues: AccountFormValues }) {
    const dispatch = useDispatch()
    const router = useRouter()
    const [serverError, setServerError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);

    const form = useForm<AccountFormValues>({
        resolver: zodResolver(accountFormSchema),
        defaultValues,
    })


    const onSubmit = useCallback(async (data: AccountFormValues) => {
        setLoading(true)
        try {
            var registerResponse = await axios.post(`${API_V2_URL}/authentication/registerexternal`, data);
            if (registerResponse.status === 200) {
                dispatch(authSlice.actions.setJwt(registerResponse.data))
                router.replace('/pitwall/home')
            } else {
                setServerError("Register failed");
            }
        } catch (error) {
            setServerError("Register failed");
        } finally {
            setLoading(false)
        }
    }, [dispatch, router])

    useEffect(() => {
        //SILENT REGISTER - No additional fields required beyond what OAuth provider gives.
        const silentRegister = async () => {
            await onSubmit(accountFormValues)
        }
        if (accountFormValues) {
            silentRegister()
        }
    }, [accountFormValues, onSubmit]);

    return (
        <div className="m-auto">

            {loading ?
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                :
                <>
                    <div className="mb-12">
                        <h2 className="scroll-m-20 text-center border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                            REGISTER
                        </h2>
                    </div>
                    <div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input readOnly placeholder="test@email.com" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Email is automatically populated from auth provider and can't be changed.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input readOnly placeholder="Your name" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                This is the name that will be displayed on your profile and in
                                                emails.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">Create Account</Button>
                            </form>
                        </Form>
                    </div>
                </>
            }
        </div>
    )
}