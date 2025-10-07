"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Slip from "../components/Slip";

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
  status?: string;
  topper?: string;
  hamper?: string;
}

export default function DeliveryPage() {
  const [slips, setSlips] = useState<Slip[]>([]);
  const [loading, setLoading] = useState(false);

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
            <Slip slip={slip} key={slip._id} />
          ))}
        </ul>
      )}
    </div>
  );
}
