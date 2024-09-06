import { z } from 'zod';

export const vendorFormSchema = z.object({
    tinNumber: z.string().min(10, {
        message: "Please Provide a valid TIN number. ",
    }),
    name: z.string().optional(),
    companyName: z.string().optional(),
    vatNumber: z.string().optional(),
    email: z.string().email({
        message: "Please provided a valid email.",
    }).optional(),
    phoneNumber: z.string().optional(),
    region: z.string().optional(),
    city: z.string().optional(),
    woreda: z.string().optional(),
    houseNumber: z.string().optional(),
    description: z.string().optional(),
})

