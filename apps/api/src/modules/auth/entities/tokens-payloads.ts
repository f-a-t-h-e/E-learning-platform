export interface IAccessToken {
  id: number;
  email: string;
  name: string;
  roleName: string;
}
export interface IRefreshToken {
  tokenId: number;
  id: number;
  email: string;
  name: string;
  roleName: string;
}
