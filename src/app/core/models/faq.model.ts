export interface IFaq {
  _id: string;
  question: string;
  answer: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IFaqsResponse {
  message: string;
  data: IFaq[];
}

export interface IFaqResponse {
  message: string;
  data: IFaq;
}

export interface IFaqData {
  question: string;
  answer: string;
}
