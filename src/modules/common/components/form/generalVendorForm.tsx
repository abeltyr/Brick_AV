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
import { Card, CardContent } from '@/modules/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/modules/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/modules/ui/select'


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
    // const [business, setBusinessFetched] = useState<BusinessType | null>(business)

    const handleClose = () => {
        setIsOpen(false)
        // setBusiness(null)
        // setBusinessFetched(null)
    }
    const handleContinue = () => {
        console.log('Continuing...')
        setIsOpen(false)
    }



    return (
        <div className='flex flex-col gap-5'>
            {business && <Card>
                <CardContent className='flex justify-between p-4 items-center '>
                    <div className='flex gap-3 items-center'>
                        <Avatar className="h-12 w-12">
                            <AvatarImage
                                src={`images/companyLogo.webp`}
                                alt={"company logo"}
                            />
                            <AvatarFallback>{business.businessName?.slice(0, 2)?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <p className='text-base font-semibold text-foreground'>
                            {business.businessName}
                        </p>
                    </div>
                    <Button variant={"secondary"} onClick={(e) => {
                        e.preventDefault()
                        setIsOpen(true)
                    }}>
                        View Business Detail
                    </Button>
                    <Button variant={"secondary"} onClick={(e) => {
                        e.preventDefault()
                        setBusiness(null)
                    }}>
                        Change
                    </Button>
                </CardContent>
            </Card>}
            {!business && <div className="space-y-2">
                <FormField control={form.control}
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
                                            onClick={() => {
                                                form.setValue("tin", undefined);
                                                form.clearErrors("tin");
                                                setBusiness(null)
                                            }}
                                        />
                                        <Label htmlFor="no">No</Label>
                                    </div>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>}

            {!business && watchedRegisteredData === "yes" && <FormField
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

            }

            {business && <div className="flex gap-3 flex-wrap justify-between">

                <div className="flex-1 min-w-[200px]">
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
                                        disabled={true}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex-1 min-w-[200px] w-full">
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
                </div>
            </div>}

            {watchedRegisteredData === 'no' && <div className="flex-1 min-w-1/2">
                <FormField
                    control={form.control}
                    name="name"
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
            </div>
            }
            {business !== null && watchedRegisteredData === 'yes' || watchedRegisteredData === 'no' ? <div className="flex gap-3 flex-wrap justify-between">
                <div className='flex-1 min-w-[200px]'>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-sm'>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={readOnlyValues.includes("email")}
                                        placeholder="Enter email address"
                                        {...field}
                                        type="email"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex-1 min-w-[200px] w-full">
                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-sm'>Phone number</FormLabel>
                                <FormControl>
                                    <div className='flex '>
                                        <Select>
                                            <SelectTrigger className="w-[100px]">
                                                <SelectValue placeholder="🇪🇹 +251" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="eth">🇪🇹 +251</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            {...field}
                                            disabled={readOnlyValues.includes("phoneNumber")}
                                            placeholder="922998885"
                                            className="flex-1 ml-2"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div> : <></>}
            {business !== null && watchedRegisteredData === 'yes' || watchedRegisteredData === 'no' ?
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-sm'>
                                <LanguageTranslator>
                                    Description of the Vendor
                                </LanguageTranslator></FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    id="description"
                                    placeholder="Description of the Vendor, what they sell and special not for the future"
                                    className="min-h-32"
                                    disabled={readOnlyValues.includes("description")}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                /> : <></>
            }


            {
                watchedRegisteredData === 'yes' && !business && <Button

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
                                    if (businessData === null) throw Error()

                                    setIsOpen(true)
                                    form.setValue("name", businessData.businessName ?? "")
                                    form.setValue("phoneNumber", businessData.phoneNumber ?? "")
                                    form.clearErrors();
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
                businessFetched={business}
                viewingOnly={true}
                name={business?.businessName ?? ""}
            />
        </div >
    )
}
