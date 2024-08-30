"use client"

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

export default function ProfileForm({ form }: { form: any }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <LanguageTranslator>
                        Vendor Details
                    </LanguageTranslator>
                </CardTitle>
                <CardDescription>
                    <LanguageTranslator>
                        Provided Some of the needed Vendor Detail, Only Tin Number is required
                    </LanguageTranslator>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6">
                    <div className=" gap-3">
                        <FormField
                            control={form.control}
                            name="tinNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-sm'>
                                        <LanguageTranslator>
                                            TIN Number *
                                        </LanguageTranslator></FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Seller TIN Number" {...field} className='px-4 py-3 focus:ring-0 focus:outline-none focus:border-0
                      ring-0 text-sm font-light placeholder:text-neutral-400' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className=" gap-3">
                        <FormField
                            control={form.control}
                            name="vatNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-sm'>
                                        <LanguageTranslator>
                                            Vat Number
                                        </LanguageTranslator></FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Seller Vat Number" {...field} className='px-4 py-3 focus:ring-0 focus:outline-none focus:border-0
                      ring-0 text-sm font-light placeholder:text-neutral-400' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className=" gap-3 flex justify-between">

                        <div className="flex-1">
                            <FormField
                                control={form.control}
                                name="companyName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-sm'>
                                            <LanguageTranslator>
                                                Company Name
                                            </LanguageTranslator></FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Organization Name" {...field} className='px-4 py-3 focus:ring-0 focus:outline-none focus:border-0
                      ring-0 text-sm font-light placeholder:text-neutral-400' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex-1">
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
                                            <Input type="text" placeholder="Seller Name" {...field} className='px-4 py-3 focus:ring-0 focus:outline-none focus:border-0
                      ring-0 text-sm font-light placeholder:text-neutral-400' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className=" gap-3 flex justify-between">
                        <div className="flex-1">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-sm'>
                                            <LanguageTranslator>
                                                Email
                                            </LanguageTranslator></FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Email" {...field} className='px-4 py-3 focus:ring-0 focus:outline-none focus:border-0
                      ring-0 text-sm font-light placeholder:text-neutral-400' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex-1">
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-sm'>
                                            <LanguageTranslator>
                                                Phone Number
                                            </LanguageTranslator></FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Phone Number" {...field} className='px-4 py-3 focus:ring-0 focus:outline-none focus:border-0
                      ring-0 text-sm font-light placeholder:text-neutral-400' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
