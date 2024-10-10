import { DatePickerInput } from '@/modules/common/components/input/date';
import { ChartOfAccountType } from '@/types/purchase';
import React from 'react'
import { purchaseSchema } from '@/lib/form/purchase'
import { z } from 'zod';
import { UseFormReturn } from 'react-hook-form';
import { ChartOfAccountInput } from '@/modules/common/components/input/coa';
import { useAddPurchases } from '@/lib/context/purchase/addPurchase';
import Decimal from 'decimal.js';
import { ErrorMessage } from '@/modules/common/components/errorMessage';
import { useCompany } from '@/lib/context/account';

export const AddPurchaseTopSection = ({ form, companyId }: {
    companyId: string, form: UseFormReturn<z.infer<typeof purchaseSchema>>
}) => {

    const { setChartOfAccount, chartOfAccount } = useAddPurchases()

    const { fiscalYear } = useCompany();
    return (
        <div className='w-full flex justify-between item-center gap-6 my-10'>
            <div className='flex flex-col gap-1'>
                <p className='text-3xl font-black text-black'>
                    Add Purchase
                </p>
                <p className='text-base font-normal text-[#757575]'>
                    Overview of charges, payments and detailed insights.
                </p>
            </div>
            <div className='flex gap-3 items-center'>
                <div>
                    <DatePickerInput
                        form={form}
                        name='date'
                        minDate={
                            fiscalYear?.startDate
                        }
                        maxDate={
                            fiscalYear?.endDate
                        }
                    />
                </div>
                <div className={`${form!.formState.errors.paymentChartOfAccountId ? "space-y-3" : ""}`}>
                    <ChartOfAccountInput
                        companyId={companyId}
                        className=''
                        setChartOfAccount={(coa: ChartOfAccountType) => {
                            form.setValue("paymentChartOfAccountId", coa.id);
                            form.clearErrors()
                            setChartOfAccount((prevState) => ({
                                ...prevState, // Keep other properties unchanged
                                paymentAccount: {
                                    id: coa.id,
                                    accountType: coa.accountType,
                                    code: coa.code,
                                    name: coa.name,
                                    balance: coa.chartOfAccountBalance &&
                                        coa.chartOfAccountBalance.length > 0 &&
                                        coa.chartOfAccountBalance[0].balance ? new Decimal(coa.chartOfAccountBalance[0].balance).toNumber() : 0,
                                    amount: 0,
                                    quantity: 1
                                }, // Update productsChartAccount
                            }));
                        }}
                        formData={form}
                        title='Payment COA'
                        defaultCOAId={chartOfAccount.paymentAccount?.id}
                    />

                    {form!.formState.errors.paymentChartOfAccountId &&
                        <ErrorMessage message='Payment COA is Required' />
                    }
                </div>
            </div>
        </div>
    )
}

export default top

