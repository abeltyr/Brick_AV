import { z } from 'zod';
import { zVendorInputTaxType } from '../product';

export const vendorSchema = z.object({
    isRegistered: z.enum(['yes', 'no']),
    tin: z.string().optional(),
    name: z.string().min(1, 'Provide a valid vendor name'),
    description: z.string().optional(),
    email: z.string().email().optional(),
    taxType: zVendorInputTaxType,
    phoneNumber: z.string()
        .regex(/^(9|7)\d{8}$/, 'Invalid Ethiopian phone number')
        .or(z.literal('').optional())
        .optional(),
    vat: z.string().optional(),
}).refine((data) => {
    if (data.isRegistered === 'yes') {
        return data.tin && data.tin.length === 10;
    }
    return true;
}, {
    message: "TIN number is required for registered businesses",
    path: ['tin']
})