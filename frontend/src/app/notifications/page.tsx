"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertTriangle, PiggyBank } from "lucide-react";
import Sidebar from "@/components/sidebar"; // ✅ Import Sidebar

type Notification = {
  id: number;
  type: "overspending" | "reminder";
  message: string;
  date: string;
};

export default function NotificationsPage() {
  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      type: "overspending",
      message: "⚠ You have exceeded your Bills limit by ₹500.",
      date: "2025-09-01",
    },
    {
      id: 2,
      type: "reminder",
      message: "💰 Reminder: Save at least ₹2000 this month for your goal.",
      date: "2025-09-02",
    },
    {
      id: 3,
      type: "overspending",
      message: "⚠ Travel expenses are 80% of your limit.",
      date: "2025-09-03",
    },
  ]);

  return (
    // ✅ Apply standard page layout
    <div className="flex min-h-screen bg-white text-gray-800">
      <Sidebar /> {/* ✅ Add Sidebar */}
      
      {/* ✅ Wrap content in main tag */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-yellow-600 flex items-center gap-2">
          <Bell className="h-7 w-7 text-yellow-600" />
          Notifications
        </h1>

        <Card className="border-yellow-600 shadow-md">
          <CardHeader>
            <CardTitle className="text-yellow-600">🔔 Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <p className="text-gray-500">No notifications available.</p>
            ) : (
              <ul className="space-y-4">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className={`flex items-start p-4 border rounded-lg ${
                      n.type === "overspending"
                        ? "border-red-400 bg-red-50"
                        : "border-yellow-400 bg-yellow-50"
                    }`}
                  >
                    <div className="mr-3">
                      {n.type === "overspending" ? (
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                      ) : (
                        <PiggyBank className="h-6 w-6 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{n.message}</p>
                      <p className="text-sm text-gray-500">{n.date}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}