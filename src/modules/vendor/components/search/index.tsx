"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/modules/ui/input"
import { Button } from "@/modules/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/ui/popover"
import { Label } from "@/modules/ui/label"
import { Calendar } from "@/modules/ui/calendar"
import { CalendarIcon, ChevronDownIcon, Loader2, PlusIcon } from "lucide-react"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/modules/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/modules/ui/select"
import { Checkbox } from "@/modules/ui/checkbox"
import { toast } from "@/modules/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/ui/card"
import { useVendors } from '@/lib/context/vendor'
import { useAuth } from '@/lib/context/auth/user'
import { VendorType } from '@/types/vendor'
import { AddVendorSection } from '@/modules/vendor/templates/addVendor'
import { Skeleton } from '@/modules/ui/skeleton'


export const VendorListing = () => {


    const { vendors, searchVendor } = useVendors()
    const { currentCompany } = useAuth()


    const [loading, setLoading] = useState(false)


    const [currentVendors, setCurrentVendors] = useState<VendorType[] | null>()


    useEffect(() => {
        if (currentCompany && currentCompany.companyId && vendors[currentCompany.companyId]) {
            const data = vendors[currentCompany.companyId]
            setCurrentVendors(data)
        }

    }, [vendors, currentCompany])



    const [searchTerm, setSearchTerm] = useState("")

    const [isLoading, setIsLoading] = useState(false)
    const [selectedVendors, setSelectedVendors] = useState()
    const [isAddingVendor, setIsAddingVendor] = useState(false)
    const [newVendor, setNewVendor] = useState({
        item: "",
        amount: "",
        date: new Date(),
        category: ""
    })

    const searchVendors = useCallback(async (term: string) => {
        if (currentCompany) {
            setIsLoading(true)
            const results = await searchVendor({
                companyId: currentCompany?.companyId,
                keyTerm: term
            })
            setCurrentVendors(results)
            setIsLoading(false)
        }
    }, [currentCompany, searchVendor])

    // useEffect(() => {
    //     const delayDebounceFn = setTimeout(() => {
    //         if (searchTerm) {
    //             const localResults = initialVendors.filter((vendor) =>
    //                 vendor.item.toLowerCase().includes(searchTerm.toLowerCase())
    //             )
    //             if (localResults.length === 0) {
    //                 searchVendors(searchTerm)
    //             } else {
    //                 setVendors(localResults)
    //             }
    //         } else {
    //             setVendors(initialVendors)
    //         }
    //     }, 300)

    //     return () => clearTimeout(delayDebounceFn)
    // }, [searchTerm, searchVendors])


    const handleAddVendor = () => {

    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-2">Vendor History</h1>
            <p className="text-gray-600 mb-4">A detailed list of all company vendors</p>

            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-4">
                    <div className="relative">
                        <Input
                            placeholder="Search items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-64 pr-8"
                        />
                        {isLoading && (
                            <Loader2 className="animate-spin h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2" />
                        )}
                    </div>
                </div>
                <Button onClick={() => setIsAddingVendor(!isAddingVendor)}>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add Vendor
                </Button>
            </div>

            {isAddingVendor && (
                <AddVendorSection />
            )}

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">Select</TableHead>
                        <TableHead>Tin Number</TableHead>
                        <TableHead className="sm:table-cell text-center">Company Name</TableHead>
                        <TableHead className="hidden sm:table-cell text-center">Seller Name</TableHead>
                        <TableHead className="hidden md:table-cell text-center">vatNumber</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        currentVendors && currentVendors.length > 0
                            // false
                            ? (
                                currentVendors.map((vendor) => (
                                    <TableRow key={vendor.id}>
                                        <TableCell>
                                            <Checkbox
                                            // checked={selectedVendors.includes(vendor.id)}
                                            // onCheckedChange={() => handleSelectVendor(vendor.id)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">
                                                {vendor.profile && vendor.profile.tinNumber ? vendor.profile.tinNumber : "---"}
                                            </div>
                                        </TableCell>
                                        <TableCell className="table-cell text-center">
                                            {vendor.profile && vendor.profile.companyName ? vendor.profile.companyName : "---"}
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell text-center">
                                            {vendor.profile && vendor.profile.name ? vendor.profile.name : "---"}
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell text-center">
                                            {vendor.profile && vendor.profile.vatNumber ? vendor.profile.vatNumber : "---"}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow >
                                    <TableCell colSpan={5} className="text-center">
                                        <div className='min-h-[600px] flex justify-center items-center'>
                                            {isLoading ? "Searching..." : "No results found"}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                </TableBody>
            </Table>

            <div className="mt-4 flex justify-end space-x-2 absolute bottom-0">
                <Button variant="outline" onClick={() => {

                }}>Cancel</Button>
                <Button onClick={() => {

                }}>Insert</Button>
            </div>
        </div>
    )
}