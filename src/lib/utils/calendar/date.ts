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
