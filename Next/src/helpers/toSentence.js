export const toSentence = function (arr) {
  return arr.join(", ").replace(/,\s([^,]+)$/, " and $1");
};
