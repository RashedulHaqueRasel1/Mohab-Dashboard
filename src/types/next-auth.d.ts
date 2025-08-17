import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    name: string;
    email: string;
    role: string;
    token: string;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
    accessToken: string;
  }
}

interface IStrategy {
  _id: string;
  name: string;
  email: string;
  companyName: string;
  dataStrategy: string;
  strategyDescription: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface IStrategyResponse {
  status: boolean;
  message: string;
  data?: IStrategy[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
}