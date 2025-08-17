import axios from "axios";
import { getSession } from "next-auth/react";
import { IService } from "@/types/service";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `${session.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Admin stats
export async function fetchAdminStats() {
  const res = await api.get("/user/admin-stats");
  return res.data;
}

// Payment stats
export async function fetchPaymentStats() {
  const res = await api.get("/payment/stats");
  return res.data;
}

// Category stats
export async function fetchCategoryStats() {
  const res = await api.get("/payment/category-stats");
  return res.data;
}

// Services
export async function fetchServices(page: number, limit: number) {
  const res = await api.get(`/services/get?page=${page}&limit=${limit}`);
  return res.data;
}

// create Services
export async function createService(data: IService | Partial<IService>, image?: File) {
  try {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    if (image) {
      formData.append("image", image);
    }
    const response = await api.post("/services/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// edit Services
export async function editService(id: string, data: Partial<IService>) {
  const res = await api.put(`/services/${id}`, data);
  return res.data;
}

// delete Service
export async function deleteService(id: string) {
  const res = await api.delete(`/services/${id}`);
  return res.data;
}
