export const profileIncludeData = {
  address: true,
  companyMember: {
    include: {
      company: true,
    },
  },
};
