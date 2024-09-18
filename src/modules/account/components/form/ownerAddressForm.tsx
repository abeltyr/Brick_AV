"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/modules/ui/button"
import LoadingSVG from '@/assets/icons/loading'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, } from "react-hook-form"
import { z } from "zod"
import { Form, } from "@/modules/ui/form"
import { useToast } from "@/modules/ui/use-toast"
import { GeneralAddressForm, } from '@/modules/common/components/form'
import { addressSchema } from '@/lib/form/account'
import { useOnboarding } from '@/lib/context/account/onboarding'
import { useProfile } from '@/lib/context/account'
import { useAuth } from '@/lib/context/auth'



interface OnboardingOwnerAddressFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function OnboardingOwnerAddressForm({ className, ...props }: OnboardingOwnerAddressFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const { toast } = useToast()

    const { session } = useAuth();
    const { address, createUser } = useOnboarding();
    const { setProfile } = useProfile();


    const form = useForm<z.infer<typeof addressSchema>>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            ...address
        },
    })


    const onSubmit = async (values: z.infer<typeof addressSchema>) => {

        if (!isLoading) {
            setIsLoading(true)
            try {

                if (session && session.user && session?.user.id) {
                    const profileData = await createUser({ userId: session.user.id, ownerAddressData: values });
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
                    <GeneralAddressForm form={form} />
                    <div className='pt-4'>
                        <Button
                            disabled={isLoading}
                            type="submit" variant='default'>
                            {isLoading && (
                                <div className='mr-2 h-5 w-5 animate-spin'>
                                    <LoadingSVG />
                                </div>
                            )}
                            Get Started
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
