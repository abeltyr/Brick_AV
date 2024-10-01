
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
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/modules/ui/collapsible"




export default function ChartOfAccountListSection() {


    return (
        <Collapsible>
            <div>
                <div className='w-full flex flex-col justify-start items-start gap-8'>
                    <div className='flex flex-col'>
                        <CardTitle className='text-2xl font-bold'>
                            <LanguageTranslator>
                                Select a vendor
                            </LanguageTranslator>
                        </CardTitle>
                        <CardDescription className='text-base font-light text-[#71717A]'>
                            <LanguageTranslator>
                                Select A vendor or create a vendor
                            </LanguageTranslator>
                        </CardDescription>
                    </div>
                    <SheetTrigger asChild>
                        <Button variant={"secondary"} className='w-full text-sm font-medium'>
                            Select a vendor
                        </Button>
                    </SheetTrigger>
                </div>
            </div>
        </Collapsible>
    )
}
