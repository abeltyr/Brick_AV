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
import { GeneralCompanyForm } from '@/modules/common/components/form'
import { companySchema } from '@/lib/form/account'
import { Card, CardContent } from '@/modules/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/modules/ui/avatar'



interface OnboardingCompanyFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function OnboardingCompanyForm({ className, ...props }: OnboardingCompanyFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const { toast } = useToast()

    const form = useForm<z.infer<typeof companySchema>>({
        resolver: zodResolver(companySchema),
        defaultValues: {

        },
    })



    const onSubmit = async (values: z.infer<typeof companySchema>) => {
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
            <Card>
                <CardContent className='flex justify-between p-4 items-center '>
                    <div className='flex gap-3 items-center'>
                        <Avatar className="h-12 w-12">
                            <AvatarImage
                                src={`images/companyLogo.webp`}
                                alt={"company logo"}
                            // className="grayscale"
                            />
                            <AvatarFallback>{"SC"}</AvatarFallback>
                        </Avatar>
                        <p className='text-base font-semibold text-foreground'>
                            ETHIO TELECOM S C
                        </p>
                    </div>
                    <Button variant={"secondary"}>
                        View Company Detail
                    </Button>
                </CardContent>
            </Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
                    <GeneralCompanyForm form={form} title='Manager Name' />
                    <div className='pt-4'>
                        <Button
                            disabled={isLoading}
                            type="submit" variant='default' >
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
