"use client"

import { AddVendorHeader } from '../components/addVendor/header'
import { Button } from '@/modules/ui/button'
import AddSVG from '@/assets/icons/add'
import { LanguageTranslator } from '@/modules/language/components'
import LoadingSVG from '@/assets/icons/loading'
import ProfileForm from '../components/addVendor/profile'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import * as SheetPrimitive from "@radix-ui/react-dialog"

import {
    Form,
} from "@/modules/ui/form"
import { useToast } from '@/modules/ui/use-toast'
import { useState } from 'react'
import { useAuth } from '@/lib/context/auth/user'
import { useVendors } from '@/lib/context/vendor'
import AddressForm from '../components/addVendor/address'



const formSchema = z.object({
    tinNumber: z.string().min(10, {
        message: "Please Provide a valid TIN number. ",
    }),
    name: z.string().optional(),
    companyName: z.string().optional(),
    vatNumber: z.string().optional(),
    email: z.string().email({
        message: "Please provided a valid email.",
    }).optional(),
    phoneNumber: z.string().optional(),
    region: z.string().optional(),
    city: z.string().optional(),
    woreda: z.string().optional(),
    houseNumber: z.string().optional(),
    description: z.string().optional(),
})




export const AddVendorSection = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { toast } = useToast()

    const { currentCompany } = useAuth();
    const { createVendor } = useVendors();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tinNumber: "0090866119",
            vatNumber: "0090866119",
            name: "Abel",
            companyName: "Eurka",
            email: "abel@eurka.co",
            phoneNumber: "0911223989",
            region: "Kolfe Kernio",
            city: "",
            woreda: "10",
            houseNumber: "NEw",
            description: "MExico KKcare Building",
        },
    })


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!isLoading) {
            setIsLoading(true)
            try {
                if (currentCompany) {
                    const vendor = await createVendor({
                        ...values,
                        companyId: currentCompany.companyId
                    })
                    /// TODO:Close the side bar
                    // SheetPrimitive.Close;
                }
            } catch (e) {
                console.log(e)
                toast({
                    title: "Error Signing In",
                    description: (
                        <div className="mt-2 w-full rounded-md bg-slate-950 p-4 text-red-300 font-medium text-sm">
                            An error occurred during the sign-up process. Please try again. If the issue persists, please wait a moment before attempting to sign up again.
                        </div>
                    ),
                })
            }
            setIsLoading(false)
        }
    }

    return (
        <div className='w-full h-full overflow-y-auto'>
            <AddVendorHeader />
            <div className='h-20' />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
                    <div className='flex flex-col p-4 pb-20 flex-1 relative w-full h-full  gap-6'>
                        <ProfileForm form={form} />
                        <AddressForm form={form} />
                    </div>
                    <div className='left-0 right-0 px-6 bottom-0 py-3 absolute flex justify-end gap-6 bg-background/90'>

                        <SheetPrimitive.Close className="rounded-full transition-colors text-foreground/70 duration-300 hover:text-foreground">
                            <Button className='flex gap-2 p-x4 py-2'
                                variant={"secondary"}
                            >
                                <AddSVG />
                                <LanguageTranslator>
                                    Cancel
                                </LanguageTranslator>
                            </Button>
                        </SheetPrimitive.Close>

                        <Button
                            disabled={isLoading}
                            className='flex gap-2 p-x4 py-2'
                            onClick={() => {

                            }}
                        >
                            {isLoading ? (
                                <div className='h-5 w-5 animate-spin'>
                                    <LoadingSVG />
                                </div>
                            ) : <AddSVG />}


                            {isLoading ? (
                                <LanguageTranslator>
                                    Creating
                                </LanguageTranslator>
                            ) : <LanguageTranslator>
                                Create
                            </LanguageTranslator>}


                        </Button>
                    </div>
                </form>
            </Form>
        </div>


    )
}
