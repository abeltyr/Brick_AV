"use client"

import AddSVG from '@/assets/icons/add'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/modules/ui/form"
import { useToast } from '@/modules/ui/use-toast'
import { useState } from 'react'
import { useAuth } from '@/lib/context/auth/user'
import { useVendors } from '@/lib/context/vendor'
import { DrawerSheetFooter } from '@/modules/common/components/drawer/footer'
import { useDrawerManager } from '@/lib/context/drawer/drawer'
import { vendorFormSchema } from '@/lib/form/vendor'
import ProfileForm from '../addVendor/profile'
import AddressForm from '../addVendor/address'
import { VendorType } from '@/types/vendor'


export const DrawerAddVendorSection = ({
    setIsAddingVendor, updateVendor
}: {
    setIsAddingVendor: (value: boolean) => void
    updateVendor: (vendor: VendorType) => void
}) => {

    const { setPurchaseVendorListingDrawer } = useDrawerManager();
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { toast } = useToast()

    const { currentCompany } = useAuth();
    const { createVendor } = useVendors();
    const form = useForm<z.infer<typeof vendorFormSchema>>({
        resolver: zodResolver(vendorFormSchema),
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

    const onSubmit = async (values: z.infer<typeof vendorFormSchema>) => {
        if (!isLoading) {
            setIsLoading(true)
            try {
                if (currentCompany) {
                    const vendor = await createVendor({
                        ...values,
                        companyId: currentCompany.companyId
                    })
                    if (vendor)
                        updateVendor(vendor);

                    setPurchaseVendorListingDrawer(false);
                    toast({
                        title: "Vendor Created",
                        description: (
                            <div className="mt-2 w-full rounded-md p-4 bg-green-300 text-foreground font-medium text-sm">
                                New Vendor has been added to your company data set.
                            </div>
                        ),
                    })
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
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full h-full relative pb-20" >
                <div className='flex flex-col pb-20 flex-1 relative w-full h-full gap-6 overflow-y-auto p-6'>
                    <ProfileForm form={form} />
                    <AddressForm form={form} />
                </div>

                <DrawerSheetFooter
                    isLoading={isLoading}
                    createSVG={<AddSVG />}
                    closeFunction={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                        event.preventDefault();
                        setIsAddingVendor(false)
                    }}
                />
            </form>
        </Form>


    )
}
