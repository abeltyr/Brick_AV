"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
} from "@/modules/ui/form"
import yearSchema from '@/lib/form/account/accountPeriod'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { useOnboarding } from '@/lib/context/account/onboarding'
import { useToast } from '@/modules/ui/use-toast'
import { useAuth } from '@/lib/context/auth'
import { useProfile } from '@/lib/context/account'
import { chartOfAccountsSchema } from '@/lib/form/account/chartOfAccount'
import { Button } from '@/modules/ui/button'
import { ErrorMessage } from '@/modules/common/components/errorMessage'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/modules/ui/table'
import { NormalInput } from '@/modules/common/components/input/normal'
import { Trash2 } from 'lucide-react'
import AddCircleSVG from '@/assets/icons/addCircle'
import { AccountTypeData, accountTypeObject } from '@/lib/utils/chartOfAccount/values'
import { SelectInput } from '@/modules/common/components/input/select'
import { PriceInput } from '@/modules/common/components/input/price'
import LoadingSVG from '@/assets/icons/loading'
import { Card, CardContent, CardHeader, CardTitle } from '@/modules/ui/card'
import { useEffect, useState } from 'react'
import Decimal from 'decimal.js'


interface OnboardingChartOfAccountFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function OnboardingChartOfAccountForm({ className, ...props }: OnboardingChartOfAccountFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const { toast } = useToast()

    const { session } = useAuth();
    const { createUser } = useOnboarding();
    const { setProfile } = useProfile();


    const form = useForm<z.infer<typeof chartOfAccountsSchema>>({
        resolver: zodResolver(chartOfAccountsSchema),
        defaultValues: {
            accounts: []
        },
    })


    const { fields, remove, update, insert, } = useFieldArray({
        control: form.control,
        name: "accounts",
    });



    const watchedAccounts = useWatch({
        control: form.control,
        name: "accounts",
    });


    useEffect(() => {

        let debitData = new Decimal(0)
        let creditData = new Decimal(0)


        for (let watchedAccount of watchedAccounts) {
            if (typeof (watchedAccount.balance.amount) === "number") {
                if (accountTypeObject[watchedAccount.accountType].normal_balance === "credit") {
                    creditData = creditData.plus(new Decimal(watchedAccount.balance.amount))
                } else {
                    debitData = debitData.plus(new Decimal(watchedAccount.balance.amount))
                }
            }
        }

        setTotalDebit(debitData)
        setTotalCredit(creditData)
    }, [watchedAccounts])




    const onSubmit = async (values: z.infer<typeof chartOfAccountsSchema>) => {
        if (!isLoading) {
            setIsLoading(true)
            try {
                if (session && session.user && session?.user.id) {
                    const profileData = await createUser({ userId: session.user.id, chartOfAccounts: values });
                    if (profileData)
                        setProfile(profileData)
                }
                setIsLoading(false)
            } catch (e) {
                console.log(e)
                toast({
                    title: "Error Signing up",
                    description: (
                        <div className="mt-2 w-full rounded-md bg-slate-950 p-4 text-red-300 font-medium text-sm">
                            An error occurred please try again. If the issue persists, please wait a moment before attempt again. If the issue still persists, please contact us here.
                        </div>
                    ),
                })
                setIsLoading(false)
            }
        }
    }

    const [totalDebit, setTotalDebit] = useState(new Decimal(0))
    const [totalCredit, setTotalCredit] = useState(new Decimal(0))

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <Form {...form}>
                <div className='flex flex-col w-full gap-5'>
                    <div>
                        <p className='text-lg text-[#09090B]'>
                            Maintain Chart of Accounts
                        </p>
                    </div>
                    <div className='overflow-hidden'>
                        <Table className='overflow-hidden'>
                            <TableHeader>
                                <TableRow >
                                    <TableHead className='text-sm text-stone-500 font-light'>Account Id</TableHead>
                                    <TableHead className='text-sm text-stone-500 font-light'>Description</TableHead>
                                    <TableHead className='text-sm text-stone-500 font-light'>Account Type</TableHead>
                                    <TableHead className='text-sm text-stone-500 font-light'>Balance</TableHead>
                                    {fields.length > 0 && <TableHead className='text-sm text-stone-500 font-light w-[60px]'> Remove</TableHead>}
                                </TableRow>
                            </TableHeader>
                            {fields.length > 0 ? <TableBody >
                                {fields.map((field, index) => (
                                    <TableRow key={field.id} >
                                        <TableCell className='py-4 px-1 w-[160px]'>
                                            <PriceInput
                                                form={form}
                                                name={`accounts.${index}.code`}
                                                placeholder="Account Id"
                                            />
                                        </TableCell>
                                        <TableCell className='py-4 px-1 pr-2 w-[200px]'>
                                            <NormalInput
                                                form={form}
                                                name={`accounts.${index}.name`}
                                                type='text'
                                                placeholder="COA Name"
                                            />
                                        </TableCell>
                                        <TableCell className='py-4 px-1 w-[230px]'>
                                            <SelectInput
                                                form={form}
                                                name={`accounts.${index}.accountType`}
                                                selectTitle={{
                                                    name: "Choose account type",
                                                    value: "Account_type"
                                                }}
                                                values={[...AccountTypeData]}
                                            />
                                        </TableCell>
                                        <TableCell className='py-4 px-1 min-w-[120px] '>
                                            <PriceInput
                                                form={form}
                                                name={`accounts.${index}.balance.amount`}
                                                placeholder="100,000"
                                            />
                                        </TableCell>
                                        <TableCell className='py-4 px-1 text-center w-[60px]'>
                                            <Button
                                                variant="outline" onClick={() => remove(index)} className='p-3 hover:border-red-900 hover:text-red-900 duration-300 '>
                                                <Trash2 className='w-4 h-4' />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                                :
                                <TableBody >
                                    <TableRow className='space-x-2 '>
                                        <TableCell className='py-4 px-1 w-[100px]'>
                                            <Button disabled variant={"outline"} className='w-full justify-start'>
                                                Sample: 1001
                                            </Button>
                                        </TableCell>
                                        <TableCell className='py-4 px-1 pr-2 w-[200px]'>
                                            <Button disabled variant={"outline"} className='w-full justify-start'>
                                                Sample: Petty Cash
                                            </Button>
                                        </TableCell>
                                        <TableCell className='py-4 px-1 w-[140px]'>
                                            <Button disabled variant={"outline"} className='w-full justify-start'>
                                                Sample: Cash
                                            </Button>
                                        </TableCell>
                                        <TableCell className='py-4 px-1 w-[180px] overflow-hidden ' >
                                            <Button disabled variant={"outline"} className='w-full justify-start'>
                                                Sample:120000
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>}
                        </Table>

                        <div>
                            {form!.formState.errors.accounts &&
                                <ErrorMessage message='At least one item is required for the purchase' />
                            }
                        </div>
                    </div>
                    <div className='flex gap-5'>
                        <Button
                            variant='outline'
                            onClick={() => {
                                insert(fields.length > 0 ? fields.length : 1, {
                                    name: "",
                                    code: 0,
                                    balance: {
                                        amount: 0
                                    },
                                    accountType: "Equity_does_not_close",
                                })
                            }}
                            className='flex gap-2'
                        >
                            <AddCircleSVG />
                            Add
                        </Button>
                        <Button
                            disabled={isLoading}
                            type="submit" variant='default'
                            onClick={() => {
                                console.log(form.formState)
                                form.handleSubmit(onSubmit)()
                                // onSubmit({ accounts: [] })
                            }}
                        >
                            {isLoading && (
                                <div className='mr-2 h-5 w-5 animate-spin'>
                                    <LoadingSVG />
                                </div>
                            )}
                            Continue
                        </Button>
                    </div>

                    {fields.length > 0 && <div className=''>
                        <CardTitle className="text-right text-xl font-bold mb-2 ">Balance Summary</CardTitle>
                        <div className='flex flex-col items-end'>
                            <div className="flex gap-5 items-center">
                                <span className="text-base">Total Debit:</span>
                                <span className="text-base w-48 text-right">
                                    {totalDebit.toNumber().toLocaleString('en-US', { style: 'currency', currency: 'ETB' })}
                                </span>
                            </div>
                            <div className="flex gap-5 items-center">
                                <span className="text-base">Total Credit:</span>
                                <span className="text-base w-48 text-right">
                                    {totalCredit.greaterThan(0) && "-"} {totalCredit.toNumber().toLocaleString('en-US', { style: 'currency', currency: 'ETB' })}
                                </span>
                            </div>
                            <div className="h-px bg-border" />
                            <div className="flex  items-center gap-5">
                                <span className="text-base ">Trial Balance:</span>
                                <span className="text-base w-48 text-right">
                                    {totalDebit.minus(totalCredit).toNumber().toLocaleString('en-US', { style: 'currency', currency: 'ETB' })}
                                </span>
                            </div>
                        </div>
                    </div>}

                </div>
            </Form>
        </div>
    )
}
