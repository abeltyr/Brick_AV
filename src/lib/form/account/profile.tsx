

import { z } from 'zod';

export const profileSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address').optional(),
    phoneNumber: z.string().optional(),
    gender: z.enum(['female', 'male']),
    dateOfBirth: z.object({
        day: z.string().optional(),
        month: z.string().optional(),
        year: z.string().optional(),
    }),
    tin: z.string().optional(),
})
