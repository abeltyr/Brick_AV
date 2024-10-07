import { z } from "zod";
import { isBefore, isEqual, addDays } from "date-fns";

// Define a date range schema
const dateRangeSchema = z.object({
    start: z.date(),
    end: z.date(),
}).refine((data) => isBefore(data.start, data.end), {
    message: "Start date must be before end date",
});

// Define the accounting period schema
const accountingPeriodSchema = z.array(dateRangeSchema).refine((periods) => {
    for (let i = 0; i < periods.length - 1; i++) {
        const currentPeriod = periods[i];
        const nextPeriod = periods[i + 1];

        console.log(addDays(currentPeriod.end, 1), nextPeriod.start, isEqual(addDays(currentPeriod.end, 1), nextPeriod.start), i, periods.length);

        // Ensure no gap or overlap between periods
        if (!isEqual(addDays(currentPeriod.end, 1), nextPeriod.start)) {
            console.log(
                "HERe",
                addDays(currentPeriod.end, 1), nextPeriod.start, isEqual(addDays(currentPeriod.end, 1), nextPeriod.start),
                i,
                periods.length
            );
            return false;
        }
    }
    return true;
}, {
    message: "Accounting periods cannot overlap or have gaps",
});

// Define the overall schema for the year and periods
const yearSchema = z.object({
    startDate: z.date(),
    endDate: z.date(),
    periods: accountingPeriodSchema,
}).refine((data) => {
    const { startDate, endDate, periods } = data;

    const firstPeriod = periods[0];
    const lastPeriod = periods[periods.length - 1];

    // Ensure the first period starts on the year start date and the last period ends on the year end date
    return (
        isEqual(firstPeriod.start, startDate) &&
        isEqual(lastPeriod.end, endDate)
    );
}, {
    message: "Accounting periods must cover the entire range between startDate and endDate",
});

export default yearSchema;