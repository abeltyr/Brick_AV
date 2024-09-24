"use client"

import AddSVG from '@/assets/icons/add'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/modules/ui/form"
import { useToast } from '@/modules/ui/use-toast'
import { useState } from 'react'
import { useVendors } from '@/lib/context/vendor'
import { DrawerSheetHeader } from '@/modules/common/components/drawer/header'
import { DrawerSheetFooter } from '@/modules/common/components/drawer/footer'
import { useDrawerManager } from '@/lib/context/drawer/drawer'
import { useCompany } from '@/lib/context/account'
import { GeneralProfileForm } from '@/modules/common/components/form'
import { profileSchema } from '@/lib/form/account'
import { GeneralVendorDetailForm } from '@/modules/common/components/form/generalVendorForm'
import { vendorSchema } from '@/lib/form/vendor'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/modules/ui/card'
import { LanguageTranslator } from '@/modules/language/components'


export const AddVendorSection = () => {

    const { setAddVendorDrawer } = useDrawerManager();
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { toast } = useToast()

    const { currentCompany } = useCompany();
    const { createVendor } = useVendors();
    const form = useForm<z.infer<typeof vendorSchema>>({
        resolver: zodResolver(vendorSchema),
        defaultValues: {
            isRegistered: "yes"
        },
    })


    const onSubmit = async (values: z.infer<typeof vendorSchema>) => {
        console.log("values", values)
        // if (!isLoading) {
        //     setIsLoading(true)
        //     try {
        //         if (currentCompany) {
        //             const vendor = await createVendor({
        //                 ...values,
        //                 companyId: currentCompany.companyId
        //             })
        //             setAddVendorDrawer(false);
        //             toast({
        //                 title: "Vendor Created",
        //                 description: (
        //                     <div className="mt-2 w-full rounded-md p-4 bg-green-300 text-foreground font-medium text-sm">
        //                         New Vendor has been added to your company data set.
        //                     </div>
        //                 ),
        //             })
        //         }
        //     } catch (e) {
        //         console.log(e)
        //         toast({
        //             title: "Error Signing In",
        //             description: (
        //                 <div className="mt-2 w-full rounded-md bg-slate-950 p-4 text-red-300 font-medium text-sm">
        //                     An error occurred please try again. If the issue persists, please wait a moment before attempt again. If the issue persists, please contact us here.
        //                 </div>
        //             ),
        //         })
        //     }
        //     setIsLoading(false)
        // }
    }


    return (
        <div className='w-full h-full overflow-y-auto'>
            <DrawerSheetHeader title={"Add Vendor"} description='Provided the vendor detail, if vendor is registered company the tin number will be used to validate and fetch the vendor detail' />
            <div className='h-32' />
            <Form {...form}>
                <form className="space-y-2 w-full">
                    <div className='flex flex-col p-4 pb-20 flex-1 relative w-full h-full px-8 gap-6'>

                        <GeneralVendorDetailForm form={form} />


                    </div>
                    <DrawerSheetFooter
                        isLoading={isLoading}
                        createSVG={<AddSVG />}
                        closeFunction={() => {
                            setAddVendorDrawer(false);
                        }}
                        createFunction={() => {
                            form.handleSubmit(onSubmit)();
                        }}
                    />
                </form>
            </Form>
        </div>


    )
}
