export const getAverageRating = (array: any) => {
  const sum = array.reduce((a, b) => a + b.rating, 0);
  return sum / array.length;
};
