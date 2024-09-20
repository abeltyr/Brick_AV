"use client"


import { cn, COUNTDOWN_DURATION } from "@/lib/utils"
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
import { useToast } from "@/modules/ui/use-toast"
import { useAuthFlow } from '@/lib/context/auth'
import { useState } from 'react'

const resetPasswordSchema = z.object({
    code: z.string().length(6, 'Code must be 6 characters long'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

interface UserResetPasswordFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function UserResetPasswordForm({ className, ...props }: UserResetPasswordFormProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { updateAuthFlowPage, resetPassword, email } = useAuthFlow();
    const { toast } = useToast()

    const form = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {},
    })


    const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
        setIsLoading(true)
        if (!isLoading) {
            try {
                if (email) {
                    await resetPassword({
                        email: email,
                        token: values.code,
                        password: values.password
                    });

                    updateAuthFlowPage("PasswordReset")
                }
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
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-sm'>Code</FormLabel>
                                <FormControl>
                                    <Input
                                        id="code"
                                        placeholder="Enter 6-digit code"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-sm'>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Create a password"
                                        {...field}
                                        type='password'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-sm'>Confirm your password</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Account Password"
                                        {...field}
                                        type='password'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='w-full pt-4'>
                        <Button
                            disabled={isLoading}
                            type="submit" variant='default' className='w-full'>
                            {isLoading && (
                                <div className='mr-2 h-5 w-5 animate-spin'>
                                    <LoadingSVG />
                                </div>
                            )}
                            Change Password
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}