type Product = {
  _id: string;
  title: string;
  price: number;
  stock: number;
  image: string;
};

export interface IItem  {
  _id: string;
  product: Product;
  quantity: number;
  priceAtAdding: number;
  isChanged: boolean;
};

export interface ICart {
  _id: string;
  user: string;
  items: IItem[];
  totalQuantity: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ICartResponse {
  message: string;
  data: ICart;
}

export interface IItemData {
  productId: string;
  quantity: number;
}

export interface ILocalItemData {
  productId: string;
  title: string;
  image: string;
  stock: number;
  priceAtAdding: number;
  quantity: number;
}
