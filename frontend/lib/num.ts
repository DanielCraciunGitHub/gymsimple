export const isWholeNumber = (value: string): boolean => {
  return /^\d+$/.test(value);
};

export const isValidPositiveNumber = (value: string): boolean => {
  return /^\d+(\.\d+)?$/.test(value);
};
