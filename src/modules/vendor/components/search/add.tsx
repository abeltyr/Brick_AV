"use client"

import AddSVG from '@/assets/icons/add'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/modules/ui/form"
import { useToast } from '@/modules/ui/use-toast'
import { useState } from 'react'
import { useVendors } from '@/lib/context/vendor'
import { DrawerSheetFooter } from '@/modules/common/components/drawer/footer'
import { useDrawerManager } from '@/lib/context/drawer/drawer'
import { vendorSchema } from '@/lib/form/vendor'
import { VendorType } from '@/types/vendor'
import { useCompany } from '@/lib/context/account'
import { GeneralVendorDetailForm } from '@/modules/common/components/form/generalVendorForm'


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
    const { createVendor, setBusiness } = useVendors();
    const form = useForm<z.infer<typeof vendorSchema>>({
        resolver: zodResolver(vendorSchema),
        defaultValues: {
            isRegistered: "yes"
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
                    setBusiness(null)
                }
            } catch (error: any) {
                console.log("message", error.message)
                if (error.message.includes('Unique constraint failed')) {
                    toast({
                        title: "Error: Vendor Already exist",
                        description: (
                            <div className="mt-2 w-full rounded-md bg-slate-950 p-4 text-red-200 font-medium text-sm">
                                {"There's already a record with the same Tin. Please check your tin input or check a your vendor list."}
                            </div>
                        ),
                    });
                } else {
                    toast({
                        title: "Error creating vendor",
                        description: (
                            <div className="mt-2 w-full rounded-md bg-slate-950 p-4 text-red-300 font-medium text-sm">
                                An error occurred. Please try again. If the issue persists, please contact us here.
                            </div>
                        ),
                    });
                }
            }
            setIsLoading(false)
        }
    }


    return (
        <Form {...form}>
            <div className="space-y-2 w-full h-full relative pb-20" >
                <div className='flex flex-col p-4 pb-20 flex-1 relative w-full h-full px-8 gap-6'>
                    <GeneralVendorDetailForm form={form} />
                </div>

                <DrawerSheetFooter
                    isLoading={isLoading}
                    createSVG={<AddSVG />}
                    closeFunction={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                        event.preventDefault();
                        setIsAddingVendor(false)
                    }}
                    createFunction={() => {
                        form.handleSubmit(onSubmit)()
                    }}
                />
            </div>
        </Form>


    )
}
