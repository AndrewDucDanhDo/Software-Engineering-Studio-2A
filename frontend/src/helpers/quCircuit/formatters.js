export const  reduceAmplitude = (result) => {
  const [firstPart, secondPart] = result
    .replace("i", "")
    .match(/(\-|\+)?\d*(\.)\d{8}/g)
    .map((num) => parseFloat(num).toFixed(4));
  // Parse float will strip the + sign so add it in if a positive
  const separator = secondPart >= 0 ? "+" : "";
  return `${firstPart}${separator}${secondPart}i`;
};
