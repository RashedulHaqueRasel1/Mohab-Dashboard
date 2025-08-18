"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Calendar, Users, UserCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  fetchAdminStats,
  fetchPaymentStats,
  fetchCategoryStats,
} from "@/hooks/api";

const PIE_COLORS = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6"];


interface CategoryStat {
  category: string;
  bookings: number;
}

interface PieChartLegendItem {
  name: string;
  value: number;
  bookings: number;
  color: string;
}

export default function DashboardPage() {

  // Queries
  const { data: adminStats, isLoading: loadingAdmin } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: fetchAdminStats,
  });


  const { data: paymentStats, isLoading: loadingPayment } = useQuery({
    queryKey: ["payment-stats"],
    queryFn: fetchPaymentStats,
  });


  const { data: categoryStats, isLoading: loadingCategory } = useQuery({
    queryKey: ["category-stats"],
    queryFn: fetchCategoryStats,
  });


  // Prepare line chart data
  const lineChartData = paymentStats?.data || [];

  // Prepare pie chart data
  const pieChartData: PieChartLegendItem[] =
    categoryStats?.data?.map((item: CategoryStat, index: number) => {
      const totalBookings = categoryStats.data.reduce(
        (sum: number, cat: CategoryStat) => sum + cat.bookings,
        0
      );
      const percent =
        totalBookings > 0
          ? ((item.bookings / totalBookings) * 100).toFixed(1)
          : "0";

      return {
        name: item.category,
        value: parseFloat(percent),
        bookings: item.bookings,
        color: PIE_COLORS[index % PIE_COLORS.length],
      };
    }) || [];


    

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back to your admin panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
                Total Revenue
              </h3>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold">
              $
              {adminStats?.data?.totalRevenue?.toLocaleString() ||
                (loadingAdmin ? "..." : 0)}
            </p>
            <p className="text-sm text-green-600">↗ Total revenue generated</p>
          </CardContent>
        </Card>

        {/* Total Bookings */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
                Total Booking
              </h3>
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold">
              {adminStats?.data?.totalBookings?.toLocaleString() ||
                (loadingAdmin ? "..." : 0)}
            </p>
            <p className="text-sm text-green-600">↗ Total bookings made</p>
          </CardContent>
        </Card>

        {/* Total Users */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold">
              {adminStats?.data?.totalUsers?.toLocaleString() ||
                (loadingAdmin ? "..." : 0)}
            </p>
            <p className="text-sm text-green-600">↗ Registered users</p>
          </CardContent>
        </Card>

        {/* Users with Bookings */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
                Users with Bookings
              </h3>
              <UserCheck className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold">
              {categoryStats?.usersWithBookings || (loadingCategory ? "..." : 0)}
            </p>
            <p className="text-sm text-green-600">↗ Active customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <p className="text-sm text-gray-600">
              Monthly Revenue and Booking Trends
            </p>
          </CardHeader>
          <CardContent className="h-80">
            {loadingPayment ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                Loading chart...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ fill: "#10B981" }}
                    name="Revenue ($)"
                  />
                  <Line
                    type="monotone"
                    dataKey="booking"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: "#3B82F6" }}
                    name="Bookings"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <p className="text-sm text-gray-600">
              Booking distribution by category
            </p>
          </CardHeader>
          <CardContent className="flex flex-col items-center h-80">
            {loadingCategory ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                Loading...
              </div>
            ) : pieChartData.length > 0 ? (
              <>
                <div className="relative w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        innerRadius={60}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold">
                      {categoryStats?.userBookingPercentage || 0}%
                    </span>
                  </div>
                </div>

                {/* Legend */}
                <div className="mt-4 space-y-2 w-full">
                  {pieChartData.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center">
                        <span
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-gray-600">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{item.value}%</div>
                        <div className="text-xs text-gray-500">
                          {item.bookings} bookings
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
