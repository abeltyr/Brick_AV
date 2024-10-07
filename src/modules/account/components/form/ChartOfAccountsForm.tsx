"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
} from "@/modules/ui/form"
import yearSchema from '@/lib/form/account/accountPeriod'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { useOnboarding } from '@/lib/context/account/onboarding'
import { useToast } from '@/modules/ui/use-toast'
import { useAuth } from '@/lib/context/auth'
import { useProfile } from '@/lib/context/account'
import { chartOfAccountsSchema } from '@/lib/form/account/chartOfAccount'


interface OnboardingChartOfAccountFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function OnboardingChartOfAccountForm({ className, ...props }: OnboardingChartOfAccountFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const { toast } = useToast()

    const { session } = useAuth();
    const { address, createUser } = useOnboarding();
    const { setProfile } = useProfile();


    const form = useForm<z.infer<typeof chartOfAccountsSchema>>({
        resolver: zodResolver(yearSchema),
        defaultValues: {
        },
    })


    const { fields, remove, update, insert, } = useFieldArray({
        control: form.control,
        name: "accounts",
    });





    const onSubmit = async (values: z.infer<typeof chartOfAccountsSchema>) => {
        if (!isLoading) {
            setIsLoading(true)
            try {

                if (session && session.user && session?.user.id) {
                    const profileData = await createUser({ userId: session.user.id, chartOfAccounts: values });
                    if (profileData)
                        setProfile(profileData)
                }
                setIsLoading(false)
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
                <div className='flex w-full gap-10'>

                </div>
            </Form>
        </div>
    )
}
