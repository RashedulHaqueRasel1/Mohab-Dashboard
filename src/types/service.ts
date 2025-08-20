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

// Types
export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  cityOrState: string;
  companyName: string;
  roadOrArea: string;
  postalCode: string;
  imageLink: string;
};

export type DataType = {
  dataSetName: string;
  userId: string;
  dataSets: File;
};
