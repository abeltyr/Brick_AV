"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/modules/ui/button"
import { Input } from "@/modules/ui/input"
import { Label } from "@/modules/ui/label"
import LoadingSVG from '@/assets/icons/loading'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/modules/ui/form"
import { useAuth } from '@/lib/context/auth'
import { useToast } from "@/modules/ui/use-toast"



const formSchema = z.object({
    email: z.string().email({
        message: "Please provided a valid email.",
    }),
    password: z.string().min(8, {
        message: "Password must have at least 8 characters.",
    }),
})


interface UserLoginAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function UserLoginAuthForm({ className, ...props }: UserLoginAuthFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const { login, session } = useAuth();
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        },
    })



    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        if (!isLoading) {
            try {
                await login({
                    email: values.email,
                    password: values.password
                });
            } catch (e) {
                console.log(e)
                toast({
                    title: "Error Signing In",
                    description: (
                        <div className="mt-2 w-full rounded-md bg-slate-950 p-4 text-red-300 font-medium text-sm">
                            An error occurred during the sign-up process. Please try again. If the issue persists, please wait a moment before attempting to sign up again.
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
                                    <Input placeholder="email@gmail.com" {...field} type="email" className='px-4 py-3 focus:ring-0 focus:outline-none focus:border-0
                      ring-0 text-sm font-light placeholder:text-neutral-400' />
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
                                    <Input placeholder="***" {...field} type='password' className='px-4 py-3 focus:ring-0 focus:outline-none focus:border-0
                      ring-0 text-sm font-light placeholder:text-neutral-400' />
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
                            Sign In
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}