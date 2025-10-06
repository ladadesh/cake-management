"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader";

interface Slip {
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
}

export default function DeliveryPage() {
  const [slips, setSlips] = useState<Slip[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewSlip, setPreviewSlip] = useState<Slip | null>(null);

  useEffect(() => {
    const fetchDeliverySlips = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/slips?deliveryType=delivery`
        );
        setSlips(res.data || []);
      } catch (err) {
        console.error("Failed to fetch delivery slips", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliverySlips();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePreview();
    };
    if (previewUrl) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [previewUrl]);

  const openPreview = (url?: string | null, slip?: Slip | null) => {
    if (!url) return;
    setPreviewUrl(url);
    setPreviewSlip(slip ?? null);
  };

  const closePreview = () => {
    setPreviewUrl(null);
    setPreviewSlip(null);
  };

  return (
    <div className="min-h-screen bg-pink-50 p-4">
      {loading && <Loader />}

      <div className="mb-4">
        <h2 className="text-2xl font-bold text-pink-600 mb-4">
          KOT for Delivery
        </h2>
      </div>

      {slips.length === 0 ? (
        <p className="text-gray-500">No delivery slips found.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {slips.map((slip) => (
            <li
              key={slip._id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
              onClick={() => openPreview(slip.imageUrl, slip)}
            >
              <div className="relative p-4 bg-gray-50">
                <img
                  src={slip.imageUrl || "/placeholder.png"}
                  alt={`Slip for ${slip.branch}`}
                  className="w-full h-32 object-contain rounded-md border"
                />
              </div>
              <div className="p-3">
                <h4 className="font-semibold">{slip.branch?.toUpperCase()}</h4>
                <p className="text-sm text-gray-600">{slip.deliveryDate}</p>
                <p className="text-sm text-gray-500 bg-pink-50 px-2 py-1 rounded inline-block mt-1">
                  {slip.deliveryTime}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

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
    </div>
  );
}
