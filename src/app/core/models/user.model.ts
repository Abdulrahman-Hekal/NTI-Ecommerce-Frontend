import { ERole } from './enums';

type Address = {
  street: string;
  city: string;
  governorate: string;
  isDefault: boolean;
  isDeleted: boolean;
  _id: string;
};

type Phone = {
  number: string;
  isDefault: boolean;
  isDeleted: boolean;
  _id: string;
};

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: ERole;
  phones: Phone[];
  addresses: Address[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IUsersResponse {
  message: string;
  data: IUser[];
}

export interface IUserResponse {
  message: string;
  data: IUser;
}

export interface IUserData {
  name: string;
  email: string;
  password: string;
  phones: Phone[];
  addresses: Address[];
}

export interface IAdminData {
  name: string;
  email: string;
  password: string;
}
