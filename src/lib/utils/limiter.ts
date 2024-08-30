export const limitAmount = 20;

export const limitSetter = ({ limit }: { limit?: number }) => {
  if (!limit) return limitAmount;

  let limitData = limitAmount;

  if (limit > 0 && limit < limitAmount) {
    limitData = limit;
  }
  return limitData;
};
