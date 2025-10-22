// budget/page.tsx (Charts Removed)

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from "@/components/sidebar";
import axios from "axios";

// Define type for our fetched data
type CategoryData = {
  name: string;
  value: number;
};

// Note: WeeklyData type is no longer used, but we'll leave it
// in case the backend still sends it.
type WeeklyData = {
  week: string;
  amount: number;
};

export default function BudgetInsightsPage() {
  // Set up state for data, loading, and errors
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  // We still fetch weekly data, just not display it in a chart
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchBudgetData = async () => {
      setLoading(true);
      setError(null);
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setError("You must be logged in to view insights.");
        setLoading(false);
        return;
      }

      try {
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await axios.get(`${API_URL}/api/budget/${userId}`);

        setCategoryData(res.data.categoryTotals || []);
        setWeeklyData(res.data.weeklyTotals || []);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch budget data");
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetData();
  }, []);

  return (
    <div className="flex min-h-screen bg-white text-gray-800">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-yellow-600">
          📊 Budget & Insights
        </h1>

        {/* AI Recommendations (Still hardcoded, you can enhance this later) */}
        <Card className="mb-6 border-yellow-600 shadow-md">
          <CardHeader>
            <CardTitle className="text-yellow-600">
              💡 AI Budget Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Based on your recent spending, you are exceeding your <b>Bills</b>{" "}
              budget by 20%. Consider reducing utility usage or shifting expenses
              to next month. You are saving well on <b>Food</b> and <b>Travel</b>,
              keep it up!
            </p>
          </CardContent>
        </Card>

        {/* Conditional Rendering for loading/error/data */}
        {loading && <p className="text-center">Loading insights...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <>
            {/* Spending Categories */}
            {categoryData.length === 0 && weeklyData.length === 0 ? (
              <p className="text-center text-gray-500 mb-6">
                No expense data found to generate insights.
              </p>
            ) : (
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                {categoryData.map((c, i) => (
                  <Card
                    key={i}
                    className="border-yellow-600 hover:shadow-lg transition"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-yellow-700">
                        {c.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-bold text-yellow-600">
                        ₹{c.value.toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {/* Charts Section has been removed */}
            
          </>
        )}
      </main>
    </div>
  );
}