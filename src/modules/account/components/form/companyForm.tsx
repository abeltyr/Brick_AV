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
import { GeneralCompanyForm } from '@/modules/common/components/form'
import { companySchema } from '@/lib/form/account'
import { Card, CardContent } from '@/modules/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/modules/ui/avatar'
import { useOnboarding } from '@/lib/context/account/onboarding'
import { BusinessDetailModal } from '@/modules/business/components/businessDetailModal'
import { Eye } from 'lucide-react'



interface OnboardingCompanyFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function OnboardingCompanyForm({ className, ...props }: OnboardingCompanyFormProps) {
    const { business, company, setCompany, setOnBoardingId, setOnBoardingSubSet } = useOnboarding();

    const form = useForm<z.infer<typeof companySchema>>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            managerName: business && business.managerNameEng ? business.managerNameEng : "",
            companyPhone: business && business.phoneNumber ? business.phoneNumber : "",
            taxType: "VAT",
            ...company
        },
    })


    const onSubmit = async (values: z.infer<typeof companySchema>) => {
        try {
            setCompany(values)
            setOnBoardingId(2)
            setOnBoardingSubSet(0)
        } catch (e) {
        }
    }
    const [isOpen, setIsOpen] = React.useState(false)

    const handleClose = () => setIsOpen(false)
    const handleContinue = () => {
        setIsOpen(false)
    }


    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <BusinessDetailModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                handleClose={handleClose}
                handleContinue={handleContinue}
                businessFetched={business}
                name={business?.businessName ?? ""}
                viewingOnly={true}
            />
            {business && <Card>
                <CardContent className='flex justify-between p-4 items-center '>
                    <div className='flex gap-3 items-center'>
                        <Avatar className="h-12 w-12">
                            <AvatarImage
                                alt={"company logo"}
                            />
                            <AvatarFallback>{business.businessName?.slice(0, 2)?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <p className='text-base font-semibold text-foreground'>
                            {business.businessName}
                        </p>
                    </div>
                    <Button
                        className='flex gap-2'
                        variant={"secondary"}
                        onClick={(e) => {
                            setIsOpen(true)
                        }}
                    >
                        <Eye className='w-4 h-4' />
                        View Business Detail
                    </Button>
                </CardContent>
            </Card>}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
                    <GeneralCompanyForm form={form} title='Manager Name' />
                    <div className='pt-4'>
                        <Button
                            // disabled={isLoading}
                            type="submit" variant='default' >
                            Continue
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
