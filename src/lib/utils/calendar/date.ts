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

export const months = [
  { full: "January", abbreviate: "Jan" },
  { full: "February", abbreviate: "Feb" },
  { full: "March", abbreviate: "Mar" },
  { full: "April", abbreviate: "Apr" },
  { full: "May", abbreviate: "May" },
  { full: "June", abbreviate: "Jun" },
  { full: "July", abbreviate: "Jul" },
  { full: "August", abbreviate: "Aug" },
  { full: "September", abbreviate: "Sep" },
  { full: "October", abbreviate: "Oct" },
  { full: "November", abbreviate: "Nov" },
  { full: "December", abbreviate: "Dec" },
];

export const ethiopianMonths = [
  {
    fullEnglish: "Meskerem",
    fullAmharic: "መስከረም",
    abbreviateEnglish: "Mes",
    abbreviateAmharic: "መስ",
  },
  {
    fullEnglish: "Tikimt",
    fullAmharic: "ጥቅምት",
    abbreviateEnglish: "Tik",
    abbreviateAmharic: "ጥን",
  },
  {
    fullEnglish: "Hidar",
    fullAmharic: "ህዳር",
    abbreviateEnglish: "Hid",
    abbreviateAmharic: "ህድ",
  },
  {
    fullEnglish: "Tahsas",
    fullAmharic: "ታህሳስ",
    abbreviateEnglish: "Tah",
    abbreviateAmharic: "ታህ",
  },
  {
    fullEnglish: "Tir",
    fullAmharic: "ጥር",
    abbreviateEnglish: "Tir",
    abbreviateAmharic: "ጥር",
  },
  {
    fullEnglish: "Yekatit",
    fullAmharic: "የካቲት",
    abbreviateEnglish: "Yek",
    abbreviateAmharic: "የካ",
  },
  {
    fullEnglish: "Megabit",
    fullAmharic: "መጋቢት",
    abbreviateEnglish: "Meg",
    abbreviateAmharic: "መጋ",
  },
  {
    fullEnglish: "Miyazya",
    fullAmharic: "ሚያዝያ",
    abbreviateEnglish: "Miy",
    abbreviateAmharic: "ሚያ",
  },
  {
    fullEnglish: "Ginbot",
    fullAmharic: "ግንቦት",
    abbreviateEnglish: "Gin",
    abbreviateAmharic: "ግን",
  },
  {
    fullEnglish: "Sene",
    fullAmharic: "ሰኔ",
    abbreviateEnglish: "Sen",
    abbreviateAmharic: "ሰኔ",
  },
  {
    fullEnglish: "Hamle",
    fullAmharic: "ሐምሌ",
    abbreviateEnglish: "Ham",
    abbreviateAmharic: "ሐም",
  },
  {
    fullEnglish: "Nehase",
    fullAmharic: "ነሐሴ",
    abbreviateEnglish: "Neh",
    abbreviateAmharic: "ነሐ",
  },
  {
    fullEnglish: "Pagumē",
    fullAmharic: "ጳጉሜ",
    abbreviateEnglish: "Pag",
    abbreviateAmharic: "ጳጉ",
  },
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
  // Ensure the start date is before the end date
  if (startDate > endDate) {
    [startDate, endDate] = [endDate, startDate];
  }

  // Check if the current date is within the range
  if (date < startDate || date > endDate) {
    throw new Error("Current date is outside the specified range");
  }

  // Calculate the total number of weeks between start and end dates
  const totalWeeks = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000),
  );

  // Calculate the number of weeks from the start date to the current date
  const weeksSinceStart = Math.floor(
    (date.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000),
  );

  // The week interval is 1-based, so we add 1 to the result
  return weeksSinceStart;
};
