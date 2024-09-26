"use client"

import React, { useEffect, useState } from 'react'
import {
    CaretSortIcon,
    CheckIcon,
    PlusCircledIcon,
} from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/modules/ui/avatar"
import { Button } from "@/modules/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/modules/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/modules/ui/popover"
import { useChartOfAccount } from '@/lib/context/account/chartOfAccount';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/modules/ui/dialog';
import { File } from 'lucide-react'
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


type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>


interface TeamSwitcherProps extends PopoverTriggerProps { }


export const ChartOfAccountInput = ({
    companyId,
    setChartOfAccount,
    formData,
    ...props
}: {
    companyId: string
    formData: any,
    setChartOfAccount: (data: ChartOfAccountType) => void
} & TeamSwitcherProps) => {


    const [open, setOpen] = useState(false)

    const [showNewTeamDialog, setShowNewTeamDialog] = useState(false)



    const { currentCompany } = useCompany()
    const { profile } = useProfile()

    const { chartOfAccounts, getChartOfAccounts, loading, createCOA } = useChartOfAccount()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { toast } = useToast()

    useEffect(() => {
        console.log("getChartOfAccounts,session, useEffect")
        if (currentCompany && currentCompany.companyId) {
            if (!chartOfAccounts[currentCompany.companyId] || chartOfAccounts[currentCompany.companyId] && chartOfAccounts[currentCompany.companyId].length === 0)
                getChartOfAccounts({
                    companyId: currentCompany.companyId
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const [chartOfAccountIndex, setChartOfAccountIndex] = useState<number | null>()


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
                console.log("message", error.message, error.message.includes('Unique constraint failed'))
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
                    <div>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            aria-label="Select a team"
                            className={cn("w-full justify-between", props.className)}
                        >
                            <File className='mr-2 h-5 w-5' />
                            {chartOfAccountIndex != null && chartOfAccounts && chartOfAccounts[companyId] && chartOfAccounts[companyId].length > chartOfAccountIndex ? chartOfAccounts[companyId][chartOfAccountIndex].name : "Chart of Account"}
                            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                        {formData && formData.formState.errors.chartOfAccountId && <p className='text-red-600 mt-4 text-left'>
                            {formData.formState.errors.chartOfAccountId.message}
                        </p>}
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-full min-w-[100%] p-0">
                    <Command>
                        <CommandInput placeholder="Search Chart Of Account..." />
                        <CommandList>
                            <CommandEmpty>No Chart of Account found.</CommandEmpty>
                            <CommandGroup >
                                {chartOfAccounts && chartOfAccounts[companyId] && chartOfAccounts[companyId].map((chartOfAccount, index) => (
                                    <CommandItem
                                        key={chartOfAccount.id}
                                        onSelect={() => {
                                            setChartOfAccountIndex(index)
                                            setChartOfAccount(chartOfAccount);
                                            setOpen(false)
                                        }}
                                        className="text-sm group px-3 py-2 "
                                    >
                                        <Avatar className="mr-2 h-5 w-5">
                                            <AvatarImage
                                                src={`images/companyLogo.webp`}
                                                alt={chartOfAccount.name}
                                            />
                                            <AvatarFallback>SC</AvatarFallback>
                                        </Avatar>
                                        {chartOfAccount.name}{" "} - {" "}
                                        {chartOfAccount.code}{" "} - {" "}
                                        {chartOfAccount.accountType}
                                        <CheckIcon
                                            className={cn(
                                                "h-4 w-4 ml-5",
                                                chartOfAccountIndex != null && chartOfAccounts &&
                                                    chartOfAccounts[companyId] &&
                                                    chartOfAccounts[companyId].length > chartOfAccountIndex
                                                    && chartOfAccounts[companyId][chartOfAccountIndex].id === chartOfAccount.id
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                        <CommandSeparator />
                        <CommandList>
                            <CommandGroup>
                                <DialogTrigger asChild>
                                    <CommandItem
                                        onSelect={() => {
                                            setOpen(false)
                                            setShowNewTeamDialog(true)
                                        }}
                                    >
                                        <PlusCircledIcon className="mr-2 h-5 w-5" />
                                        Create Chart Of Account
                                    </CommandItem>
                                </DialogTrigger>
                            </CommandGroup>
                        </CommandList>
                    </Command>
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




