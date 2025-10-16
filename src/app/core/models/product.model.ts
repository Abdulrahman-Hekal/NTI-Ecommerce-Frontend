type Category = {
  _id: string;
  name: string;
};

type Meta = {
  total: number;
  page: number;
  pages: number;
  limit: number;
};

export interface IProduct {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category: Category;
  subCategory: Category;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IProductsResponse {
  message: string;
  data: IProduct[];
  meta: Meta;
}

export interface IProductResponse {
  message: string;
  data: IProduct;
}

export interface IProductQuery {
  page?: string;
  limit?: string;
  search?: string;
  category?: string;
  subCategory?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
}
