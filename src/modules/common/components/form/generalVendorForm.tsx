import React, { useEffect, useState } from 'react'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/modules/ui/form"
import { companyInTakeSchema } from '@/lib/form/account'
import { Input } from "@/modules/ui/input"
import { UseFormReturn, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { LanguageTranslator } from '@/modules/language/components'
import { Label } from '@/modules/ui/label'
import { RadioGroup, RadioGroupItem } from '@/modules/ui/radio-group'
import { vendorSchema } from '@/lib/form/vendor'
import { Textarea } from '@/modules/ui/textarea'
import { Button } from '@/modules/ui/button'
import { useVendors } from '@/lib/context/vendor'
import { BusinessDetailModal } from '@/modules/business/components/businessDetailModal'
import { BusinessType } from '@/types/business'
import LoadingSVG from '@/assets/icons/loading'


export const GeneralVendorDetailForm = ({ form, title = "Vendor Name", readOnlyValues = [] }: { form: UseFormReturn<z.infer<typeof vendorSchema>>, title?: string, readOnlyValues?: string[] }) => {

    const watchedRegisteredData = useWatch({
        control: form.control,
        name: "isRegistered",
    });

    const watchedTin = useWatch({
        control: form.control,
        name: "tin",
    });

    const { business, setBusiness, fetchBusiness } = useVendors()
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    // Manually set an error based on a condition (e.g., email already taken)
    useEffect(() => {
        if (form.formState.errors.tin) {
            if (!(watchedTin && watchedTin.length === 10)) {
                form.setError("tin", {
                    message: "Invalid tin number"
                })
            } else {
                form.clearErrors("tin")
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchedTin]);



    const [isOpen, setIsOpen] = useState(false)
    const [businessFetched, setBusinessFetched] = useState<BusinessType | null>(business)

    const handleClose = () => setIsOpen(false)
    const handleContinue = () => {
        console.log('Continuing...')
        setIsOpen(false)
    }



    return (
        <div className='flex flex-col gap-5'>
            <div className="space-y-2">
                <FormField
                    control={form.control}
                    name="isRegistered"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-sm'>
                                <LanguageTranslator>
                                    Is it the vendor registered Business?
                                </LanguageTranslator></FormLabel>
                            <FormControl>
                                <RadioGroup
                                    className='flex gap-6'
                                    {...field}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    value={field.value}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="yes"
                                            id="yes"
                                        />
                                        <Label htmlFor="yes">Yes</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="no"
                                            id="no"
                                        />
                                        <Label htmlFor="no">No</Label>
                                    </div>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {watchedRegisteredData === 'yes' && <div className=" gap-3 flex justify-between flex-wrap">
                <div className="flex-1 min-w-1/2"><FormField
                    control={form.control}
                    name="tin"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-sm'>Vendor Tin *</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter your TIN number"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                </div>

                {businessFetched && <div className="flex-1 min-w-1/2">
                    <FormField
                        control={form.control}
                        name="vat"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-sm'>Vendor Vat</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your TIN number"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>}
            </div>
            }
            <div className=" gap-3 flex justify-between flex-wrap">

                {watchedRegisteredData === 'yes' && businessFetched &&
                    <div className="flex-1 min-w-1/2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-sm'>
                                        <LanguageTranslator>
                                            {title}
                                        </LanguageTranslator></FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Eurka Tech"
                                            {...field}
                                            disabled={readOnlyValues.includes("companyName")}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>}

                {watchedRegisteredData === 'no' && <div className="flex-1 min-w-1/2">
                    <FormField
                        control={form.control}
                        name="sellerName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-sm'>Seller name</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={readOnlyValues.includes("fullName")}
                                        placeholder="Enter full name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}

                    />
                </div>}
            </div>
            {businessFetched && watchedRegisteredData === 'yes' || watchedRegisteredData === 'no' && <div className="gap-3">
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-sm'>
                                <LanguageTranslator>
                                    Description of the area
                                </LanguageTranslator></FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    id="description"
                                    placeholder="Description of the address area"
                                    className="min-h-32"
                                    disabled={readOnlyValues.includes("description")}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>}


            {watchedRegisteredData === 'yes' && <Button

                disabled={isLoading}
                onClick={async (e) => {

                    e.preventDefault();
                    if (!isLoading) {
                        setIsLoading(true)
                        form.clearErrors("tin")
                        const tin = form.getValues("tin")
                        if (tin && tin.length === 10) {
                            try {
                                const businessData = await fetchBusiness(tin)
                                setBusinessFetched(businessData);
                                setIsOpen(true)
                            } catch (e) {
                                form.setError("tin", {
                                    message: "Given tin number, doesn't have a business with it"
                                })
                            }
                            setIsLoading(false)
                        } else {

                            form.setError("tin", {
                                message: "Invalid tin number"
                            })
                        }
                        setIsLoading(false)
                    }

                }}>
                {isLoading && (
                    <div className='mr-2 h-5 w-5 animate-spin'>
                        <LoadingSVG />
                    </div>
                )}
                Fetch Business
            </Button>
            }


            <BusinessDetailModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                handleClose={handleClose}
                handleContinue={handleContinue}
                businessFetched={businessFetched}
            />
        </div>
    )
}
