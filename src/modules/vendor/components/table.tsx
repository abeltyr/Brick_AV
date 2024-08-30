"use client"

import AddSVG from '@/assets/icons/add'
import LoadingSVG from '@/assets/icons/loading'
import { useAuth } from '@/lib/context/auth/user'
import { useVendors } from '@/lib/context/vendor'
import { LanguageTranslator } from '@/modules/language/components'
import { Badge } from "@/modules/ui/badge"
import { Button } from '@/modules/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/modules/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/modules/ui/table"
import { VendorType } from '@/types/vendor'

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/modules/ui/pagination"
import { limitAmount } from '@/lib/utils/limiter'



export default function VendorsTableList({ vendors }: { vendors: VendorType[] }) {

    const { getVendor, loadMoreData, fetchingVendors, fetchVendors } = useVendors();
    const { currentCompany } = useAuth();
    return (
        <Card>
            <CardHeader className="px-7 ">
                <div className='flex w-full justify-between items-center'>
                    <div className='flex flex-col gap-2'>
                        <CardTitle>Vendors list</CardTitle>
                        <CardDescription>Listing of all the vendors</CardDescription>
                    </div>
                    <Button className='flex gap-2 p-x4 py-2'
                        onClick={() => {
                            if (currentCompany) getVendor({ companyId: currentCompany?.companyId });
                        }}
                    >
                        <AddSVG />
                        <LanguageTranslator>
                            Refetch
                        </LanguageTranslator>
                    </Button>
                </div>

            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tin Number</TableHead>
                            <TableHead className="sm:table-cell text-center">Company Name</TableHead>
                            <TableHead className="hidden sm:table-cell text-center">Seller Name</TableHead>
                            <TableHead className="hidden md:table-cell text-center">City</TableHead>
                            <TableHead className="hidden md:table-cell text-center">vatNumber</TableHead>
                            <TableHead className="hidden md:table-cell text-right">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vendors.map((data, index) => {
                            return <TableRow
                                key={index}
                                className="bg-accent">
                                <TableCell>
                                    <div className="font-medium">
                                        {data.profile && data.profile.tinNumber ? data.profile.tinNumber : "---"}
                                    </div>
                                </TableCell>
                                <TableCell className="table-cell text-center">
                                    {data.profile && data.profile.companyName ? data.profile.companyName : "---"}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-center">
                                    {data.profile && data.profile.name ? data.profile.name : "---"}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-center">
                                    {data.profile && data.profile.address && data.profile.address.city ? data.profile.address.city : "---"}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-center">
                                    {data.profile && data.profile.vatNumber ? data.profile.vatNumber : "---"}
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-right ">
                                    {data.createdAt && data.createdAt.toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })}
                                </TableCell>
                            </TableRow>
                        })}


                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                <div className='w-full flex justify-center'>
                    {loadMoreData && <div className='w-full flex justify-center'>
                        <Button
                            disabled={fetchingVendors}
                            variant={"outline"}
                            className='px-5 py-2'
                            onClick={() => {
                                if (currentCompany)
                                    fetchVendors({ companyId: currentCompany?.companyId });
                            }}>

                            {fetchingVendors && <div className='animate-spin '>
                                <LoadingSVG className="h-5 w-5 stroke-[1]" />
                            </div>}
                            Load More
                        </Button>
                    </div>}
                </div>
            </CardFooter>
        </Card>
    )
}
