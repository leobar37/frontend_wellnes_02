export const generateRandomColor = () => {
  return Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0');
};

export const removeSpaces = (str: string) => {
  return str.replace(/\s+/g, '');
};
