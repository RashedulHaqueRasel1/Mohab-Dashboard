export interface IService {
  _id: string;
  serviceTitle: string;
  serviceDescription: string;
  price: number;
  imageLink: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}


export interface IBlog {
  _id: string;
  blogTitle: string;
  blogDescription: string;
  imageLink: string;
  createdAt: string;
  updatedAt?: string;
}