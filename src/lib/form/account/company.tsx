import { z } from 'zod';


export const companyInTakeSchema = z.object({
    companyName: z.string().min(1, 'Company name is required'),
    tin: z.string().min(10, 'TIN number is required'),
})

export const companySchema = z.object({
    managerName: z.string().min(1, 'Manager Name is required'),
    companyPhone: z.string().min(1, 'Company Phone is required'),
    companyPhoneAlternative: z.string().optional(),
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