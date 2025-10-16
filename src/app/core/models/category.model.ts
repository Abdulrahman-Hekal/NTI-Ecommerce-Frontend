export interface ISubCategory {
  _id: string;
  name: string;
};

export interface ICategory {
  _id: string;
  name: string;
  subCategories: ISubCategory[];
}

export interface ICategoriesResponse {
  message: string;
  data: ICategory[];
}

export interface ICategoryResponse {
  message: string;
  data: ICategory;
}
