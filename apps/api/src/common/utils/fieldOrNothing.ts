export const fieldOrNothing = <T extends string, D>(
  field: T,
  value: D,
):
  | {
      [k in T]: D;
    }
  | object => {
  return value !== 'undefined' && value !== '' ? { [field]: value } : {};
};
