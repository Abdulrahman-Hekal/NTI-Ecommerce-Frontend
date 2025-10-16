type Category = {
  _id: string;
  name: string;
};

export interface ISubCategory {
  _id: string;
  name: string;
  parentCategory: Category;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ISubCategoriesResponse {
  message: string;
  data: ISubCategory[];
}

export interface ISubCategoryResponse {
  message: string;
  data: ISubCategory;
}

export interface ISubCategoryData {
  name: string;
  parentId: string;
}
