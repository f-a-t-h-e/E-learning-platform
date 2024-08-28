/**
 * This is usefull when using raw query for the fields related to another table in `join`s
 */
export type FieldsOrNullFields<T> = T | { [k in keyof T]: null };
