"use client"

import * as React from "react"
import {
    CaretSortIcon,
    CheckIcon,
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
} from "@/modules/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/modules/ui/popover"
import { useAuth } from '@/lib/context/auth/user'
import { Skeleton } from "@/modules/ui/skeleton"


type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface TeamSwitcherProps extends PopoverTriggerProps { }

export default function TeamSwitcher({ className }: TeamSwitcherProps) {
    const [open, setOpen] = React.useState(false)
    const { companies, updateCompanyIndex, companyIndex, loading } = useAuth()


    if (loading)
        return <Skeleton className="w-[200px] h-[35px] rounded-fmd" />

    else
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        aria-label="Select a team"
                        className={cn("w-[200px] justify-between", className)}
                    >
                        <Avatar className="mr-2 h-5 w-5">
                            <AvatarImage
                                src={`images/companyLogo.webp`}
                                alt={companies && companies.length > companyIndex ? companies[companyIndex].company?.name : ""}
                            // className="grayscale"
                            />
                            <AvatarFallback>{companies && companies.length > companyIndex ? companies[companyIndex].company?.name : "SC"}</AvatarFallback>
                        </Avatar>
                        {companies && companies.length > companyIndex ? companies[companyIndex].company?.name : ""}
                        <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder="Search team..." />
                        <CommandList>
                            <CommandEmpty>No team found.</CommandEmpty>
                            <CommandGroup >
                                {companies && companies.map((companyMember, index) => (
                                    <CommandItem
                                        key={companyMember.companyId}
                                        onSelect={() => {
                                            updateCompanyIndex(index)
                                            setOpen(false)
                                        }}
                                        className="text-sm group"
                                    >
                                        <Avatar className="mr-2 h-5 w-5">
                                            <AvatarImage
                                                src={`images/companyLogo.webp`}
                                                alt={companyMember.company?.name}
                                            // className="opacity-40 group-hover:opacity-90"
                                            />
                                            <AvatarFallback>SC</AvatarFallback>
                                        </Avatar>
                                        {companyMember.company?.name}
                                        <CheckIcon
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                companies && companies.length > companyIndex && companies[companyIndex].companyId === companyMember.companyId
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                        {/* <CommandSeparator /> */}
                        {/* <CommandList>
                                <CommandGroup>
                                    <DialogTrigger asChild>
                                        <CommandItem
                                            onSelect={() => {
                                                setOpen(false)
                                                setShowNewTeamDialog(true)
                                            }}
                                        >
                                            <PlusCircledIcon className="mr-2 h-5 w-5" />
                                            Create Company
                                        </CommandItem>
                                    </DialogTrigger>
                                </CommandGroup>
                            </CommandList> */}
                    </Command>
                </PopoverContent>
            </Popover>
        )
}