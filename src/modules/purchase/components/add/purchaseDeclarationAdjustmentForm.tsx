
import { LanguageTranslator } from '@/modules/language/components'
import { productInputType, productInputUnit, purchaseInputType } from '@/lib/form/product/data'
import { SelectInput } from '@/modules/common/components/input/select'
import { useAddPurchases } from '@/lib/context/purchase/addPurchase'
import { NormalInput } from '@/modules/common/components/input/normal'
import { Button } from '@/modules/ui/button'
import { NormalTextAreaInput } from '@/modules/common/components/input/textArea'



export default function PurchaseGebiwochReportForm() {

    const { form, totalQuantity, taxableAmount } = useAddPurchases();

    return (
        <div className={`w-full px-6 flex flex-col gap-8`}>

            <div>
                <p className='text-2xl font-bold'>
                    <LanguageTranslator>
                        Gebiwoch Report Data
                    </LanguageTranslator>
                </p>
                <p className='text-sm font-light text-[#71717A]'>
                    <LanguageTranslator>
                        This is the data that will be setup on the gebiwoch csv export data
                    </LanguageTranslator>
                </p>
            </div>
            <div>
                <div className="grid gap-6">
                    <div className=" gap-3 flex justify-between">
                        <div className="flex-1">
                            <SelectInput
                                form={form}
                                name={`gebiwoch.purchaseType`}
                                selectTitle={{
                                    name: "Purchase Type",
                                    value: "PurchaseType"
                                }}
                                values={[...purchaseInputType]}
                                title='Purchase Type'
                            />
                        </div>
                        <div className="flex-1">
                            <SelectInput
                                form={form}
                                name={`gebiwoch.productCategoryType`}
                                selectTitle={{
                                    name: "Product Type",
                                    value: "ProductType"
                                }}
                                values={[...productInputType]}
                                title='Product Type'
                            />
                        </div>
                    </div>
                    <div className=" gap-3 flex justify-between">
                        <div className="flex-1">
                            <SelectInput
                                form={form}
                                name={"gebiwoch.unit"}
                                selectTitle={{
                                    name: "Product Unit",
                                    value: "ProductUnit"
                                }}
                                values={[...productInputUnit]}
                                title='Product Unit'
                            />
                        </div>
                        <div className="flex-1">
                            <div className=" gap-3 flex justify-between">
                                <div className='flex flex-col gap-3 flex-1'>
                                    <p className='text-sm font-medium'>
                                        Quantity
                                    </p>
                                    <Button variant={"outline"} disabled className="flex-1 flex justify-start">
                                        {totalQuantity}
                                    </Button>
                                </div>
                                <div className='flex flex-col gap-3 flex-1'>
                                    <p className='text-sm font-medium'>
                                        Unit Price
                                    </p>
                                    <Button variant={"outline"} disabled className="flex-1 flex justify-start">
                                        {taxableAmount.toNumber().toLocaleString('en-US')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <NormalTextAreaInput
                        form={form}
                        name="gebiwoch.description"
                        title='Purchase Description'
                        placeholder="Description to be added to purchase on the report"
                        disabled={false}
                    />


                </div>
            </div>
        </div>
    )
}
