import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { NormalInput } from '../input/normal'
import { NormalTextAreaInput } from '../input/textArea'
import { productInputType, productInputUnit, productSchema, purchaseInputType } from '@/lib/form/product'
import { SelectInput } from '../input/select'
import { PriceInput } from '../input/price'
import { ChartOfAccountInput } from '../input/coa'
import { useCompany } from '@/lib/context/account'


export const GeneralProductForm = ({ form, readOnlyValues = [] }: { form: UseFormReturn<z.infer<typeof productSchema>>, readOnlyValues?: string[] }) => {

    const { currentCompany } = useCompany()

    return (
        <div className='flex flex-col gap-5'>

            <div className="flex-1 min-w-[200px]">
                <NormalInput
                    form={form}
                    name='name'
                    title="Item Name"
                    type='text'
                    disabled={readOnlyValues.includes("fullName")}
                    placeholder="Item Name"
                />
            </div>

            <NormalTextAreaInput
                form={form}
                name='description'
                title='Item Description'
                placeholder="A Description  of the items, such as 'A Case Of Pencil'"
                disabled={readOnlyValues.includes("description")}
            />

            <div className='flex flex-wrap gap-3 justify-between'>
                <div className="flex-1 min-w-1/2">
                    <SelectInput
                        form={form}
                        name='purchaseType'
                        title='Purchase Type'
                        selectTitle={{
                            name: "Purchase Type",
                            value: "PurchaseType"
                        }}
                        values={[...purchaseInputType]}
                    />
                </div>
                <div className="flex-1 min-w-1/2">
                    <SelectInput
                        form={form}
                        name='type'
                        title='Product Type'
                        selectTitle={{
                            name: "Product Type",
                            value: "ProductType"
                        }}
                        values={[...productInputType]}
                    />
                </div>
            </div>
            <div className='flex flex-wrap gap-3 justify-between'>
                <div className="flex-1 min-w-1/2">
                    <SelectInput
                        form={form}
                        name='unit'
                        title='Product Unit'
                        selectTitle={{
                            name: "Product Unit",
                            value: "ProductUnit"
                        }}
                        values={[...productInputUnit]}
                    />
                </div>
                <div className="flex-1 min-w-1/2">
                    <PriceInput
                        form={form}
                        name='unitPrice'
                        title='Unit Price'
                        disabled={readOnlyValues.includes("unitPrice")}
                        placeholder="Item unit price"
                    />
                </div>
            </div>

            {currentCompany &&
                <ChartOfAccountInput companyId={currentCompany.companyId} className='' />
            }




        </div >
    )
}
