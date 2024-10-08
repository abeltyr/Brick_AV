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
import { GeneralAddressForm } from '@/modules/common/components/form'
import { addressSchema } from '@/lib/form/account'
import { useOnboarding } from '@/lib/context/account/onboarding'



interface OnboardingAddressFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function OnboardingAddressForm({ className, ...props }: OnboardingAddressFormProps) {


    const { setAddress, address, setOnBoardingSubSet, setOnBoardingId } = useOnboarding();

    const form = useForm<z.infer<typeof addressSchema>>({
        resolver: zodResolver(addressSchema),
        defaultValues: { ...address },
    })



    const onSubmit = async (values: z.infer<typeof addressSchema>) => {

        try {
            setOnBoardingId(1)
            setAddress(values)
            setOnBoardingSubSet(0)
        } catch (e) {
            console.log(e)
        }
    }


    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
                    <GeneralAddressForm form={form} />
                    <div className='pt-4'>
                        <Button
                            type="submit" variant='default' >
                            Continue
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
