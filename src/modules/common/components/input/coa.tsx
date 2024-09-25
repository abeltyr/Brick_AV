"use client"

import React, { useState } from 'react'
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
import { Dialog, DialogContent, DialogTrigger } from '@/modules/ui/dialog';
import { File } from 'lucide-react'

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>


interface TeamSwitcherProps extends PopoverTriggerProps { }


export const ChartOfAccountInput = ({
    companyId,
    ...props
}: {
    companyId: string
} & TeamSwitcherProps) => {


    const [open, setOpen] = useState(false)

    const [showNewTeamDialog, setShowNewTeamDialog] = useState(false)



    const { chartOfAccounts, getChartOfAccounts, loading, createCOA } = useChartOfAccount()
    const [chartOfAccountIndex, setChartOfAccountIndex] = useState<number>(0)




    return (

        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Select a team"
                    className={cn("w-full justify-between", props.className)}
                >
                    <File className='mr-2 h-5 w-5' />
                    {chartOfAccounts && chartOfAccounts[companyId] && chartOfAccounts[companyId].length > chartOfAccountIndex ? chartOfAccounts[companyId][chartOfAccountIndex].name : "Chart of Account"}
                    <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full min-w-[400px] p-0">
                <Command>
                    <CommandInput placeholder="Search Chart Of Account..." />
                    <CommandList>
                        <CommandEmpty>No team found.</CommandEmpty>
                        <CommandGroup >
                            {chartOfAccounts && chartOfAccounts[companyId] && chartOfAccounts[companyId].map((chartOfAccount, index) => (
                                <CommandItem
                                    key={chartOfAccount.id}
                                    onSelect={() => {
                                        setChartOfAccountIndex(index)
                                        setOpen(false)
                                    }}
                                    className="text-sm group"
                                >
                                    <Avatar className="mr-2 h-5 w-5">
                                        <AvatarImage
                                            src={`images/companyLogo.webp`}
                                            alt={chartOfAccount.name}
                                        />
                                        <AvatarFallback>SC</AvatarFallback>
                                    </Avatar>
                                    {chartOfAccount.name}
                                    <CheckIcon
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            chartOfAccounts &&
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
                            <Dialog>
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
                                <DialogContent>

                                </DialogContent>
                            </Dialog>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}




