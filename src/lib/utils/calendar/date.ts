import { DateRangeType } from "@/types/shared";

export const secondsInADay = 24 * 60 * 60; // seconds in a day (86400)
export const secondsInAWeek = secondsInADay * 7; // seconds in a week
export const secondsInAMonth = secondsInADay * 30; // approximate seconds in a month (30 days)
export const secondsInThreeMonths = secondsInAMonth * 3; // approximate seconds in 3 months
export const secondsInAYear = secondsInADay * 365; // seconds in a year (365 days)

export const dateRanges = [
  "Today",
  "Last 7 days",
  "Last 4 weeks",
  "Last 3 months",
  "Last 12 months",
  "Month to date",
  "Quarter to date",
  "Year to date",
  "All time",
];

export const defaultDateRange: DateRangeType = {
  startDate: new Date(new Date().getTime() - secondsInAWeek * 1000),
  endDate: new Date(),
  name: "Weekly",
};

export const getWeekOrder = ({
  date,
  startDate,
  endDate,
}: {
  date: Date;
  startDate: Date;
  endDate: Date;
}): number => {
  // Validate input: Ensure startDate is before endDate
  if (startDate.getTime() >= endDate.getTime()) {
    throw new Error("Invalid input: startDate must be before endDate.");
  }

  // Validate input: Ensure date is within the range
  if (
    date.getTime() < startDate.getTime() ||
    date.getTime() > endDate.getTime()
  ) {
    throw new Error("Invalid input: date is outside the given account period.");
  }

  // Calculate the quarter the date falls into
  const totalMilliseconds = endDate.getTime() - startDate.getTime();
  const millisecondsFromStart = date.getTime() - startDate.getTime();
  const quarter = Math.ceil((millisecondsFromStart / totalMilliseconds) * 4);

  // Ensure the result is within the valid range (1-4)
  return Math.min(Math.max(quarter, 1), 4);
};
