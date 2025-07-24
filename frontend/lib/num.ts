export const isWholeNumber = (value: string): boolean => {
  return /^\d+$/.test(value);
};

export const isValidNumber = (value: string): boolean => {
  return /^\d+(\.\d+)?$/.test(value);
};
