import { EStatus } from './enums';

type User = {
  _id: string;
  name: string;
  email: string;
};

type Product = {
  _id: string;
  title: string;
  price: number;
  stock: number;
  image: string;
};

type Item = {
  product: Product;
  quantity: number;
  priceAtOrdering: number;
  _id: string;
};

type Address = {
  street: string;
  city: string;
  governorate: string;
  _id: string;
};

export interface IOrder {
  _id: string;
  user: User;
  products: Item[];
  totalPrice: number;
  shippingAddress: Address;
  phone: string;
  status: EStatus;
  orderedAt: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IOrdersResponse {
  message: string;
  data: IOrder[];
}

export interface IOrderResponse {
  message: string;
  data: IOrder;
}

export interface IOrderData {
  products: { productId: string; quantity: number }[];
  shippingAddress: {
    governorate: string;
    city: string;
    street: string;
  };
  phone: string;
}

export interface IOrderQuery {
  status?: string;
  userId?: string;
}
