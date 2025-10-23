"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Sidebar from "@/components/sidebar";
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

// ------------------ Types ------------------
type CategoryLimit = {
  category_id: string;
  name: string;
  limit: number;
  spent: number;
};

type NFCDevice = {
  card_id: string;
  uid: string;
  totalLimit: number;
  categories: CategoryLimit[];
};

// ------------------ Component ------------------
export default function WalletPage() {
  const [devices, setDevices] = useState<NFCDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // State for Category Limit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    device: NFCDevice;
    category: CategoryLimit;
  } | null>(null);
  const [newLimitInput, setNewLimitInput] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);

  // --- NEW --- State for Total Limit Modal
  const [isTotalLimitModalOpen, setIsTotalLimitModalOpen] = useState(false);
  const [isUpdatingTotalLimit, setIsUpdatingTotalLimit] = useState(false);
  const [selectedCard, setSelectedCard] = useState<NFCDevice | null>(null);
  const [newTotalLimitInput, setNewTotalLimitInput] = useState("");
  const [totalLimitModalError, setTotalLimitModalError] = useState<string | null>(
    null
  );
  // --- END NEW ---

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Fetch user ID
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.log("No user ID found, redirecting to login.");
      window.location.href = "/login";
    }
  }, []);

  // Fetch wallet data
  useEffect(() => {
    if (!userId) return;
    const fetchDevices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_URL}/api/wallet`, {
          params: { userId: userId },
        });
        setDevices(res.data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load wallet data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDevices();
  }, [userId, API_URL]);

  // ------------------ Handlers for Category Limit ------------------
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
    if (isUpdating) return;
    setIsModalOpen(false);
    setSelectedItem(null);
    setNewLimitInput("");
    setModalError(null);
  };

  const handleConfirmSetLimit = async () => {
    if (!selectedItem || newLimitInput === "" || !userId || isUpdating) return;
    const { device, category } = selectedItem;
    const newLimit = Number(newLimitInput);
    setModalError(null);

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
      (acc, cat) =>
        cat.category_id !== category.category_id ? acc + cat.limit : acc,
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

    setIsUpdating(true);
    try {
      await axios.put(`${API_URL}/api/wallet/limit`, {
        userId,
        cardId: device.card_id,
        categoryId: category.category_id,
        newLimit,
      });

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
      handleCloseModal();
    } catch (err: any) {
      console.error(err);
      setModalError(
        err.response?.data?.message || "Failed to update limit. Please try again."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // ------------------ NEW: Handlers for Total Limit ------------------
  const handleOpenTotalLimitModal = (device: NFCDevice) => {
    setSelectedCard(device);
    setNewTotalLimitInput(String(device.totalLimit));
    setTotalLimitModalError(null);
    setIsTotalLimitModalOpen(true);
  };

  const handleCloseTotalLimitModal = () => {
    if (isUpdatingTotalLimit) return;
    setIsTotalLimitModalOpen(false);
    setSelectedCard(null);
    setNewTotalLimitInput("");
    setTotalLimitModalError(null);
  };

  const handleConfirmSetTotalLimit = async () => {
    if (
      !selectedCard ||
      newTotalLimitInput === "" ||
      !userId ||
      isUpdatingTotalLimit
    )
      return;

    const newTotalLimit = Number(newTotalLimitInput);
    setTotalLimitModalError(null);

    if (isNaN(newTotalLimit) || newTotalLimit < 0) {
      setTotalLimitModalError("Please enter a valid positive number.");
      return;
    }

    // Frontend check to provide instant feedback
    const totalAllocated = selectedCard.categories.reduce(
      (acc, c) => acc + c.limit,
      0
    );

    if (newTotalLimit < totalAllocated) {
      setTotalLimitModalError(
        `New total limit (₹${newTotalLimit}) cannot be less than the amount already allocated to categories (₹${totalAllocated}).`
      );
      return;
    }

    setIsUpdatingTotalLimit(true);
    try {
      // Call the new backend endpoint
      await axios.put(`${API_URL}/api/wallet/total-limit`, {
        userId,
        cardId: selectedCard.card_id,
        newTotalLimit: newTotalLimit,
      });

      // Update state locally
      setDevices((prev) =>
        prev.map((d) =>
          d.card_id === selectedCard.card_id
            ? { ...d, totalLimit: newTotalLimit }
            : d
        )
      );
      handleCloseTotalLimitModal();
    } catch (err: any) {
      console.error(err);
      setTotalLimitModalError(
        err.response?.data?.message ||
          "Failed to update total limit. Please try again."
      );
    } finally {
      setIsUpdatingTotalLimit(false);
    }
  };
  // ------------------ END NEW ------------------

  // ------------------ Render ------------------
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background text-foreground">
        <main className="flex-1 p-6 lg:p-8 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
      </div>
    );
  }

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

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <h1 className="text-3xl font-bold mb-6">💳 My Wallet</h1>
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
                    {/* --- MODIFIED: Added flex wrapper and Settings button --- */}
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl">
                        UID: {device.uid}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleOpenTotalLimitModal(device)}
                        disabled={isUpdatingTotalLimit}
                      >
                        <Settings className="h-4 w-4" />
                        <span className="sr-only">Set Total Limit</span>
                      </Button>
                    </div>
                    {/* --- END MODIFICATION --- */}
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
                        value={
                          device.totalLimit > 0
                            ? (totalSpent / device.totalLimit) * 100
                            : 0
                        }
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
                    {device.categories.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No categories assigned to this card.
                      </p>
                    ) : (
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
                                  onClick={() =>
                                    handleOpenSetLimitModal(device, c)
                                  }
                                >
                                  <Settings className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Spent:{" "}
                                <span
                                  className={`font-bold ${
                                    c.spent > c.limit
                                      ? "text-destructive"
                                      : "text-foreground"
                                  }`}
                                >
                                  ₹{c.spent}
                                </span>{" "}
                                / ₹
                                {c.limit}
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
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* This is your existing modal for CATEGORY limits */}
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
              <Button
                variant="outline"
                onClick={handleCloseModal}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button onClick={handleConfirmSetLimit} disabled={isUpdating}>
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isUpdating ? "Saving..." : "Confirm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* --- NEW: Modal for TOTAL limit --- */}
        <Dialog
          open={isTotalLimitModalOpen}
          onOpenChange={handleCloseTotalLimitModal}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                Set Total Limit for {selectedCard?.uid}
              </DialogTitle>
              <DialogDescription>
                Set the new total spending limit for this card. This limit cannot
                be lower than the sum of all category limits (₹
                {selectedCard?.categories.reduce((acc, c) => acc + c.limit, 0)}
                ).
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="total-limit" className="text-right">
                  Total Limit (₹)
                </Label>
                <Input
                  id="total-limit"
                  type="number"
                  value={newTotalLimitInput}
                  onChange={(e) => setNewTotalLimitInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleConfirmSetTotalLimit();
                  }}
                  className="col-span-3"
                  placeholder="Enter new total limit"
                  disabled={isUpdatingTotalLimit}
                />
              </div>
              {totalLimitModalError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{totalLimitModalError}</AlertDescription>
                </Alert>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleCloseTotalLimitModal}
                disabled={isUpdatingTotalLimit}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmSetTotalLimit}
                disabled={isUpdatingTotalLimit}
              >
                {isUpdatingTotalLimit && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isUpdatingTotalLimit ? "Saving..." : "Confirm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* --- END NEW --- */}
      </main>
    </div>
  );
}