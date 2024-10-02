import React, { useEffect, useState } from 'react'
import { UseFormReturn, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { vendorSchema } from '@/lib/form/vendor'
import { Button } from '@/modules/ui/button'
import { useVendors } from '@/lib/context/vendor'
import { BusinessDetailModal } from '@/modules/business/components/businessDetailModal'
import LoadingSVG from '@/assets/icons/loading'
import { Card, CardContent } from '@/modules/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/modules/ui/avatar'
import { ZeroAdjustableInput } from '../input/tin'
import { PhoneNumberInput } from '../input/phoneNumber'
import { NormalInput } from '../input/normal'
import { NormalTextAreaInput } from '../input/textArea'
import { RadioInput } from '../input/radio'
import { Edit, Edit2, Eye, Pencil } from 'lucide-react'


export const GeneralVendorDetailForm = ({ form, readOnlyValues = [] }: { form: UseFormReturn<z.infer<typeof vendorSchema>>, readOnlyValues?: string[] }) => {

    const watchedRegisteredData = useWatch({
        control: form.control,
        name: "isRegistered",
    });

    const watchedTin = useWatch({
        control: form.control,
        name: "tin",
    });


    const watchedTaxType = useWatch({
        control: form.control,
        name: "taxType",
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
    }
    const handleContinue = () => {
        setIsOpen(false)
    }




    return (
        <div className='flex flex-col gap-5'>

            {!business && <div className="space-y-2">
                <RadioInput
                    form={form}
                    title='Is the Vendor registered Business?'
                    name='isRegistered'
                    alignment='horizontal'
                    values={[
                        {
                            data: "Yes",
                            value: "yes",
                            onClick: () => {
                            }
                        },
                        {
                            data: "No",
                            value: "no",
                            onClick: () => {
                                form.setValue("taxType", "NONE")
                            }
                        }
                    ]} />
            </div>}

            {!business && watchedRegisteredData === "yes" &&
                <ZeroAdjustableInput title={"Vendor TIN"} name="tin" form={form} placeholder='Enter Tax Identification Number (TIN)' />
            }

            {business &&
                <>
                    <Card>
                        <CardContent className='flex flex-col justify-start p-6 gap-6 '>
                            <div className='flex gap-3 items-center'>
                                <Avatar className="h-12 w-12">
                                    <AvatarImage
                                        alt={"company logo"}
                                    />
                                    <AvatarFallback>{business.businessName?.slice(0, 2)?.toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <p className='text-base font-semibold text-foreground'>
                                    {business.businessName}
                                </p>
                            </div>
                            <div className='flex w-full gap-5'>
                                <Button
                                    className='flex gap-2'
                                    variant={"secondary"}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setIsOpen(true)
                                    }}
                                >
                                    <Eye className='w-4 h-4' />
                                    View Business Detail
                                </Button>
                                <Button
                                    className='flex gap-2'
                                    variant={"secondary"}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setBusiness(null)
                                    }}
                                >
                                    <Pencil className='w-4 h-4' />
                                    Change Business
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="flex gap-3 flex-wrap justify-between">
                        <div className="flex-1 min-w-[200px]">
                            <NormalInput
                                form={form}
                                name='name'
                                title="Vendor Name"
                                type='text'
                                disabled={readOnlyValues.includes("fullName")}
                                placeholder="Vendor name"
                            />
                        </div>
                    </div>
                    <div className='w-full flex gap-5'>

                        <Button
                            onClick={() => {
                                form.setValue("taxType", "VAT")
                            }}
                            variant={watchedTaxType === "VAT" ? "default" : "secondary"}
                            className='flex-1'>
                            VAT
                        </Button>
                        <Button
                            onClick={() => {
                                form.setValue("taxType", "TOT")
                            }}
                            variant={watchedTaxType === "TOT" ? "default" : "secondary"}
                            className='flex-1'>
                            TOT
                        </Button>
                    </div>

                    {watchedTaxType === "VAT" && <div className="flex-1 min-w-[200px] w-full">
                        <NormalInput
                            form={form}
                            name='vat'
                            title="Vendor Vat"
                            type='text'
                            disabled={readOnlyValues.includes("vat")}
                            placeholder="Enter your TIN number"
                        />
                    </div>}
                </>}

            {watchedRegisteredData === 'no' &&
                <div className="flex-1 min-w-1/2">
                    <NormalInput
                        form={form}
                        name='name'
                        title='Seller name'
                        type='text'
                        disabled={readOnlyValues.includes("fullName")}
                        placeholder="Enter Vendor Full name"
                    />
                </div>
            }

            {business !== null && watchedRegisteredData === 'yes' || watchedRegisteredData === 'no' ?
                <div className="flex gap-3 flex-wrap justify-between">
                    <div className='flex-1 min-w-[200px]'>
                        <NormalInput
                            form={form}
                            name='email'
                            title='Vendor Email'
                            type='email'
                            disabled={readOnlyValues.includes("email")}
                            placeholder="Enter email address"
                        />
                    </div>
                    <div className="flex-1 min-w-[200px] w-full">
                        <PhoneNumberInput
                            title={"Phone number"}
                            name="phoneNumber"
                            form={form}
                        />
                    </div>
                </div> :
                <></>
            }


            {business !== null && watchedRegisteredData === 'yes' || watchedRegisteredData === 'no' ?
                <NormalTextAreaInput
                    form={form}
                    name='description'
                    title='Description of the Vendor'
                    placeholder="Description of the Vendor, what they sell and special not for the future"
                    disabled={readOnlyValues.includes("description")}
                />
                : <></>
            }


            {
                watchedRegisteredData === 'yes' && !business &&
                <Button
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
                                    if (businessData.paidUpCapital && businessData.paidUpCapital > 100000)
                                        form.setValue("taxType", "VAT")
                                    else form.setValue("taxType", "TOT")
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
