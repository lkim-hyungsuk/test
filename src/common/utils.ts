export const findUrnMember = (obj: any): string | null => {
  for (const key in obj) {
    if (key === 'urn') {
      return obj[key];
    }
    if (typeof obj[key] === 'object') {
      const found = findUrnMember(obj[key]);
      if (found !== null) {
        return found;
      }
    }
  }
  return null;
};

export const getLocal = () => {
  return document.querySelector('meta[name="i18nLocale"]')?.getAttribute('content');
};
