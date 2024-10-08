import { toEthiopian } from ".";

export const monthYearGetter = async (dateValue: Date) => {
  const ethioDate = toEthiopian({
    date: new Date(dateValue).getDate(),
    month: new Date(dateValue).getMonth() + 1,
    year: new Date(dateValue).getFullYear(),
  });

  if (!ethioDate) throw new Error("date is wrong");
  let month = ethioDate?.month >= 12 ? 12 : ethioDate?.month;
  let year = ethioDate?.year;

  return { month, year };
};
