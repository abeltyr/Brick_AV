export const chartOfAccountIncludeData = {
  chartOfAccountBalance: {
    select: {
      initialBalance: true,
      balance: true,
    },
    include: {
      fiscalYear: {
        select: {
          startDate: true,
          endDate: true,
          status: true,
          year: true,
        },
      },
    },
  },
};
