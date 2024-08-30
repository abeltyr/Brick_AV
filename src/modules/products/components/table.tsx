"use client"

import AddSVG from '@/assets/icons/add'
import LoadingSVG from '@/assets/icons/loading'
import { useAuth } from '@/lib/context/auth/user'
import { useProducts } from '@/lib/context/product'
import { LanguageTranslator } from '@/modules/language/components'
import { Badge } from '@/modules/ui/badge'
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
import { ProductType } from '@/types/product'



export default function ProductsTableList({ companyId }: { companyId: string }) {

    const { getProduct, loadMoreData, fetchingProducts, fetchProducts, products } = useProducts();
    const { currentCompany } = useAuth();
    return (
        <Card>
            <CardHeader className="px-7 ">
                <div className='flex w-full justify-between items-center'>
                    <div className='flex flex-col gap-2'>
                        <CardTitle>Products list</CardTitle>
                        <CardDescription>Listing of all the products</CardDescription>
                    </div>
                    <Button className='flex gap-2 p-x4 py-2'
                        onClick={() => {
                            if (currentCompany) getProduct({ companyId: currentCompany?.companyId });
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
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden md:table-cell text-center">Type</TableHead>
                            <TableHead className="hidden md:table-cell text-center">Purchase Type</TableHead>
                            <TableHead className="table-cell text-center">Unit</TableHead>
                            <TableHead className="table-cell text-center">Unit Price</TableHead>
                            <TableHead className="hidden md:table-cell text-center">Inventory</TableHead>
                            <TableHead className="hidden md:table-cell text-center">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products[companyId] && products[companyId].map((product, index) => {
                            console.log("Inventory", product.Inventory)
                            return <TableRow
                                key={index}
                                className="bg-accent">
                                <TableCell>
                                    <div className="font-medium">
                                        {product && product.name ? product.name : "---"}
                                    </div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-center">
                                    <Badge>
                                        {product && product.type ? product.type : "---"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-center">
                                    {product && product.purchaseType ? product.purchaseType : "---"}
                                </TableCell>
                                <TableCell className="table-cell text-center">
                                    {product && product.ProductPrice && product.ProductPrice.unit ? product.ProductPrice.unit : "---"}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-center">
                                    {product && product.ProductPrice && product.ProductPrice.unitPrice ? `${product.ProductPrice.unitPrice}` : "---"}
                                </TableCell>

                                <TableCell className="hidden md:table-cell text-center ">
                                    {product && product.Inventory ? `${product.Inventory.quantity}` : "---"}
                                </TableCell>

                                <TableCell className="hidden md:table-cell text-center ">
                                    {product && product.createdAt ? `${product.createdAt.toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })}` : "---"}
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
                            disabled={fetchingProducts}
                            variant={"outline"}
                            className='px-5 py-2'
                            onClick={() => {
                                if (currentCompany)
                                    fetchProducts({ companyId: currentCompany?.companyId });
                            }}>

                            {fetchingProducts && <div className='animate-spin '>
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
