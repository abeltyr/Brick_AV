

import { z } from 'zod';

export const profileSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    phoneNumber: z.string().optional(),
    gender: z.enum(['male', 'female']).default("male"),
    dateOfBirth: z.date(),
})
