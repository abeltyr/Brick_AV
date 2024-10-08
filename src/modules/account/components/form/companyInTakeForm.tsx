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
import { GeneralCompanyIntakeForm } from '@/modules/common/components/form'
import { companyInTakeSchema } from '@/lib/form/account'
import { useOnboarding } from '@/lib/context/account/onboarding'

import { useState } from 'react'

import { BusinessType } from '@/types/business'
import { BusinessDetailModal } from '../../../business/components/businessDetailModal'



interface OnboardingCompanyInTakeFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function OnboardingCompanyInTakeForm({ className, ...props }: OnboardingCompanyInTakeFormProps) {

    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const { business, setCompanyIntake, companyIntake, setOnBoardingSubSet, fetchBusiness, setOnBoardingId } = useOnboarding();

    const { toast } = useToast()

    const [isOpen, setIsOpen] = useState(false)
    const [businessFetched, setBusinessFetched] = useState<BusinessType | null>(business)

    const handleClose = () => setIsOpen(false)
    const handleContinue = () => {
        console.log('Continuing...')
        setIsOpen(false)
        setOnBoardingSubSet(1)
    }

    const form = useForm<z.infer<typeof companyInTakeSchema>>({
        resolver: zodResolver(companyInTakeSchema),
        defaultValues: {
            ...companyIntake
        },
    })



    const onSubmit = async (values: z.infer<typeof companyInTakeSchema>) => {
        if (!isLoading) {
            setIsLoading(true)
            try {
                setCompanyIntake(values)
                if (business && business.tin === values.tin) {
                    setBusinessFetched(business);
                    setIsOpen(true)
                    setIsLoading(false)
                } else {
                    const businessData = await fetchBusiness(values.tin)
                    setBusinessFetched(businessData);
                    setIsOpen(true)
                    setIsLoading(false)
                }

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
                    <GeneralCompanyIntakeForm form={form} title='Company Name' readOnlyValues={[]} />
                    <div className=' pt-4'>
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
            <BusinessDetailModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                handleClose={handleClose}
                handleContinue={handleContinue}
                businessFetched={businessFetched}
            />
        </div>
    )
}



// const businessDetail = {
//     tin: '0090866119',
//     email: 'acme@gmail.com',
//     website: 'acme@gmail.com',
//     email2: 'acme.com',
//     legalCondition: 'Public Enterprise',
//     registrationNumber: 'MT/AA/5/006147584',
//     registrationDate: '2/1/12',
//     businessName: 'acme.com',
//     capital: 'ETB 100,000,000,000',
// }

// const businessList = [
//     {
//         tradeName: 'ETHIO TELECOM S C',
//         sections: 'Fixed property subletting/ renting activities',
//         licenseNo: 'MT/AA/14/669/3872789/2014',
//         valid: '7/7/2023 - 7/7/2024',
//     },
//     {
//         tradeName: 'eBay',
//         sections: '18/09/2016 E.C.',
//         licenseNo: '18/09/2016 E.C.',
//         valid: '7/7/2023 - 7/7/2024',
//     },
// ]
