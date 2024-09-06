
import { LanguageTranslator } from '@/modules/language/components'
import { Button } from '@/modules/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/modules/ui/card"
import { Sheet, SheetContent, SheetTrigger } from '@/modules/ui/sheet'
import { VendorType } from '@/types/vendor'
import { useEffect, useState } from 'react'
import { useWatch } from 'react-hook-form'
import { VendorListing } from '../../../vendor/components/listing'


export default function PurchaseVendorForm({ form }: { form: any }) {

    const [vendor, setVendor] = useState<VendorType | null>()


    const watchedVendor = useWatch({
        control: form.control,
        name: "vendorId",
    });


    useEffect(() => {

    }, [
        watchedVendor
    ])

    if (!vendor)
        return (
            <>
                <Sheet>
                    <SheetTrigger asChild>
                        <Card className='bg-transparent  border-dashed border-[1px] pt-6'>
                            <CardContent className=''>
                                <div className='w-full flex flex-col gap-2'>
                                    <CardTitle>
                                        <LanguageTranslator>
                                            Select a vendor
                                        </LanguageTranslator>
                                    </CardTitle>
                                    <CardDescription>
                                        <LanguageTranslator>
                                            Select A vendor or create a vendor
                                        </LanguageTranslator>
                                    </CardDescription>
                                    <Button className='w-[200px] mt-3'>
                                        Select
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                    </SheetTrigger>
                    <SheetContent side="right" className="max-w-[400px] min-w-[50%] p-0 flex flex-col h-full ">
                        <VendorListing />
                    </SheetContent>
                </Sheet>

            </>

        )
    else
        return (
            <>
                <Sheet>
                    <SheetTrigger asChild>
                        <Card className='bg-transparent  border-dashed border-[1px] pt-6'>
                            <CardContent className=''>
                                <div className='w-full flex flex-col gap-2'>
                                    <CardTitle>
                                        <LanguageTranslator>
                                            Select a vendor
                                        </LanguageTranslator>
                                    </CardTitle>
                                    <CardDescription>
                                        <LanguageTranslator>
                                            Select A vendor or create a vendor
                                        </LanguageTranslator>
                                    </CardDescription>
                                    <Button className='w-[200px] mt-3'>
                                        Select
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                    </SheetTrigger>
                    <SheetContent side="right" className="max-w-[400px] min-w-[50%] p-0 flex flex-col h-full ">
                        {/* <AddVendorSection /> */}
                    </SheetContent>
                </Sheet>

            </>

        )
}
