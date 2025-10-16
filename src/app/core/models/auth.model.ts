import { ERole } from './enums';

export interface ITokenResponse {
  message: string;
  data: { token: string };
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface ITokenDecode {
  id: string;
  name: string;
  role: ERole;
  iat: number;
  exp: number;
}
