export const includeData = {
  Inventory: {
    include: {
      chartOfAccount: true,
      ProductPrice: {
        where: {
          active: true,
        },
      },
    },
  },
};
