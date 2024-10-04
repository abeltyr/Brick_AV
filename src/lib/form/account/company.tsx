import { isBefore } from 'date-fns';
import { z } from 'zod';


export const companyInTakeSchema = z.object({
    companyName: z.string().min(1, 'Company name is required'),
    tin: z.string().min(10, 'TIN number is required'),
})

export const companySchema = z.object({
    managerName: z.string().min(1, 'Manager Name is required'),
    email: z.string().email().optional(),
    companyPhone: z.string().min(1, 'Company Phone is required'),
    taxType: z.enum(['VAT', 'TOT', "NONE"]),
})


export const ownerSchema = z.object({
    role: z.enum(['owner', 'accountant', 'other']),
    detail: z.string().optional()
}).refine((data) => {
    if (data.role === 'other') {
        return data.detail && data.detail.length > 0;
    }
    return true;
}, {
    message: "Please provided a role name",
    path: ['detail']
})


export const FiscalYear = z.object({
    start: z.date(),
    end: z.date(),
}).refine((data) => isBefore(data.start, data.end), {
    message: "Start date must be before end date",
});