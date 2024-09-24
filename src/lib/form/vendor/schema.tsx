import { z } from 'zod';

export const vendorSchema = z.object({
    name: z.string().min(1, 'Company name is required'),
    description: z.string().optional(),
    isRegistered: z.enum(['yes', 'no']),
    tin: z.string().optional(),
    vat: z.string().optional(),
    sellerName: z.string().optional(),
}).refine((data) => {
    if (data.isRegistered === 'yes') {
        return data.tin && data.tin.length === 10;
    }
    return true;
}, {
    message: "TIN number is required for registered businesses",
    path: ['tinNumber']
}).refine((data) => {
    if (data.isRegistered === 'no') {
        return data.sellerName && data.sellerName.length > 2;
    }
    return true;
}, {
    message: "Seller Name is required for unregistered businesses",
    path: ['sellerName']
});

