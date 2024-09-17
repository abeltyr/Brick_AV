"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/modules/ui/button"
import LoadingSVG from '@/assets/icons/loading'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import {
    Form,
} from "@/modules/ui/form"
import { useToast } from "@/modules/ui/use-toast"
import { GeneralProfileForm, GeneralRoleForm } from '@/modules/common/components/form'
import { ownerSchema, profileSchema } from '@/lib/form/account'



interface OnboardingOwnerFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function OnboardingOwnerForm({ className, ...props }: OnboardingOwnerFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const { toast } = useToast()

    const form = useForm<z.infer<typeof ownerSchema>>({
        resolver: zodResolver(ownerSchema),
        defaultValues: {
            role: "owner"
        },
    })


    const profileForm = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {

        },
    })


    const onSubmit = async (values: z.infer<typeof ownerSchema>) => {
        setIsLoading(true)
        if (!isLoading) {
            try {

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

    const profileOnSubmit = async (values: z.infer<typeof profileSchema>) => {
        setIsLoading(true)
        if (!isLoading) {
            try {

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

    const watchedRole = useWatch({
        control: form.control,
        name: "role",
    });


    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
                    <GeneralRoleForm form={form} watchedRole={watchedRole} />
                    {watchedRole === "owner" && <div className=' pt-4'>
                        <Button
                            disabled={isLoading}
                            type="submit" variant='default' >
                            {isLoading && (
                                <div className='mr-2 h-5 w-5 animate-spin'>
                                    <LoadingSVG />
                                </div>
                            )}
                            Get Started
                        </Button>
                    </div>}
                </form>
            </Form>
            {watchedRole != "owner" &&

                <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(profileOnSubmit)} className="space-y-2 w-full">

                        <GeneralProfileForm form={profileForm} />
                        <div className='w-full pt-4'>
                            <Button
                                disabled={isLoading}
                                type="submit" variant='default' className='w-full'>
                                {isLoading && (
                                    <div className='mr-2 h-5 w-5 animate-spin'>
                                        <LoadingSVG />
                                    </div>
                                )}
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>

            }
        </div>
    )
}
