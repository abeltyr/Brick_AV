

import { z } from 'zod';

export const addressSchema = z.object({
    region: z.string().min(1, 'Region is required'),
    zone: z.string().min(1, 'Zone is required'),
    woreda: z.string().min(1, 'Woreda is required'),
    kebele: z.string().min(1, 'Kebele is required'),
    houseNumber: z.string().min(1, 'House number is required'),
    description: z.string()
})