const quotesRegexp = RegExp(/(\')|(\")|(\\)/g);

export const sanitizeSqlValue = (text: string) => {
  const hasInjection = quotesRegexp.test(text);
  if (hasInjection) {
    throw new Error(`SanitizeSqlValue: found injection attempt in ${text}`);
  } else {
    return text;
  }
};
