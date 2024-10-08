"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/modules/ui/button"
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
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/modules/ui/input-otp'



const emailVerificationSchema = z.object({
    token: z.string().min(6, {
        message: "Your Verification token must have at least 6 characters.",
    }),
})


interface UserEmailVerificationFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function UserEmailVerificationForm({ className, ...props }: UserEmailVerificationFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const { toast } = useToast()
    const { email, verifyEmail } = useAuthFlow()


    const form = useForm<z.infer<typeof emailVerificationSchema>>({
        resolver: zodResolver(emailVerificationSchema),
        defaultValues: {
        },
    })



    const onSubmit = async (values: z.infer<typeof emailVerificationSchema>) => {
        setIsLoading(true)
        if (!isLoading) {
            try {
                if (email) {
                    await verifyEmail({
                        email: email,
                        token: values.token
                    });
                    window.location.reload();
                }
            } catch (e) {
                console.log(e)
                toast({
                    title: "Error Verifying Code",
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
                        name="token"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <InputOTP maxLength={6} {...field} className='flex gap-x-4 w-full h-14 justify-end'>
                                        <InputOTPGroup className='flex-1 flex justify-center'>
                                            <InputOTPSlot index={0} className='w-full h-12 px-4 py-2 border-transparent rounded-md bg-neutral-25 ring-0 text-2xl' />
                                        </InputOTPGroup>
                                        <InputOTPGroup className='flex-1 flex justify-center'>
                                            <InputOTPSlot index={1} className='w-full h-12 px-4 py-2 border-transparent rounded-md bg-neutral-25 ring-0 text-2xl outline-none' />
                                        </InputOTPGroup>
                                        <InputOTPGroup className='flex-1 flex justify-center'>
                                            <InputOTPSlot index={2} className='w-full h-12 px-4 py-2 border-transparent rounded-md bg-neutral-25 ring-0 text-2xl outline-none' />
                                        </InputOTPGroup>
                                        <InputOTPGroup className='flex-1 flex justify-center'>
                                            <InputOTPSlot index={3} className='w-full h-12 px-4 py-2 border-transparent rounded-md bg-neutral-25 ring-0 text-2xl outline-none' />
                                        </InputOTPGroup>
                                        <InputOTPGroup className='flex-1 flex justify-center'>
                                            <InputOTPSlot index={4} className='w-full h-12 px-4 py-2 border-transparent rounded-md bg-neutral-25 ring-0 text-2xl outline-none' />
                                        </InputOTPGroup>
                                        <InputOTPGroup className='flex-1 flex justify-center'>
                                            <InputOTPSlot index={5} className='w-full h-12 px-4 py-2 border-transparent rounded-md bg-neutral-25 ring-0 text-2xl outline-none' />
                                        </InputOTPGroup>
                                    </InputOTP>
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
                            Verify email
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}