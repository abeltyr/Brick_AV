

import { z } from 'zod';

export const addressSchema = z.object({
    region: z.string().min(1, 'Region is required'),
    zone: z.string().optional(),
    woreda: z.string().min(1, 'Woreda is required'),
    kebele: z.string().optional(),
    houseNumber: z.string().optional(),
    description: z.string().optional(),
})