"use client"

import React, { useEffect, useState } from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/modules/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/modules/ui/popover"
import { useChartOfAccount } from '@/lib/context/account/chartOfAccount';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/modules/ui/dialog';
import { ChevronDown, FileChartColumnIncreasing } from 'lucide-react'
import { useCompany, useProfile } from '@/lib/context/account'
import { GeneralChartAccountForm } from '../form/generalChartOfAccountForm'
import { chartOfAccountSchema } from '@/lib/form/account/chartOfAccount'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form } from '@/modules/ui/form'
import { accountTypeObject } from '@/lib/utils/chartOfAccount/values'
import { useToast } from '@/modules/ui/use-toast'
import { ChartOfAccountType } from '@/types/purchase'
import { ChartOfAccountPopup } from '../popup/chartOfAccount'

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface TeamSwitcherProps extends PopoverTriggerProps { }

export const ChartOfAccountInput = ({
    companyId,
    setChartOfAccount,
    formData,
    showIcon = false,
    showCode = false,
    title = "Chart of Account",
    variant = "secondary",
    defaultCOAId,
    ...props
}: {
    companyId: string
    formData: any,
    title?: string,
    showIcon?: boolean,
    showCode?: boolean,
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined,

    defaultCOAId?: string,
    setChartOfAccount: (data: ChartOfAccountType) => void
} & TeamSwitcherProps) => {

    const [open, setOpen] = useState(false)
    const [showNewTeamDialog, setShowNewTeamDialog] = useState(false)
    const [chartOfAccountsData, setChartOfAccountsData] = useState<ChartOfAccountType[]>([])

    const { currentCompany } = useCompany()
    const { profile } = useProfile()

    const { chartOfAccounts, getChartOfAccounts, loading, createCOA } = useChartOfAccount()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { toast } = useToast()

    useEffect(() => {
        if (currentCompany && currentCompany.companyId) {
            console.log("chartOfAccounts", chartOfAccounts, !chartOfAccounts[currentCompany.companyId] ||
                chartOfAccounts[currentCompany.companyId] && chartOfAccounts[currentCompany.companyId].length === 0);
            if (
                !chartOfAccounts[currentCompany.companyId] ||
                chartOfAccounts[currentCompany.companyId] && chartOfAccounts[currentCompany.companyId].length === 0)
                getChartOfAccounts({
                    companyId: currentCompany.companyId
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentCompany])

    const [chartOfAccountIndex, setChartOfAccountIndex] = useState<number | null>(null)

    useEffect(() => {
        console.log("watchedTin, defaultCOAId, chartOfAccounts, companyId")
        if (defaultCOAId && chartOfAccounts && chartOfAccounts[companyId] && chartOfAccounts[companyId].length > 0) {
            const indexData = chartOfAccounts[companyId].findIndex((data) => data.id === defaultCOAId);
            setChartOfAccountIndex(indexData)
        }
    }, [defaultCOAId, chartOfAccounts, companyId])

    useEffect(() => {
        console.log("watchedTin, chartOfAccounts, currentCompany")
        if (currentCompany && currentCompany.companyId) {
            if (
                chartOfAccounts[currentCompany.companyId] && chartOfAccounts[currentCompany.companyId].length > 0
            ) {
                const values = chartOfAccounts[currentCompany.companyId] ?? [];
                setChartOfAccountsData(values)
            }
        }
    }, [chartOfAccounts, currentCompany])


    const chartOfAccountForm = useForm<z.infer<typeof chartOfAccountSchema>>({
        resolver: zodResolver(chartOfAccountSchema),
        defaultValues: {
            balance: {
                amount: 0,
                balanceType: "credit"
            },
        },
    })

    const onSubmit = async (values: z.infer<typeof chartOfAccountSchema>) => {
        if (!isLoading) {
            setIsLoading(true)
            try {
                if (currentCompany) {
                    const coa = await createCOA({
                        companyId: currentCompany.companyId,
                        creatorId: profile ? profile.id : "",
                        data: {
                            accountType: values.accountType,
                            amount: values.balance.amount,
                            balanceType: values.balance.balanceType,
                            code: values.code,
                            name: values.name,
                            type: accountTypeObject[values.accountType].type
                        }
                    })
                    if (coa) {
                        toast({
                            title: "Coa Created",
                            description: (
                                <div className="mt-2 w-full rounded-md p-4 bg-green-300 text-foreground font-medium text-sm">
                                    New Chart of account has been created.
                                </div>
                            ),
                        })
                        chartOfAccountForm.reset()
                        setChartOfAccount(coa);
                        setChartOfAccountIndex(0)
                        setShowNewTeamDialog(false)
                    }
                    else {
                        throw new Error("")
                    }
                }
            } catch (error: any) {
                let message = {
                    title: "Chart of account creation failed",
                    description: "An error occurred. Please try again. If the issue persists, please contact us here."
                }

                if (error.message.includes('Unique constraint failed')) {
                    message = {
                        title: "Error: Chart of account with this Account Id Already exist",
                        description: "There's already a record with the same Account Id. Please check your Account Id input or check a your chart of account list."
                    }
                }

                toast({
                    title: message.title,
                    description: (
                        <div className="mt-2 w-full rounded-md bg-slate-950 p-4 text-red-200 font-medium text-sm">
                            {message.description}
                        </div>
                    ),
                });
            }
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant={variant}
                        role="combobox"
                        aria-expanded={open}
                        aria-label="Select a team"
                        className={cn("w-full justify-between overflow-hidden flex-1 ", props.className)}
                    >
                        <div className='flex gap-2'>
                            {<FileChartColumnIncreasing className="h-4 w-4" />}
                            {chartOfAccountIndex != null &&
                                chartOfAccounts && chartOfAccounts[companyId] &&
                                chartOfAccounts[companyId].length > chartOfAccountIndex ?
                                showCode ? chartOfAccounts[companyId][chartOfAccountIndex].code :
                                    chartOfAccounts[companyId][chartOfAccountIndex].name :
                                <p className='opacity-65'>
                                    {title}
                                </p>}
                        </div>
                        <div>
                            {showIcon && <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />}
                        </div>

                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full min-w-[750px] h-auto p-0 overflow-y-scroll" align='end'>
                    <ChartOfAccountPopup
                        chartOfAccounts={chartOfAccounts}
                        chartOfAccountsData={chartOfAccountsData}
                        loading={loading}
                        setChartOfAccountIndex={setChartOfAccountIndex}
                        setOpen={setOpen}
                        setShowNewTeamDialog={setShowNewTeamDialog}
                        companyId={companyId}
                        accountTypeObject={accountTypeObject}
                        chartOfAccountIndex={chartOfAccountIndex}
                        setChartOfAccount={setChartOfAccount}
                    />
                </PopoverContent>
            </Popover>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Chart Of Account</DialogTitle>
                    <DialogDescription>
                        Add a new Chart Of Account to manage everything.
                    </DialogDescription>
                </DialogHeader>
                <Form {...chartOfAccountForm}>
                    <div>
                        <GeneralChartAccountForm form={chartOfAccountForm} />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={(e) => {
                            e.preventDefault();
                            setShowNewTeamDialog(false)
                        }}>
                            Close
                        </Button>
                        <Button type="submit" onClick={(e) => {
                            e.preventDefault();
                            chartOfAccountForm.handleSubmit(onSubmit)()
                        }}>Create</Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    )
}