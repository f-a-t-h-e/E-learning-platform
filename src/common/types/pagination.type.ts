export type TPaginationPrepare<T extends string = '', CursorType = number> = {
  cursor: {
    type: CursorType;
    name: `${T extends '' ? `c` : `${T}C`}ursor`;
  };
  pageSize: {
    type: number;
    name: `${T extends '' ? `p` : `${T}P`}ageSize`;
  };
  skip: {
    type: number;
    name: `${T extends '' ? `s` : `${T}S`}kip`;
  };
};

export type TPagination<T extends string = '', CursorType = number> = {
  [K in TPaginationPrepare<T, CursorType>[keyof TPaginationPrepare<
    T,
    CursorType
  >]['name']]: K extends `${T extends '' ? `c` : `${T}C`}ursor`
    ? TPaginationPrepare<T, CursorType>['cursor']['type']
    : K extends `${T extends '' ? `p` : `${T}P`}ageSize`
      ? TPaginationPrepare<T, CursorType>['pageSize']['type']
      : TPaginationPrepare<T, CursorType>['skip']['type'];
};
