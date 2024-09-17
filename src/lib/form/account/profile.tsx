

import { z } from 'zod';

export const profileSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    phoneNumber: z.string().min(1, 'Phone number is required'),
    gender: z.enum(['female', 'male']),
    dateOfBirth: z.object({
        day: z.string().min(1, 'Day is required'),
        month: z.string().min(1, 'Month is required'),
        year: z.string().min(1, 'Year is required'),
    }),
    tinNumber: z.string().optional(),
})
