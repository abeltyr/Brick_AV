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
} from "@/modules/ui/form"
import { useToast } from "@/modules/ui/use-toast"
import { useAuth, useAuthFlow } from '@/lib/context/auth'
import { profileSchema } from '@/lib/form/account/profile'
import { GeneralProfileForm } from '@/modules/common/components/form'
import { useOnboarding } from '@/lib/context/account/onboarding'



interface OnboardingProfileFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function OnboardingProfileForm({ className, ...props }: OnboardingProfileFormProps) {

    const { session } = useAuth()

    const { setProfile, profile, setOnBoardingSubSet } = useOnboarding();


    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            gender: "male",
            ...profile,
            email: session && session.user && session.user.email ? session.user.email : '',
            fullName: session && session.user && session.user.user_metadata ? session.user.user_metadata.name : '',
        },
    })


    const onSubmit = async (values: z.infer<typeof profileSchema>) => {
        try {
            setProfile(values)
            setOnBoardingSubSet(1);
        } catch (e) {
            console.log(e)
        }
    }


    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
                    <GeneralProfileForm form={form}
                        readOnlyValues={["email"]}
                    />
                    <div className='pt-4'>
                        <Button
                            type="submit" variant='default'>
                            Continue
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
