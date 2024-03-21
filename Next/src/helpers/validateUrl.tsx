export const isValidUrl = (url) => {
  const regex =
    // eslint-disable-next-line
    /^(https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}(:[0-9]{1,5})?(\/.*)?$/i;

  return regex.test(url);
};
