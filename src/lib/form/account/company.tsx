

import { z } from 'zod';
import { profileSchema } from './profile';
import { addressSchema } from './address';


export const companyInTakeSchema = z.object({
    companyName: z.string().min(1, 'Company name is required'),
    isRegistered: z.enum(['yes', 'no']),
    tinNumber: z.string().optional()
}).refine((data) => {
    if (data.isRegistered === 'yes') {
        return data.tinNumber && data.tinNumber.length > 0;
    }
    return true;
}, {
    message: "TIN number is required for registered businesses",
    path: ['tinNumber']
});


export const companySchema = z.object({
    managerName: z.string().min(1, 'Manager Name is required'),
    companyPhone: z.string().min(1, 'Company Phone is required'),
    companyPhoneAlternative: z.string().optional(),
})


export const ownerSchema = z.object({
    role: z.enum(['owner', 'accountant', 'other']),
    detail: z.string().optional(),
    profile: profileSchema.optional(),
}).refine((data) => {
    if (data.role === 'other') {
        return data.detail && data.detail.length > 0;
    }
    return true;
}, {
    message: "Please provided a role name",
    path: ['detail']
}).refine((data) => {
    if (data.role !== 'owner') {
        return data.profile !== undefined;
    }
    return true;
}, {
    message: "Need to create the owner profile here",
    path: ['profile']
});