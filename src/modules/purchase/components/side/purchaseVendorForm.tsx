
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
import { SearchVendorSection } from '@/modules/vendor/templates/search'
import { Trash2 } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/modules/ui/avatar'
import { Label } from '@/modules/ui/label'
import { Input } from '@/modules/ui/input'
import { useDrawerManager } from '@/lib/context/drawer/drawer'
import { Separator } from '@/modules/ui/separator'
import { useAddPurchases } from '@/lib/context/purchase/addPurchase'
import { Button } from '@/modules/ui/button'


export default function PurchaseVendorForm() {

    const { form, vendor, setVendor } = useAddPurchases()
    const { purchaseVendorListingDrawer, setPurchaseVendorListingDrawer } = useDrawerManager()

    if (!vendor)
        return (
            <Sheet
                modal={purchaseVendorListingDrawer}
                onOpenChange={setPurchaseVendorListingDrawer}
            >
                <div className='w-full flex flex-col'>
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
                        <div>
                            <p className='text-red-600 mt-4  text-sm font-medium'>
                                You need to selector create on vendor
                            </p>
                        </div>
                    }
                </div>
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
                                form!.setValue("vendorId", "")
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
                        <Input value={vendor.business && vendor.business.tin ? vendor.business.tin : "---"} readOnly />
                    </div>
                    <div className="space-y-2 flex-1">
                        <Label htmlFor="vat">VAT Number</Label>
                        <Input value={vendor && vendor.vat ? vendor.vat : "---"} readOnly />
                    </div>
                </CardContent>
            </Card>

        )
}
