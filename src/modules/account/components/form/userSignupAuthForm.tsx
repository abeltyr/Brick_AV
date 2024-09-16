"use client"

import * as React from "react"

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



const signupSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
})


interface UserSignupAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function UserSignupAuthForm({ className, ...props }: UserSignupAuthFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const { toast } = useToast()
    const { updateAuthFlowPage, signup, setEmail, countdown, email } = useAuthFlow()


    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: email ? email : '',
        },
    })



    const onSubmit = async (values: z.infer<typeof signupSchema>) => {
        setIsLoading(true)
        if (!isLoading) {
            try {
                await signup({
                    fullName: values.fullName,
                    email: values.email,
                    password: values.password
                });
                updateAuthFlowPage("VerifyEmail")
                setEmail(values.email)
            } catch (e) {
                console.log(e)
                toast({
                    title: "Error Signing up",
                    description: (
                        <div className="mt-2 w-full rounded-md bg-slate-950 p-4 text-red-300 font-medium text-sm">
                            An error occurred please try again. If the issue persists, please wait a moment before attempt again. If the issue still persists, please contact us here.
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
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-sm'>Full name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your full name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                    <div className='w-full pt-4'>
                        <Button
                            disabled={isLoading || (countdown > 0)}
                            type="submit" variant='default' className='w-full'>
                            {isLoading && (
                                <div className='mr-2 h-5 w-5 animate-spin'>
                                    <LoadingSVG />
                                </div>
                            )}
                            Sign Up
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}