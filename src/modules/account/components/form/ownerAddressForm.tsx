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



interface OnboardingOwnerAddressFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function OnboardingOwnerAddressForm({ className, ...props }: OnboardingOwnerAddressFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const { toast } = useToast()

    const form = useForm<z.infer<typeof addressSchema>>({
        resolver: zodResolver(addressSchema),
        defaultValues: {

        },
    })


    const onSubmit = async (values: z.infer<typeof addressSchema>) => {
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
                            Continue
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
