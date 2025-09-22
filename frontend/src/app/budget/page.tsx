"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import Sidebar from "@/components/sidebar";

export default function BudgetInsightsPage() {
  // Sample category data
  const categoryData = [
    { name: "Food", value: 2500 },
    { name: "Travel", value: 1200 },
    { name: "Bills", value: 4000 },
    { name: "Shopping", value: 1800 },
    { name: "Other", value: 800 },
  ];

  // Sample weekly spending
  const weeklyData = [
    { week: "Week 1", amount: 2200 },
    { week: "Week 2", amount: 2800 },
    { week: "Week 3", amount: 3200 },
    { week: "Week 4", amount: 2500 },
  ];

  const COLORS = ["#FFD700", "#E6B800", "#CC9A00", "#B38600", "#806000"];

  return (
    <div className="flex min-h-screen bg-white text-gray-800">
      <Sidebar />
      <main>
        <div className="min-h-screen bg-white text-gray-800 p-6">
          <h1 className="text-3xl font-bold mb-6 text-yellow-600">
            📊 Budget & Insights
          </h1>

          {/* AI Recommendations */}
          <Card className="mb-6 border-yellow-600 shadow-md">
            <CardHeader>
              <CardTitle className="text-yellow-600">
                💡 AI Budget Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Based on your recent spending, you are exceeding your{" "}
                <b>Bills</b> budget by 20%. Consider reducing utility usage or
                shifting expenses to next month. You are saving well on{" "}
                <b>Food</b> and <b>Travel</b>, keep it up!
              </p>
            </CardContent>
          </Card>

          {/* Spending Categories */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            {categoryData.map((c, i) => (
              <Card
                key={i}
                className="border-yellow-600 hover:shadow-lg transition"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-yellow-700">{c.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-bold text-yellow-600">
                    ₹{c.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pie Chart - Category Split */}
            <Card className="border-yellow-600 shadow-md">
              <CardHeader>
                <CardTitle className="text-yellow-600">
                  Category Wise Spending
                </CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Bar Chart - Weekly Spending */}
            <Card className="border-yellow-600 shadow-md">
              <CardHeader>
                <CardTitle className="text-yellow-600">
                  Weekly Expense Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="amount" fill="#FFD700" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
