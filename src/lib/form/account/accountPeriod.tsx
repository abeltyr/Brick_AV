import { z } from "zod";
import { isBefore, isEqual, isAfter } from "date-fns";

// Define a date range schema
const dateRangeSchema = z.object({
    start: z.date(),
    end: z.date(),
}).refine((data) => isBefore(data.start, data.end), {
    message: "Start date must be before end date",
});

// Define the accounting period schema
const accountingPeriodSchema = z.array(dateRangeSchema).refine((periods) => {
    // Check that the periods don't overlap
    for (let i = 0; i < periods.length - 1; i++) {
        const currentPeriod = periods[i];
        const nextPeriod = periods[i + 1];

        if (
            isAfter(nextPeriod.start, currentPeriod.end) ||
            isEqual(nextPeriod.start, currentPeriod.end)
        ) {
            continue;
        } else {
            return false;
        }
    }
    return true;
}, {
    message: "Accounting periods cannot overlap",
});

// Define the overall schema for the year and periods
const yearSchema = z.object({
    startDate: z.date(),
    endDate: z.date(),
    periods: accountingPeriodSchema,
}).refine((data) => {
    const { startDate, endDate, periods } = data;

    // Ensure that the first and last periods fit within the year range
    const firstPeriod = periods[0];
    const lastPeriod = periods[periods.length - 1];

    return (
        isAfter(firstPeriod.start, startDate) ||
        isEqual(firstPeriod.start, startDate)
    ) && (
            isBefore(lastPeriod.end, endDate) ||
            isEqual(lastPeriod.end, endDate)
        );
}, {
    message: "Accounting periods must fit within the year range",
});

export default yearSchema;