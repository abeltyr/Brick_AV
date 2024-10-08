"use client"

import * as React from "react"
import { Button } from "@/modules/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/modules/ui/dialog"
import { Separator } from '@/modules/ui/separator'
import CloseCircleSVG from '@/assets/icons/closeCircle'
import { purchaseExportCSVSchema } from '@/lib/form/export/purchase'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { Form } from '@/modules/ui/form'
import { DatePickerInput } from '@/modules/common/components/input/date'
import { useExportPurchase } from '@/lib/context/purchaseExport'
import { useCompany } from '@/lib/context/account'
import LoadingSVG from '@/assets/icons/loading'

export function PurchaseExportCSVModal({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    handleClose: () => void,
    handleContinue: () => void
}) {



    const { fetchPurchaseEtaxCsv, fetchPurchaseTassCsv, fetchPurchaseLtoCsv, fetchWithholdingEtaxCsv, loading } = useExportPurchase();
    const { currentCompany } = useCompany();
    const form = useForm<z.infer<typeof purchaseExportCSVSchema>>({
        resolver: zodResolver(purchaseExportCSVSchema),
        defaultValues: {
            exportType: "PURCHASE_ETAX",
        },
    })


    const watchedExportCSVType = useWatch({
        control: form.control,
        name: "exportType",
    });


    const onSubmit = async (values: z.infer<typeof purchaseExportCSVSchema>) => {
        try {
            if (currentCompany) {

                if (values.exportType === "PURCHASE_ETAX")
                    await fetchPurchaseEtaxCsv({
                        companyId: currentCompany.companyId,
                        dateRange: {
                            startDate: values.start,
                            endDate: values.end,
                            name: "Custom Range",
                        }
                    })
                else if (values.exportType === "PURCHASE_TASS")
                    await fetchPurchaseTassCsv({
                        companyId: currentCompany.companyId,
                        dateRange: {
                            startDate: values.start,
                            endDate: values.end,
                            name: "Custom Range",
                        }
                    })
                else if (values.exportType === "PURCHASE_LTO")
                    await fetchPurchaseLtoCsv({
                        companyId: currentCompany.companyId,
                        dateRange: {
                            startDate: values.start,
                            endDate: values.end,
                            name: "Custom Range",
                        }
                    })
                else if (values.exportType === "WITHHOLDING_ETAX")
                    await fetchWithholdingEtaxCsv({
                        companyId: currentCompany.companyId,
                        dateRange: {
                            startDate: values.start,
                            endDate: values.end,
                            name: "Custom Range",
                        }
                    })
            }
            setIsOpen(false);
        } catch (e) {
            console.log(e)
        }
    }


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[1000px] px-0">
                <DialogTitle className='scale-0' />
                <DialogHeader className='px-10 py-0'>
                    <div className=' flex justify-between items-start w-full'>
                        <div className='max-w-[580px] flex flex-col gap-2'>
                            <p className="text-3xl font-extrabold text-stone-950">
                                Export
                            </p>
                            <p className="text-base font-light text-stone-500">
                                Let us generate your reporting for tax filling, just select the type you want to file
                                and the date range you want.
                            </p>
                        </div>
                        <div
                            className='cursor-pointer select-none'
                            onClick={() => {
                                setIsOpen(false);
                            }}>
                            <CloseCircleSVG />
                        </div>
                    </div>
                </DialogHeader>
                <Form {...form}>
                    <Separator className='mb-4' />
                    <div className='px-10 flex flex-col gap-10'>
                        <div className='flex  justify-between gap-6'>
                            <div className='flex-1'>
                                <DatePickerInput
                                    form={form}
                                    name={`start`}
                                    variant={"outline"}
                                    placeholder='Start Date'
                                    maxDate={new Date()}
                                    title='Start date'
                                    disabled={false}
                                />
                            </div>
                            <div className='flex-1'>
                                <DatePickerInput
                                    form={form}
                                    name={`end`}
                                    variant={"outline"}
                                    placeholder='End Date'
                                    maxDate={new Date()}
                                    title='End date'
                                    disabled={false}
                                />
                            </div>
                        </div>

                        <div className='flex flex-col gap-6'>
                            <p className='text-sm font-medium '>
                                Choose the type of tax report you want to be generated for you
                            </p>
                            <div className='w-full flex gap-5  flex-wrap '>
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        form.setValue("exportType", "PURCHASE_ETAX")
                                    }}
                                    variant={"outline"}
                                    className={`flex-1 ${watchedExportCSVType === "PURCHASE_ETAX" ? "border-primary border-2" : ""} min-w-[48%]`}>
                                    PURCHASE ETAX
                                </Button>
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        form.setValue("exportType", "PURCHASE_TASS")
                                    }}
                                    variant={"outline"}
                                    className={`flex-1 ${watchedExportCSVType === "PURCHASE_TASS" ? "border-primary border-2" : ""} min-w-[48%]`}>
                                    PURCHASE TASS
                                </Button>

                                <Button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        form.setValue("exportType", "PURCHASE_LTO")
                                    }}
                                    variant={"outline"}
                                    className={`flex-1 ${watchedExportCSVType === "PURCHASE_LTO" ? "border-primary border-2" : ""} min-w-[48%]`}>
                                    PURCHASE LTO
                                </Button>
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        form.setValue("exportType", "WITHHOLDING_ETAX")
                                    }}
                                    variant={"outline"}
                                    className={`flex-1 ${watchedExportCSVType === "WITHHOLDING_ETAX" ? "border-primary border-2" : ""} min-w-[48%]`}>
                                    WITHHOLDING ETAX
                                </Button>
                            </div>
                        </div>
                    </div>
                    <Separator className='mt-10' />

                    <DialogFooter className='mx-8'>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setIsOpen(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={loading}
                            onClick={() => {

                                form.handleSubmit(onSubmit)()
                            }}
                        >
                            {loading && (
                                <div className='mr-2 h-5 w-5 animate-spin'>
                                    <LoadingSVG />
                                </div>
                            )}
                            {loading ? "Generating " : "Export CSV"}
                        </Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

