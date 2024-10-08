import { differenceInMonths, isBefore } from 'date-fns';
import { z } from 'zod';



export const purchaseExportCSVSchema = z.object({
    start: z.date(),
    end: z.date(),
    exportType: z.enum(["WITHHOLDING_ETAX", "PURCHASE_ETAX", "PURCHASE_TASS", "PURCHASE_LTO"]),
}).refine((data) => isBefore(data.start, data.end), {
    message: "Start date must be before end date",
    path: ['start']
}).refine((data) => differenceInMonths(data.end, data.start) <= 2, {
    message: "Date range cannot exceed 2 months",
    path: ['start']
}).refine((data) => isBefore(data.end, new Date()), {
    message: "End date cannot be in the future",
    path: ['end']
},);