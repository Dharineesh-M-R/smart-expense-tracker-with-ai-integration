"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Settings, AlertCircle, Loader2 } from "lucide-react";
import Sidebar from "@/components/sidebar"; // Assuming you have this component

// ------------------ Types ------------------
// These types must match the JSON structure from your API
type CategoryLimit = {
  category_id: string; // From the database
  name: string;
  limit: number;
  spent: number;
};

type NFCDevice = {
  card_id: string; // From the database
  uid: string;
  totalLimit: number; // Mapped from total_limit in the API
  categories: CategoryLimit[];
};

// ------------------ Component ------------------
export default function WalletPage() {
  const [devices, setDevices] = useState<NFCDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  // State for the "Set Limit" modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // For modal loading
  const [selectedItem, setSelectedItem] = useState<{
    device: NFCDevice;
    category: CategoryLimit;
  } | null>(null);
  const [newLimitInput, setNewLimitInput] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // 1. Get user ID from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // If no user ID, redirect to login
      console.log("No user ID found, redirecting to login.");
      router.push("/login");
    }
  }, [router]);

  // 2. Fetch wallet data once userId is available
  useEffect(() => {
    if (!userId) return; // Don't fetch if no user ID

    const fetchDevices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_URL}/api/wallet/${userId}`);
        setDevices(res.data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load wallet data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevices();
  }, [userId, API_URL]); // Re-run if userId changes

  // ------------------ Handlers ------------------

  const handleOpenSetLimitModal = (
    device: NFCDevice,
    category: CategoryLimit
  ) => {
    setSelectedItem({ device, category });
    setNewLimitInput(String(category.limit));
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isUpdating) return; // Don't close while updating
    setIsModalOpen(false);
    setSelectedItem(null);
    setNewLimitInput("");
    setModalError(null);
  };

  /**
   * Confirms the new limit from the modal.
   * Performs client-side validation, then sends API request.
   */
  const handleConfirmSetLimit = async (): Promise<void> => {
    if (!selectedItem || newLimitInput === "" || !userId || isUpdating) return;

    const { device, category } = selectedItem;
    const newLimit = Number(newLimitInput);

    // Reset error
    setModalError(null);

    // --- Client-side Validation (Good for UX, backend validates again) ---
    if (isNaN(newLimit) || newLimit < 0) {
      setModalError("Please enter a valid positive number.");
      return;
    }
    if (newLimit < category.spent) {
      setModalError(
        `New limit (₹${newLimit}) cannot be less than already spent (₹${category.spent}).`
      );
      return;
    }
    const otherCategoriesLimit = device.categories.reduce(
      (acc, cat) => (cat.name !== category.name ? acc + cat.limit : acc),
      0
    );
    if (otherCategoriesLimit + newLimit > device.totalLimit) {
      setModalError(
        `Total category limits (₹${
          otherCategoriesLimit + newLimit
        }) cannot exceed the device's total limit (₹${device.totalLimit}).`
      );
      return;
    }
    // --- End Validation ---
    
    setIsUpdating(true);
    try {
      // All checks passed, send update request to backend
      await axios.put(`${API_URL}/api/wallet/limit`, {
        userId: userId,
        cardId: device.card_id,
        categoryId: category.category_id,
        newLimit: newLimit,
      });

      // Update state locally on success
      setDevices((prev) =>
        prev.map((d) =>
          d.card_id === device.card_id
            ? {
                ...d,
                categories: d.categories.map((c) =>
                  c.category_id === category.category_id
                    ? { ...c, limit: newLimit }
                    : c
                ),
              }
            : d
        )
      );
      
      handleCloseModal(); // Close modal on success
      
    } catch (err: any) {
      console.error(err);
      // Display the specific error message from the backend
      setModalError(err.response?.data?.message || "Failed to update limit. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  // ------------------ Render ------------------

  // Loading State
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  // Error State
  if (error) {
     return (
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 flex items-center justify-center">
           <Alert variant="destructive" className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
        </main>
      </div>
    );
  }
  
  // Main Content
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <h1 className="text-3xl font-bold mb-6">💳 My Wallet</h1>

        {/* Device List */}
        <div className="space-y-6">
          {devices.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  You have no cards linked to your account yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            devices.map((device) => {
              const totalSpent = device.categories.reduce(
                (acc, c) => acc + c.spent,
                0
              );
              const totalAllocated = device.categories.reduce(
                (acc, c) => acc + c.limit,
                0
              );

              return (
                <Card key={device.card_id} className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-xl">UID: {device.uid}</CardTitle>
                    <CardDescription>
                      Total Limit: ₹{device.totalLimit} (Allocated: ₹
                      {totalAllocated})
                    </CardDescription>
                    <div className="pt-2">
                      <div className="flex justify-between text-sm text-muted-foreground mb-1">
                        <span>Total Spent</span>
                        <span>
                          ₹{totalSpent} / ₹{device.totalLimit}
                        </span>
                      </div>
                      <Progress
                        value={(totalSpent / device.totalLimit) * 100}
                        className={
                          totalSpent > device.totalLimit
                            ? "[&>*]:bg-destructive"
                            : ""
                        }
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-lg font-semibold mb-4">Categories</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {device.categories.map((c) => (
                        <div
                          key={c.category_id}
                          className="border rounded-lg p-4 flex flex-col justify-between space-y-3"
                        >
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-semibold">{c.name}</h4>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleOpenSetLimitModal(device, c)}
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Spent:{" "}
                              <span className="font-bold text-foreground">
                                ₹{c.spent}
                              </span>{" "}
                              / ₹{c.limit}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Remaining: ₹{c.limit - c.spent}
                            </div>
                          </div>
                          <Progress
                            value={c.limit > 0 ? (c.spent / c.limit) * 100 : 0}
                            className={
                              c.spent > c.limit ? "[&>*]:bg-destructive" : ""
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* "Set Limit" Modal */}
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                Set Limit for {selectedItem?.category.name}
              </DialogTitle>
              <DialogDescription>
                On device {selectedItem?.device.uid}. The total of all category
                limits cannot exceed ₹{selectedItem?.device.totalLimit}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="limit" className="text-right">
                  Limit (₹)
                </Label>
                <Input
                  id="limit"
                  type="number"
                  value={newLimitInput}
                  onChange={(e) => setNewLimitInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleConfirmSetLimit();
                  }}
                  className="col-span-3"
                  placeholder="Enter new limit"
                  disabled={isUpdating}
                />
              </div>
              {modalError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{modalError}</AlertDescription>
                </Alert>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseModal} disabled={isUpdating}>
                Cancel
              </Button>
              <Button onClick={handleConfirmSetLimit} disabled={isUpdating}>
                {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isUpdating ? "Saving..." : "Confirm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}