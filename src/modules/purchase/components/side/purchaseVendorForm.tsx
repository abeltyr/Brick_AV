
import { LanguageTranslator } from '@/modules/language/components'
import {
    CardDescription,
    CardTitle,
} from "@/modules/ui/card"
import { Sheet, SheetContent, SheetTrigger } from '@/modules/ui/sheet'
import { VendorType } from '@/types/vendor'
import { SearchVendorSection } from '@/modules/vendor/templates/search'
import { Avatar, AvatarFallback } from '@/modules/ui/avatar'
import { useDrawerManager } from '@/lib/context/drawer/drawer'
import { useAddPurchases } from '@/lib/context/purchase/addPurchase'
import { Button } from '@/modules/ui/button'
import { Badge } from '@/modules/ui/badge'
import { BusinessDetailModal } from '@/modules/business/components/businessDetailModal'
import { useState } from 'react'
import { ErrorMessage } from '@/modules/common/components/errorMessage'


export default function PurchaseVendorForm() {

    const { form, vendor, setVendor } = useAddPurchases()
    const { purchaseVendorListingDrawer, setPurchaseVendorListingDrawer } = useDrawerManager()



    const [isOpen, setIsOpen] = useState(false)
    // const [business, setBusinessFetched] = useState<BusinessType | null>(business)

    const handleClose = () => {
        setIsOpen(false)
    }
    const handleContinue = () => {
        setIsOpen(false)
    }

    return (
        <Sheet
            modal={purchaseVendorListingDrawer}
            onOpenChange={setPurchaseVendorListingDrawer}
            open={purchaseVendorListingDrawer}
        >
            {vendor ? <div className='flex flex-col  mt-6'>
                <div className='w-full flex text-2xl font-bold'>
                    Selected a vendor
                </div>
                <div className='flex flex-col gap-6 mt-8'>
                    <div className="flex items-center gap-x-4">
                        <Avatar className="h-16 w-16">
                            <AvatarFallback className='text-2xl text-[#71717A]'>{vendor.name?.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                            {vendor.business ?
                                <div>
                                    {vendor.business.managerNameEng && <h2 className="text-xl font-bold">{vendor.business.managerNameEng}</h2>}
                                    {vendor.business.businessName &&
                                        vendor.business.businessName != vendor.business.managerNameEng &&
                                        <p className="text-sm text-[#6D6D6D]">{vendor.business?.businessName}</p>}
                                </div> :
                                <div>
                                    <h2 className="text-xl font-bold">{vendor.name}</h2>
                                </div>
                            }
                        </div>
                    </div>
                    {vendor.business ? <div className='flex flex-col gap-2'>

                        <div className="flex text-sm gap-1">
                            <span className='font-medium'>Tin: </span>
                            <span className=' text-[#747474]'>
                                {vendor.business.tin}
                            </span>
                        </div>
                        {vendor.vat && <div className="flex text-sm gap-1">
                            <span className='font-medium'>Vat: </span>
                            <span className=' text-[#747474]'>
                                {vendor.vat}
                            </span>
                        </div>
                        }
                        {vendor.taxType === "VAT" && <div>
                            <Badge className='hover:bg-primary'>
                                Vat Registered
                            </Badge>
                        </div>}
                    </div> : <div>
                    </div>}
                    <div className='flex gap-3'>

                        <SheetTrigger asChild className='flex-1'>
                            <Button variant={"secondary"}
                                onClick={() => {
                                    // form!.setValue("vendorId", "")
                                    // setVendor(null)
                                }}
                            >
                                Change Vendor
                            </Button>
                        </SheetTrigger>

                        {vendor.business && <Button
                            className='flex-1'
                            variant={"secondary"}
                            onClick={() => {
                                setIsOpen(true)
                            }}
                        >
                            View vendor detail
                        </Button>}
                    </div>

                    {vendor.business && <BusinessDetailModal
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        handleClose={handleClose}
                        handleContinue={handleContinue}
                        businessFetched={vendor.business}
                        viewingOnly={true}
                        name={vendor.business?.businessName ?? ""}
                    />}
                </div>

            </div> :
                <div className='w-full flex flex-col mt-8'>
                    <div className='w-full flex flex-col justify-start gap-8'>
                        <div className='flex flex-col'>
                            <CardTitle className='text-2xl font-bold'>
                                <LanguageTranslator>
                                    Select a vendor
                                </LanguageTranslator>
                            </CardTitle>
                            <CardDescription className='text-sm font-light'>
                                <LanguageTranslator>
                                    Select A vendor or create a vendor
                                </LanguageTranslator>
                            </CardDescription>
                        </div>
                        <SheetTrigger asChild>
                            <Button className='w-full text-sm font-medium' variant={"secondary"} >Select Vendor</Button>
                        </SheetTrigger>
                    </div>
                    {form!.formState.errors.vendorId &&
                        <ErrorMessage message='You need to select or create a vendor' />
                    }
                </div>}
            <SheetContent side="right" className="max-w-[400px] min-w-[50%] p-0 flex flex-col h-full ">
                <SearchVendorSection
                    updateVendor={(vendor: VendorType) => {
                        if (vendor) {
                            form!.setValue("vendorId", vendor.id)
                            setVendor(vendor)
                        }
                    }}
                />
            </SheetContent>
        </Sheet>
    )
}
