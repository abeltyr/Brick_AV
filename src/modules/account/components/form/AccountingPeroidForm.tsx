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
import { useOnboarding } from '@/lib/context/account/onboarding'
import { useProfile } from '@/lib/context/account'
import { useAuth } from '@/lib/context/auth'



interface OnboardingAccountingPeriodFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function OnboardingAccountingPeriodForm({ className, ...props }: OnboardingAccountingPeriodFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const { session } = useAuth();
    const { toast } = useToast()

    const { ownerProfile, owner, setOwner, setOwnerProfile, setOnBoardingSubSet, createUser } = useOnboarding()
    const { setProfile } = useProfile();

    const form = useForm<z.infer<typeof ownerSchema>>({
        resolver: zodResolver(ownerSchema),
        defaultValues: {
            role: "owner",
            ...owner
        },
    })


    const profileForm = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            ...ownerProfile
        },
    })


    const onSubmit = async (values: z.infer<typeof ownerSchema>) => {
        if (values.role === "owner") {
            if (!isLoading) {
                setIsLoading(true)
                try {
                    if (session && session.user && session?.user.id) {
                        const profileData = await createUser({ userId: session.user.id });
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
        else {
            setOwner({ ...values })
        }
    }

    const profileOnSubmit = async (values: z.infer<typeof profileSchema>) => {
        try {
            setOwnerProfile({ ...values })
            setOnBoardingSubSet(1)
        } catch (e) {
        }

    }

    const watchedRole = useWatch({
        control: form.control,
        name: "role",
    });


    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <Form {...form}>
                <form className="space-y-2 w-full">
                    <GeneralRoleForm form={form} watchedRole={watchedRole} />
                    {watchedRole === "owner" && <div className=' pt-4'>
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                form.handleSubmit(onSubmit)();
                            }}
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
                    <form className="space-y-2 w-full">

                        <GeneralProfileForm form={profileForm} />
                        <div className='w-full pt-4'>
                            <Button
                                onClick={(e) => {
                                    e.preventDefault();
                                    form.handleSubmit(onSubmit)();
                                    profileForm.handleSubmit(profileOnSubmit)();
                                }}
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
