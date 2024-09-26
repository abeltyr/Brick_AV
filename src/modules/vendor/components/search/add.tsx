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
import { vendorSchema } from '@/lib/form/vendor'
import ProfileForm from '@/modules/vendor/components/addForm/profile'
import AddressForm from '@/modules/vendor/components/addForm/address'
import { VendorType } from '@/types/vendor'
import { useCompany } from '@/lib/context/account'


export const DrawerAddVendorSection = ({
    setIsAddingVendor, updateVendor
}: {
    setIsAddingVendor: (value: boolean) => void
    updateVendor: (vendor: VendorType) => void
}) => {

    const { setPurchaseVendorListingDrawer } = useDrawerManager();
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { toast } = useToast()

    const { currentCompany } = useCompany();
    const { createVendor } = useVendors();
    const form = useForm<z.infer<typeof vendorSchema>>({
        resolver: zodResolver(vendorSchema),
        defaultValues: {
        },
    })

    const onSubmit = async (values: z.infer<typeof vendorSchema>) => {
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
                            An error occurred please try again. If the issue persists, please wait a moment before attempt again. If the issue persists, please contact us here.
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
