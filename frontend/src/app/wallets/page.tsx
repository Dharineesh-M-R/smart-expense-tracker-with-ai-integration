"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

// ------------------ Types ------------------
type CategoryLimit = {
  name: string;
  limit: number;
  spent: number;
};

type NFCDevice = {
  id: number;
  uid: string;
  totalLimit: number;
  categories: CategoryLimit[];
};

// ------------------ Component ------------------
export default function NFCDevicesPage() 
 {
  const [devices, setDevices] = useState<NFCDevice[]>([
    {
      id: 1,
      uid: "04A1B2C3",
      totalLimit: 5000,
      categories: [
        { name: "Food", limit: 2000, spent: 500 },
        { name: "Travel", limit: 1500, spent: 300 },
        { name: "Bills", limit: 1500, spent: 1200 },
      ],
    },
  ]);

  const [newDevice, setNewDevice] = useState({
    uid: "",
    totalLimit: "",
  });

  const [selectedDevice, setSelectedDevice] = useState<NFCDevice | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // ------------------ Handlers ------------------
  const handleAddDevice = (): void => {
    if (!newDevice.uid || !newDevice.totalLimit) return;
    const device: NFCDevice = {
      id: Date.now(),
      uid: newDevice.uid,
      totalLimit: Number(newDevice.totalLimit),
      categories: [],
    };
    setDevices([...devices, device]);
    setNewDevice({ uid: "", totalLimit: "" });
  };

  const handleDeleteDevice = (id: number): void => {
    setDevices(devices.filter((d) => d.id !== id));
  };

  const handleTapCard = (device: NFCDevice): void => {
    setSelectedDevice(device);
    setSelectedCategory("");
  };

  const handleSpend = (amount: number): void => {
    if (!selectedDevice || !selectedCategory) return;

    setDevices((prev) =>
      prev.map((d) => {
        if (d.id === selectedDevice.id) {
          return {
            ...d,
            categories: d.categories.map((c) =>
              c.name === selectedCategory
                ? { ...c, spent: c.spent + amount }
                : c
            ),
          };
        }
        return d;
      })
    );

    setSelectedDevice(null);
    setSelectedCategory("");
  };

  const handleAddCategory = (deviceId: number, category: string, limit: number): void => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === deviceId
          ? {
              ...d,
              categories: [
                ...d.categories,
                { name: category, limit, spent: 0 },
              ],
            }
          : d
      )
    );
  };

  // ------------------ Render ------------------
  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <h1 className="text-3xl font-bold mb-6 text-yellow-600">
        📱 NFC Devices / Cards
      </h1>

      {/* Add New Card */}
      <Card className="mb-6 border-yellow-600 shadow-md">
        <CardHeader>
          <CardTitle className="text-yellow-600">➕ Register New NFC Card</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <Input
            placeholder="Card UID"
            value={newDevice.uid}
            onChange={(e) =>
              setNewDevice({ ...newDevice, uid: e.target.value })
            }
            className="border-yellow-600"
          />
          <Input
            type="number"
            placeholder="Total Limit (₹)"
            value={newDevice.totalLimit}
            onChange={(e) =>
              setNewDevice({ ...newDevice, totalLimit: e.target.value })
            }
            className="border-yellow-600"
          />
          <Button
            className="bg-yellow-600 hover:bg-yellow-700 text-white col-span-3"
            onClick={handleAddDevice}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Card
          </Button>
        </CardContent>
      </Card>

      {/* Device List */}
      {devices.map((device) => (
        <Card key={device.id} className="mb-6 border-yellow-600 shadow-md">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-yellow-600">
              UID: {device.uid} (Limit: ₹{device.totalLimit})
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteDevice(device.id)}
            >
              <Trash2 className="h-5 w-5 text-red-600" />
            </Button>
          </CardHeader>
          <CardContent>
            {/* Categories */}
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              {device.categories.map((c, i) => (
                <div
                  key={i}
                  className="border p-3 rounded-lg border-yellow-600"
                >
                  <h3 className="font-semibold text-yellow-700">{c.name}</h3>
                  <p>
                    Limit: ₹{c.limit} | Spent:{" "}
                    <span className="text-yellow-600 font-bold">₹{c.spent}</span>
                  </p>
                  <Button
                    className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white"
                    onClick={() => handleTapCard(device)}
                  >
                    Tap & Spend
                  </Button>
                </div>
              ))}
            </div>

            {/* Add Category */}
            <div className="flex gap-2 mt-4">
              <Input
                placeholder="Category Name"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = (e.target as HTMLInputElement).value;
                    if (val) handleAddCategory(device.id, val, 1000);
                    (e.target as HTMLInputElement).value = "";
                  }
                }}
                className="border-yellow-600"
              />
              <Button
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
                onClick={() => handleAddCategory(device.id, "Misc", 1000)}
              >
                + Add Category
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Category Selection Modal */}
      {selectedDevice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="w-96 border-yellow-600 shadow-lg">
            <CardHeader>
              <CardTitle className="text-yellow-600">
                Select Category for {selectedDevice.uid}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={(val) => setSelectedCategory(val)}>
                <SelectTrigger className="border-yellow-600 mb-4">
                  <SelectValue placeholder="Choose Category" />
                </SelectTrigger>
                <SelectContent>
                  {selectedDevice.categories.map((c, i) => (
                    <SelectItem key={i} value={c.name}>
                      {c.name} (Remaining: ₹{c.limit - c.spent})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="Enter Amount"
                className="border-yellow-600 mb-4"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSpend(Number((e.target as HTMLInputElement).value));
                    (e.target as HTMLInputElement).value = "";
                  }
                }}
              />

              <div className="flex gap-2">
                <Button
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  onClick={() => handleSpend(500)}
                >
                  Spend ₹500
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedDevice(null)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
