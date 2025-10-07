"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../hooks/useUser";
import { UserRole } from "../constants/roles";

interface SlipInterface {
  _id: string;
  branch?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  deliveryType?: string;
  imageUrl?: string;
  customerName?: string;
  customerNumber?: string;
  billNumber?: string;
  cakeType?: string;
  hamper?: string;
  topper?: string;
  status?: string;
}

interface SlipProps {
  slip: SlipInterface;
}
const Slip = ({ slip }: SlipProps) => {
  const { role } = useUser();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewSlip, setPreviewSlip] = useState<SlipInterface | null>(null);
  const [currentStatus, setCurrentStatus] = useState(slip.status);

  const allStatuses = [
    "pending",
    "in kitchen",
    "ready",
    "in store",
    "delivered",
  ];

  const handleStatusChange = async (newStatus: string) => {
    // Optimistically update the UI
    setCurrentStatus(newStatus);

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/slips/${slip._id}/status`,
        { status: newStatus }
      );
      // Optionally, you can show a success toast here
    } catch (error) {
      console.error("Failed to update status:", error);
      // Revert the change on error
      setCurrentStatus(slip.status);
      // Optionally, show an error toast
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePreview();
    };
    if (previewUrl) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [previewUrl]);

  const closePreview = () => {
    setPreviewUrl(null);
    setPreviewSlip(null);
  };

  const openPreview = (url?: string | null, slip?: SlipInterface | null) => {
    if (!url) return; // don't open preview without a valid URL
    setPreviewUrl(url);
    setPreviewSlip(slip ?? null);
  };

  const renderStatusControls = (userRole: UserRole) => {
    switch (userRole) {
      case "admin":
        return (
          <select
            value={currentStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="text-sm border rounded-md p-1 bg-white text-gray-700 border-pink-400 focus:ring-2 focus:ring-pink-500"
          >
            {allStatuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        );
      case "chef":
        return (
          <div className="flex items-center gap-2 text-sm">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={currentStatus === "in kitchen"}
                onChange={() => handleStatusChange("in kitchen")}
              />
              In Kitchen
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={currentStatus === "ready"}
                onChange={() => handleStatusChange("ready")}
              />
              Ready
            </label>
          </div>
        );
      case "staff":
        return (
          <div className="flex items-center gap-2 text-sm">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={currentStatus === "in store"}
                onChange={() => handleStatusChange("in store")}
              />
              In Store
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={currentStatus === "delivered"}
                onChange={() => handleStatusChange("delivered")}
              />
              Delivered
            </label>
          </div>
        );
      case "delivery":
        return (
          <div className="flex items-center gap-2 text-sm">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={currentStatus === "delivered"}
                onChange={() => handleStatusChange("delivered")}
              />
              Delivered
            </label>
          </div>
        );
      default:
        return (
          <span className="text-sm font-medium capitalize">
            {currentStatus}
          </span>
        );
    }
  };

  return (
    <>
      <li key={slip._id}>
        <div className="group bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
          {/* Image Section */}
          <div
            className="relative cursor-pointer"
            onClick={() => openPreview(slip.imageUrl, slip)}
          >
            <img
              src={slip.imageUrl || "/placeholder.png"}
              alt={`Slip for ${slip.branch}`}
              className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-2 right-2 bg-white/80 text-gray-800 text-xs px-2 py-1 rounded-lg shadow-sm">
              #{slip.billNumber}
            </div>
          </div>

          {/* Info Section */}
          <div className="p-4">
            {/* Branch + Delivery Type */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                {slip.branch?.toUpperCase() || "Branch"}
              </h3>
              <span
                className={`text-xs font-medium uppercase px-2 py-1 rounded-full ${
                  slip.deliveryType === "delivery"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {slip.deliveryType}
              </span>
            </div>

            {/* Customer Info */}
            <div className="space-y-1 mb-3 flex justify-between">
              <p className="text-sm text-gray-700 font-medium">
                👤 {slip.customerName}
              </p>
              <p className="text-sm text-gray-600">📞 {slip.customerNumber}</p>
            </div>

            {/* Cake Details */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="bg-pink-100 text-pink-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                {slip.cakeType} cake
              </span>
              <span
                className={`${
                  slip.topper === "yes"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-600"
                } text-xs font-semibold px-2.5 py-1 rounded-full`}
              >
                Topper: {slip.topper}
              </span>
              <span
                className={`${
                  slip.hamper === "yes"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-600"
                } text-xs font-semibold px-2.5 py-1 rounded-full`}
              >
                Hamper: {slip.hamper}
              </span>
            </div>

            {/* Delivery Info */}
            <div className="flex justify-between items-center mt-4">
              <div>
                <p className="text-sm text-gray-700 font-medium">
                  📅 {slip.deliveryDate}
                </p>
                <p className="text-sm text-gray-500">⏰ {slip.deliveryTime}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text text-left font-medium text-gray-500">
                  Status
                </span>
                {renderStatusControls(role)}
              </div>
            </div>
          </div>
        </div>
      </li>

      {previewUrl && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closePreview}
            aria-hidden="true"
          />
          <div className="relative max-w-3xl w-full mx-auto bg-white rounded shadow-lg">
            <div className="flex justify-between items-center p-3 border-b">
              <h4 className="font-semibold">
                Slip Preview: {previewSlip?.branch?.toUpperCase()}
              </h4>
              <button
                onClick={closePreview}
                className="p-2 rounded hover:bg-gray-100"
                aria-label="Close preview"
              >
                &times;
              </button>
            </div>
            <div className="p-4">
              <img
                src={previewUrl}
                alt="Slip preview"
                className="w-full h-[70vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Slip;
