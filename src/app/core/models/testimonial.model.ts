type User = {
  _id: string;
  name: string;
};

export interface ITestimonial {
  _id: string;
  user: User;
  message: string;
  rating: number;
  isApproved: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ITestimonialsResponse {
  message: string;
  data: ITestimonial[];
}

export interface ITestimonialResponse {
  message: string;
  data: ITestimonial;
}

export interface ITestimonialData {
  message: string;
  rating: number;
};
