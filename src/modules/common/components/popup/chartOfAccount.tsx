import React, { useState, useMemo } from 'react'
import { Search, CheckIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/modules/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/modules/ui/table'
import { Skeleton } from '@/modules/ui/skeleton'
import { DialogTrigger } from '@/modules/ui/dialog'
import { PlusCircledIcon } from '@radix-ui/react-icons'
import { ChartOfAccountType } from '@/types/purchase'
import { Separator } from '@/modules/ui/separator'
import { Button } from '@/modules/ui/button'
import { ScrollArea } from '@/modules/ui/scroll-area'

interface ChartOfAccountPopupProps {
    chartOfAccountsData: ChartOfAccountType[]
    loading: boolean
    setChartOfAccountIndex: (index: number) => void
    setChartOfAccount: (data: ChartOfAccountType) => void
    setOpen: (open: boolean) => void
    setShowNewTeamDialog: (show: boolean) => void
    companyId: string
    chartOfAccounts: { [key: string]: ChartOfAccountType[] }
    chartOfAccountIndex: number | null
    accountTypeObject: { [key: string]: { data: string } }
}

export const ChartOfAccountPopup: React.FC<ChartOfAccountPopupProps> = ({
    chartOfAccountsData,
    loading,
    setChartOfAccountIndex,
    setChartOfAccount,
    setOpen,
    setShowNewTeamDialog,
    companyId,
    chartOfAccounts,
    chartOfAccountIndex,
    accountTypeObject,
}) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [beforeSave, setBeforeSave] = useState<ChartOfAccountType[]>([])

    const filteredChartOfAccounts = useMemo(() => {
        const value = chartOfAccountsData.filter((account) =>
            account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            account.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            accountTypeObject[account.accountType].data.toLowerCase().includes(searchTerm.toLowerCase())
        )
        if (value.length > 0) {
            setBeforeSave(value)
            return value
        }
        else
            return beforeSave
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chartOfAccountsData, searchTerm, accountTypeObject])

    return (
        <div className="flex flex-col h-[400px] overflow-hidden">
            <div className="flex items-center border-b px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Input
                    placeholder="Search Chart Of Account..."
                    className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-none focus:ring-0 focus:border-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex-grow overflow-hidden">
                {chartOfAccountsData && chartOfAccountsData.length > 0 ? (

                    <ScrollArea className='h-[400px]'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className='w-10 bg-popover z-10'>Account Id</TableHead>
                                    <TableHead className='w-32 text-left bg-popover z-10'>Name</TableHead>
                                    <TableHead className='w-32 bg-popover z-10'>Account Type</TableHead>
                                    <TableHead className="w-10 text-right bg-popover z-10">Selected</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {loading ? (
                                    Array(10).fill(0).map((_, index) => (
                                        <TableRow className="bg-accent py-0" key={index}>
                                            <TableCell className='py-3'>
                                                <Skeleton className='w-full h-8 bg-gray-200' />
                                            </TableCell>
                                            <TableCell className='py-3'>
                                                <Skeleton className='w-full h-8 bg-gray-200' />
                                            </TableCell>
                                            <TableCell className="table-cell py-0">
                                                <Skeleton className='w-28 h-8 bg-gray-200' />
                                            </TableCell>
                                            <TableCell className="text-right py-0">
                                                <Skeleton className='w-10 h-8 bg-gray-200' />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    [...filteredChartOfAccounts].map((chartOfAccount, index) => (
                                        <TableRow
                                            key={chartOfAccount.id}
                                            className="cursor-pointer"
                                            onClick={() => {
                                                setChartOfAccountIndex(index)
                                                setChartOfAccount(chartOfAccount)
                                                setOpen(false)
                                            }}
                                        >
                                            <TableCell className='w-10'>{chartOfAccount.code}</TableCell>
                                            <TableCell className="table-cell w-6 text-left">
                                                {chartOfAccount.name}
                                            </TableCell>
                                            <TableCell className="table-cell w-32">
                                                {accountTypeObject[chartOfAccount.accountType].data}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="h-6 w-6 ml-5 border-2 border-black flex justify-center items-center rounded-md">
                                                    <CheckIcon
                                                        className={cn(
                                                            "h-4 w-4",
                                                            chartOfAccountIndex != null &&
                                                                chartOfAccounts &&
                                                                chartOfAccounts[companyId] &&
                                                                chartOfAccounts[companyId].length > chartOfAccountIndex &&
                                                                chartOfAccounts[companyId][chartOfAccountIndex].id === chartOfAccount.id
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))

                                )}
                                <div className='h-32 w-full' />
                            </TableBody>

                        </Table>

                    </ScrollArea >
                ) : (
                    <div className='py-6 text-center text-sm'>No Chart of Account found.</div>
                )}
            </div>

            <div className='p-2 mt-auto'>
                <Separator className='mb-2 -mx-1 h-px bg-border' />
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        className='w-full'
                        onClick={() => {
                            setOpen(false)
                            setShowNewTeamDialog(true)
                        }}
                    >
                        <PlusCircledIcon className="mr-2 h-5 w-5" />
                        Create Chart Of Account
                    </Button>
                </DialogTrigger>
            </div>
        </div>
    )
}