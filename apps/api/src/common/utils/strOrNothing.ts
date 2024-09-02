export const strOrNothing = (
  condition: boolean | null | undefined | number | '',
  str: string,
) => {
  return condition ? str : '';
};
