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
export async function createService(
  data: IService | Partial<IService>,
  image?: File
) {
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
export async function editService(
  id: string,
  data: Partial<IService>,
  file?: File
) {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));

  if (file) {
    formData.append("file", file);
  }

  const res = await api.put(`/services/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}

// delete Service
export async function deleteService(id: string) {
  const res = await api.delete(`/services/${id}`);
  return res.data;
}

// get strategy
export async function getStrategy() {
  const res = await api.get(`/strategy/get`);
  return res.data;
}

// delete strategy
export async function deleteStrategy(id: string) {
  const res = await api.delete(`/strategy/${id}`);
  return res.data;
}

// get blog
export async function getBlogs() {
  const res = await api.get(`/blog/get`);
  return res.data;
}

// create Blog
export async function createBlogs(
  data: { blogTitle: string; blogDescription: string },
  image?: File
) {
  try {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    if (image) {
      formData.append("image", image);
    }

    const response = await api.post("/blog/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

// edit Blog
export async function editBlog(
  id: string,
  data: Partial<IService>,
  file?: File
) {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));

  if (file) {
    formData.append("file", file);
  }

  const res = await api.put(`/services/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}

// delete blog
export async function deleteBlog(id: string) {
  const res = await api.delete(`/blog/${id}`);
  return res.data;
}

// get Solutions
export async function getSolutions() {
  const res = await api.get(`/solution/get`);
  return res.data;
}

// delete Solutions
export async function deleteSolution(id: string) {
  const res = await api.delete(`/solution/${id}`);
  return res.data;
}

// update Solution
export async function updateSolution(
  id: string,
  data: { solutionName: string; solutionDescription: string }
) {
  try {
    const res = await api.put(`/solution/${id}`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
}


// solution create
export async function createSolution(
  data: { solutionName: string; solutionDescription: string }
) {
  try {
    const res = await api.post(`/solution/create`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
}