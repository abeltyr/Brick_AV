import AddSVG from '@/assets/icons/add'
import LoadingSVG from '@/assets/icons/loading'
import { useAuth } from '@/lib/context/auth/user'
import { useDrawerManager } from '@/lib/context/drawer/drawer'
import { useProducts } from '@/lib/context/product'
import { DrawerSheetFooter } from '@/modules/common/components/drawer/footer'
import { Badge } from '@/modules/ui/badge'
import { Button } from '@/modules/ui/button'
import { Card, CardContent, CardFooter } from '@/modules/ui/card'
import { Checkbox } from '@/modules/ui/checkbox'
import { Input } from '@/modules/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/modules/ui/table'
import { ProductType, purchaseInputType, purchaseTypeConvertor } from '@/types/product'
import { CirclePlus } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'

export const ProductDrawerTable = ({
    setIsAddingProduct,
    updateProduct
}: {
    setIsAddingProduct: (value: boolean) => void
    updateProduct: (product: ProductType[]) => void
}) => {

    const { getProduct, products, loadMoreData, fetchingProducts, fetchProducts, initialLoading } = useProducts();
    const { currentCompany } = useAuth();

    const [searchTerm, setSearchTerm] = useState("")
    const [currentProducts, setCurrentProducts] = useState<ProductType[] | null>()

    const { setPurchaseProductListingDrawer } = useDrawerManager();
    useEffect(() => {
        if (currentCompany) {
            if (!products[currentCompany.companyId])
                getProduct({ companyId: currentCompany.companyId })
        }
    }, [currentCompany, getProduct, products])

    useEffect(() => {
        if (currentCompany && currentCompany.companyId && products[currentCompany.companyId] && !searchTerm) {
            const data = products[currentCompany.companyId]
            setCurrentProducts(data)
        }

    }, [products, currentCompany, searchTerm])

    const [loading, setLoading] = useState(initialLoading)


    const [isLoading, setIsLoading] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<ProductType[]>([])

    useEffect(() => {
        if (searchTerm && currentProducts) {
            const localResults = currentProducts.filter((product) => {
                return (
                    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
                )
            }
            )
            if (localResults.length === 0) {
                // searchProducts(searchTerm)
            } else {
                setCurrentProducts(localResults)
            }
        } else if (currentCompany)
            setCurrentProducts(products[currentCompany.companyId])

    }, [currentCompany, currentProducts, products, searchTerm])


    return (

        <div className='space-y-2 w-full h-full relative pb-20 p-6'>
            <div className="flex justify-between items-center gap-4">
                <Input
                    placeholder="Search Products..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value)
                    }}
                    className="min-w-64 pr-8 flex-1 px-4 py-3 focus:ring-0 focus:outline-none focus:border-0
                      ring-0 text-sm font-light placeholder:text-neutral-400"
                />
                <Button onClick={() => setIsAddingProduct(true)}>
                    <CirclePlus className="mr-2 h-4 w-4" />
                    Add Product
                </Button>
            </div>
            <Card className="flex flex-col flex-1 relative w-full h-full gap-6 overflow-y-auto pb-10" >
                <CardContent >
                    <Table >
                        <TableHeader >
                            <TableRow>
                                <TableHead className="w-[50px]">Select</TableHead>
                                <TableHead className=" text-center">Name</TableHead>
                                <TableHead>Unit</TableHead>
                                <TableHead>Unit Price</TableHead>
                                <TableHead className="hidden md:table-cell text-center">Type</TableHead>
                                <TableHead className="hidden sm:table-cell text-center">Purchase Type</TableHead>

                            </TableRow>
                        </TableHeader>
                        <TableBody >
                            {
                                currentProducts && currentProducts.length > 0
                                    ? (
                                        currentProducts.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedProduct.includes(product)}
                                                        onCheckedChange={() => {
                                                            setSelectedProduct((prev) =>
                                                                prev.includes(product)
                                                                    ? prev.filter((prevData) => prevData.id !== product.id)
                                                                    : [...prev, product]
                                                            )

                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell className="table-cell text-center">
                                                    {product.name ? product.name : "---"}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">
                                                        {product.ProductPrice && product.ProductPrice.unit ? product.ProductPrice.unit : "---"}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell text-center">
                                                    {product.ProductPrice && product.ProductPrice.unitPrice ? product.ProductPrice.unitPrice.toString() : "---"}
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell text-center">
                                                    <Badge>
                                                        {product.type ? product.type : "---"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="table-cell text-center">
                                                    {product.purchaseType ? purchaseInputType[purchaseTypeConvertor(product.purchaseType)].data : "---"}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow >
                                            <TableCell colSpan={5} className="text-center">
                                                <div className='min-h-[600px] flex justify-center items-center'>
                                                    {loading ? "Searching..." : "No results found"}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
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
            <DrawerSheetFooter
                isLoading={false}
                createSVG={<AddSVG />}
                create='Insert'
                disabled={selectedProduct === null}
                createFunction={() => {
                    if (selectedProduct) {
                        setPurchaseProductListingDrawer(false);
                        updateProduct(selectedProduct)
                    }
                }}
            />
        </div>
    )
}
