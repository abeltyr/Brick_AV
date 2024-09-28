
import { LanguageTranslator } from '@/modules/language/components'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/modules/ui/card"
import { Sheet, SheetContent, SheetTrigger } from '@/modules/ui/sheet'
import { VendorType } from '@/types/vendor'
import { Dispatch, SetStateAction, useState } from 'react'
import { SearchVendorSection } from '@/modules/vendor/templates/search'
import { Trash2 } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/modules/ui/avatar'
import { Label } from '@/modules/ui/label'
import { Input } from '@/modules/ui/input'
import { useDrawerManager } from '@/lib/context/drawer/drawer'
import { purchaseFormSchema } from '@/lib/form/purchase'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { Separator } from '@/modules/ui/separator'


export default function PurchaseVendorForm({ form, setVendor, vendor }: {
    form: UseFormReturn<z.infer<typeof purchaseFormSchema>>,
    vendor: VendorType | null
    setVendor: Dispatch<SetStateAction<VendorType | null>>
}

) {

    const { purchaseVendorListingDrawer, setPurchaseVendorListingDrawer } = useDrawerManager()

    if (!vendor)
        return (
            <>
                <Sheet
                    modal={purchaseVendorListingDrawer}
                    onOpenChange={setPurchaseVendorListingDrawer}
                >
                    <SheetTrigger asChild>
                        <Card className={`${form.formState.errors.vendorId ? "border-red-400" : ""} bg-transparent  border-dashed border-[1px] pt-6 cursor-pointer`}>
                            <CardContent className={`${form.formState.errors.vendorId ? "pb-5" : "pb-5"}`}>
                                <div className='w-full flex justify-between items-center gap-2'>
                                    <div className='flex flex-col gap-2'>
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
                                    </div>
                                    <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2">
                                        Select
                                    </div>
                                </div>
                            </CardContent>
                            {form.formState.errors.vendorId &&
                                <>
                                    <Separator className='p-0 m-0' />
                                    <CardFooter className='my-0 py-0 pb-3'>
                                        <p className='text-red-600 mt-4 text-left'>
                                            You need to selector create on vendor
                                        </p>
                                    </CardFooter>
                                </>
                            }
                        </Card>

                    </SheetTrigger>
                    <SheetContent side="right" className="max-w-[400px] min-w-[50%] p-0 flex flex-col h-full ">
                        <SearchVendorSection
                            updateVendor={(vendor: VendorType) => {
                                if (vendor) {
                                    form.setValue("vendorId", vendor.id)
                                    setVendor(vendor)
                                }
                            }}
                        />
                    </SheetContent>
                </Sheet>

            </>

        )
    else
        return (
            <Card className="w-full ">
                <CardHeader className="relative   ">
                    <div className='w-full justify-center flex text-xl font-black'>
                        Selected a vendor
                    </div>
                    <Separator className='my-3' />
                    <div className='flex justify-between items-center'>

                        <div className="flex items-center space-x-4">
                            <Avatar className="h-20 w-20">
                                {/* <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Profile picture" /> */}
                                <AvatarFallback className='text-3xl'>{vendor.name?.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-2xl font-bold">{vendor.name}</h2>
                                <p className="text-sm text-muted-foreground">{vendor.phoneNumber}</p>
                            </div>
                        </div>
                        <button
                            className="p-3 bg-red-100 rounded-md hover:bg-red-200 hover:scale-105 transition-colors duration-300"
                            aria-label="Remove card"
                            onClick={(e) => {
                                e.preventDefault();
                                form.setValue("vendorId", "")
                                setVendor(null)
                            }}
                        >
                            <Trash2 className="h-5 w-5 text-red-600" />
                        </button>
                    </div>
                </CardHeader>
                <CardContent className=" flex gap-3 justify-between items-center">
                    <div className="space-y-2 flex-1">
                        <Label htmlFor="tin">TIN (Tax Identification Number)</Label>
                        <Input value={vendor.business && vendor.business.tinNumber ? vendor.business.tinNumber : "---"} readOnly />
                    </div>
                    <div className="space-y-2 flex-1">
                        <Label htmlFor="vat">VAT Number</Label>
                        <Input value={vendor && vendor.vat ? vendor.vat : "---"} readOnly />
                    </div>
                </CardContent>
            </Card>

        )
}
