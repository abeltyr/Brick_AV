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
import React, { useEffect, useState } from 'react'

export const ProductDrawerTable = ({
    setIsAddingProduct,
    updateProduct
}: {
    setIsAddingProduct: (value: boolean) => void
    updateProduct: (product: ProductType[]) => void
}) => {

    const { getProduct, products, loadMoreData, fetchingProducts, fetchProducts, initialLoading } = useProducts();
    const { setPurchaseProductListingDrawer } = useDrawerManager();
    const { currentCompany } = useAuth();

    const [searchTerm, setSearchTerm] = useState("")
    const [currentProducts, setCurrentProducts] = useState<ProductType[] | null>()
    const [finalProducts, setFinalProducts] = useState<ProductType[] | null>()



    useEffect(() => {
        if (currentCompany && currentCompany.companyId) {
            if (products[currentCompany.companyId]) {
                setFinalProducts(products[currentCompany.companyId])
            }
        }
    }, [products])

    useEffect(() => {
        if (currentCompany && currentCompany.companyId) {
            if (!products[currentCompany.companyId])
                getProduct({ companyId: currentCompany.companyId })

            if (products[currentCompany.companyId]) {
                setCurrentProducts(products[currentCompany.companyId])
            }
        }

    }, [currentCompany, getProduct, products])




    const [selectedProduct, setSelectedProduct] = useState<ProductType[]>([])


    return (

        <div className='space-y-4 w-full h-full relative pb-16 p-6 flex flex-col'>
            <div className="flex justify-between items-center gap-4">
                <Input
                    placeholder="Search Products..."
                    value={searchTerm}
                    onChange={(e) => {
                        const searchWord = e.target.value;
                        setSearchTerm(searchWord)

                        if (searchWord.length > 0 && finalProducts) {
                            const localResults = finalProducts.filter((product) => {
                                return (
                                    product.name.toLowerCase().includes(searchWord.toLowerCase()) ||
                                    product.description?.toLowerCase().includes(searchWord.toLowerCase()) ||
                                    product.productCode?.toLowerCase().includes(searchWord.toLowerCase())
                                )
                            })
                            setCurrentProducts(localResults)

                        } else if (currentCompany)
                            setCurrentProducts(products[currentCompany.companyId])
                    }}
                    className="min-w-64 pr-8 flex-1 px-4 py-3 focus:ring-0 focus:outline-none focus:border-0
                      ring-0 text-sm font-light placeholder:text-neutral-400"
                />
                <Button onClick={() => setIsAddingProduct(true)}>
                    <CirclePlus className="mr-2 h-4 w-4" />
                    Add Product
                </Button>
            </div>
            {
                currentProducts && currentProducts.length > 0
                    // false
                    ? (<Card className="flex flex-col flex-1 relative w-full overflow-auto gap-6" >
                        <CardContent className='p-0'>
                            <Table >
                                <TableHeader >
                                    <TableRow>
                                        <TableHead className="w-[40px] text-left">Select</TableHead>
                                        <TableHead className=" text-center">Name</TableHead>
                                        <TableHead className=" text-center">Product Code</TableHead>
                                        <TableHead className=" text-center">Unit</TableHead>
                                        <TableHead className=" text-center">Unit Price</TableHead>
                                        <TableHead className="hidden md:table-cell text-center">Type</TableHead>
                                        <TableHead className="hidden sm:table-cell text-center">Purchase Type</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody >
                                    {currentProducts.map((product) => {

                                        let purchaseType = "---"
                                        if (product && product.purchaseType) {
                                            const index = purchaseTypeConvertor(product.purchaseType);
                                            if (index && purchaseInputType[index - 1]) {
                                                purchaseType = purchaseInputType[index - 1].data
                                            } else {
                                                purchaseType = product.purchaseType
                                            }
                                        }

                                        return <TableRow key={product.id}>
                                            <TableCell className="table-cell text-left">
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
                                            <TableCell className="table-cell text-center">
                                                {product.productCode ? product.productCode : "---"}
                                            </TableCell>
                                            <TableCell className="table-cell text-center">
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
                                                {purchaseType}
                                            </TableCell>
                                        </TableRow>
                                    }
                                    )
                                    }
                                </TableBody>
                            </Table>
                        </CardContent>
                        {loadMoreData && <CardFooter>
                            <div className='w-full flex justify-center'>
                                <div className='w-full flex justify-center'>
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
                                </div>
                            </div>
                        </CardFooter>}
                    </Card>) :
                    <Card className='min-h-[600px] w-full flex justify-center items-center'>
                        {initialLoading ?
                            <div className='animate-bounce'>
                                Searching...
                            </div> :
                            "No results found"
                        }
                    </Card>
            }
            <DrawerSheetFooter
                isLoading={false}
                createSVG={<AddSVG />}
                create='Insert'
                disabled={selectedProduct.length <= 0}
                createFunction={() => {
                    if (selectedProduct) {
                        updateProduct(selectedProduct)
                        setPurchaseProductListingDrawer(false);
                    }
                }}
            />
        </div>
    )
}
