export const productIncludeData = {
  inventory: {
    include: {
      chartOfAccount: true,
      productPrice: {
        where: {
          active: true,
        },
      },
    },
  },
};
