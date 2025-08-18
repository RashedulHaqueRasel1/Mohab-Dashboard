"use client";
import { useQuery } from "@tanstack/react-query";
import { getPayments } from "@/hooks/api";
import Image from "next/image";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight } from "lucide-react";

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName?: string;
  imageLink: string;
};

type Service = {
  _id: string;
  serviceTitle: string;
  serviceDescription: string;
  price: number;
  imageLink: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type Payment = {
  _id: string;
  userId: User;
  serviceId: Service | null;
  amount: number;
  transactionId: string;
  status: "pending" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type Pagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: Payment[];
  pagination: Pagination;
};

export default function Payments() {
  const {
    data: paymentsData,
    isLoading,
    isError,
  } = useQuery<ApiResponse>({
    queryKey: ["payments"],
    queryFn: () => getPayments(),
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (isError)
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Error loading payments. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );

  // Calculate total sales
  const totalSales =
    paymentsData?.data?.reduce((sum, payment) => sum + payment.amount, 0) || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
        <p className="mt-2 text-sm text-gray-600">
          View all payment transactions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Sales</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">
                ${totalSales.toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Transactions
              </p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">
                {paymentsData?.pagination?.totalItems || 0}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Pending Payments
              </p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">
                {paymentsData?.data?.filter((p) => p.status === "pending")
                  .length || 0}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Customer
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Service
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentsData?.data?.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 relative">
                        <Image
                          src={payment.userId.imageLink}
                          alt={`${payment.userId.firstName} ${payment.userId.lastName}`}
                          width={40}
                          height={40}
                          className="rounded-full"
                          objectFit="cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.userId.firstName} {payment.userId.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.userId.email}
                        </div>
                        {payment.userId.companyName && (
                          <div className="text-xs text-gray-400 mt-1">
                            {payment.userId.companyName}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {payment.serviceId ? (
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {payment.serviceId.serviceTitle}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                          {payment.serviceId.serviceDescription}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 italic">
                        No service
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${payment.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        payment.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : payment.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {payment.status.charAt(0).toUpperCase() +
                        payment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(payment.createdAt), "MMM d, yyyy")}
                    <br />
                    <span className="text-gray-400">
                      {format(new Date(payment.createdAt), "h:mm a")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {paymentsData?.pagination && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {(paymentsData.pagination.currentPage - 1) *
                paymentsData.pagination.itemsPerPage +
                1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(
                paymentsData.pagination.currentPage *
                  paymentsData.pagination.itemsPerPage,
                paymentsData.pagination.totalItems
              )}
            </span>{" "}
            of{" "}
            <span className="font-medium">
              {paymentsData.pagination.totalItems}
            </span>{" "}
            results
          </div>
          <div className="flex space-x-2">
            <button
              disabled={paymentsData.pagination.currentPage === 1}
              className={`flex items-center px-4 py-2 border rounded-md text-sm font-medium 
                ${
                  paymentsData.pagination.currentPage === 1
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
            >
              <ArrowLeft className="mr-2" /> Previous
            </button>
            <button
              disabled={
                paymentsData.pagination.currentPage ===
                paymentsData.pagination.totalPages
              }
              className={`flex items-center px-4 py-2 border rounded-md text-sm font-medium 
                ${
                  paymentsData.pagination.currentPage ===
                  paymentsData.pagination.totalPages
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
            >
              Next <ArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
