"use client"

import React, { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/modules/ui/button"
import { Input } from "@/modules/ui/input"
import LoadingSVG from '@/assets/icons/loading'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/modules/ui/form"
import { useAuth } from '@/lib/context/auth/user'
import { useToast } from "@/modules/ui/use-toast"
import { useAuthFlow } from '@/lib/context/auth'

const resetPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
})



interface UserForgotPasswordFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function UserForgotPasswordForm({ className, ...props }: UserForgotPasswordFormProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { updateAuthFlowPage, resetPasswordEmail, setEmail, email, countdown } = useAuthFlow();
    const { toast } = useToast()

    const form = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { email: email ? email : '' },
    })


    const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
        setIsLoading(true)
        if (!isLoading) {
            try {
                await resetPasswordEmail(values.email)
                updateAuthFlowPage("ResetPassword")
                setEmail(values.email)
            } catch (e) {
                console.log(e)
                toast({
                    title: "Error Signing In",
                    description: (
                        <div className="mt-2 w-full rounded-md bg-slate-950 p-4 text-red-300 font-medium text-sm">
                            An error occurred please try again. If the issue persists, please wait a moment before attempt again. If the issue persists, please contact us here.
                        </div>
                    ),
                })
                setIsLoading(false)
            }
        }
    }


    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-sm'>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your email"
                                        {...field}
                                        type="email"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='w-full pt-4'>
                        <Button
                            disabled={isLoading || (countdown > 0)}
                            type="submit" variant='default' className='w-full'>
                            {isLoading && (
                                <div className='mr-2 h-5 w-5 animate-spin'>
                                    <LoadingSVG />
                                </div>
                            )}
                            Send Code
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}