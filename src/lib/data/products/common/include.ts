export const includeData = {
  Inventory: {
    include: {
      ProductPrice: {
        where: {
          active: true,
        },
      },
    },
  },
};
