export const objOrNothing = <T, D>(obj: T, value: D) => {
  return value ? obj : {};
};
