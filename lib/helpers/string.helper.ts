export const capitalize = (str: string) => {
  const firstLeter = str[0].toUpperCase();
  const otherLetters = str.slice(1);
  return firstLeter + otherLetters;
};

export const castValueType = (str: string) => {
  if (str === 'true' || str === 'false') {
    return str === 'true';
  } else if (!isNaN(+str)) {
    return +str;
  } else {
    return str;
  }
};