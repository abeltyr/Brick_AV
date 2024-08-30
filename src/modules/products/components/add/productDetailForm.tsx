
import { LanguageTranslator } from '@/modules/language/components'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/modules/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/modules/ui/form'
import { Input } from "@/modules/ui/input"
import { Textarea } from '@/modules/ui/textarea'



export default function ProductDetailForm({ form }: { form: any }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <LanguageTranslator>
                        Product Detail
                    </LanguageTranslator>
                </CardTitle>
                <CardDescription>
                    <LanguageTranslator>
                        Provided the needed Product Detail
                    </LanguageTranslator>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6">
                    <div className="gap-3">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-sm'>
                                        <LanguageTranslator>
                                            Name
                                        </LanguageTranslator></FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Product Name" {...field} className='px-4 py-3 focus:ring-0 focus:outline-none focus:border-0
                      ring-0 text-sm font-light placeholder:text-neutral-400' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="gap-3">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-sm'>
                                        <LanguageTranslator>
                                            Product Description
                                        </LanguageTranslator></FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            id="description"
                                            placeholder="A Case Of Pencil"
                                            className="min-h-32"
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
