"use client";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import { branches, cakeTypes, deliveryTypes } from "../constants/roles";
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
  topper?: string;
  hamper?: string;
}

export default function SlipList() {
  const [slips, setSlips] = useState<Slip[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [selectedDeliveryType, setSelectedDeliveryType] = useState<
    string | null
  >(null);
  const [selectedCakeType, setSelectedCakeType] = useState<string | null>(null);
  const [selectedDateFilter, setSelectedDateFilter] = useState<
    "all" | "today" | "tomorrow"
  >("all");
  const [showFilters, setShowFilters] = useState(true);

  // compute today's and tomorrow's dates for display next to branch buttons
  const today = useMemo(() => new Date(), []);
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  }, []);

  // use a deterministic formatter (UTC-based) so server and client render the same string
  const formatShortDate = (d: Date) => {
    // map month index to short month names (English) to avoid locale differences
    const shortMonths = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = d.getDate();
    const month = shortMonths[d.getMonth()];
    return `${day} ${month}`;
  };

  // helper: produce local YYYY-MM-DD and HH:MM (local time) rather than using toISOString (UTC)
  const formatLocalIso = (d: Date) =>
    `${d.getDate()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getFullYear()
    ).padStart(2, "0")}`;

  // compute ISO-like local date strings to compare with slips stored dates (YYYY-MM-DD)
  const todayIso = useMemo(() => {
    const d = new Date(today);
    return formatLocalIso(d);
  }, [today]);

  const tomorrowIso = useMemo(() => {
    const d = new Date(tomorrow);
    return formatLocalIso(d);
  }, [tomorrow]);

  useEffect(() => {
    fetchSlips();
  }, []);

  const fetchSlips = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/slips`
      );
      setSlips(res.data || []);
    } catch (err) {
      console.error("Failed to fetch slips", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSlips = useMemo(() => {
    const q = search.trim().toLowerCase();

    return slips.filter((s) => {
      // branch filter
      if (selectedBranch && selectedBranch !== "all") {
        if (String(s.branch || "").toLowerCase() !== selectedBranch) {
          return false;
        }
      }

      // delivery type filter
      if (selectedDeliveryType && selectedDeliveryType !== "all") {
        if (
          String(s.deliveryType || "").toLowerCase() !== selectedDeliveryType
        ) {
          return false;
        }
      }

      // cake type filter
      if (selectedCakeType && selectedCakeType !== "all") {
        if (String(s.cakeType || "").toLowerCase() !== selectedCakeType) {
          return false;
        }
      }

      // date filter: if selected, compare slip.deliveryDate (stored as YYYY-MM-DD)
      if (selectedDateFilter === "today") {
        if (String(s.deliveryDate || "").slice(0, 10) !== todayIso)
          return false;
      } else if (selectedDateFilter === "tomorrow") {
        if (String(s.deliveryDate || "").slice(0, 10) !== tomorrowIso)
          return false;
      }

      if (!q) return true;

      return (
        String(s.branch || "")
          .toLowerCase()
          .includes(q) ||
        String(s.deliveryType || "")
          .toLowerCase()
          .includes(q) ||
        String(s.deliveryDate || "")
          .toLowerCase()
          .includes(q) ||
        String(s.customerName || "")
          .toLowerCase()
          .includes(q) ||
        String(s.customerNumber || "")
          .toLowerCase()
          .includes(q) ||
        String(s.billNumber || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [
    search,
    slips,
    selectedBranch,
    selectedDeliveryType,
    selectedCakeType,
    selectedDateFilter,
    todayIso,
    tomorrowIso,
  ]);

  return (
    <div className="h-screen flex flex-col bg-pink-50 ">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center ">
          <Loader />
        </div>
      )}

      {/* Top: sticky header / controls */}
      <div className="backdrop-blur-sm border-b relative">
        {showFilters && (
          <div className="px-3 mx-4">
            {branches?.length > 0 && (
              <div className="flex items-center justify-between gap-3 flex-col md:flex-row sm:flex-row">
                <div className="flex items-center gap-3">
                  <div className="flex flex-wrap gap-3">
                    <select
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      value={selectedBranch || "all"}
                      className="px-3 py-2 border rounded-md shadow-sm focus:outline-none bg-white text-gray-700 border-pink-400 focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="all">All Branches</option>
                      {branches.map((b) => (
                        <option key={b.id} value={b.id.toLowerCase()}>
                          {b.name.toUpperCase()}
                        </option>
                      ))}
                    </select>

                    <select
                      onChange={(e) => setSelectedDeliveryType(e.target.value)}
                      value={selectedDeliveryType || "all"}
                      className="px-3 py-2 border rounded-md shadow-sm focus:outline-none bg-white text-gray-700 border-pink-400 focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="all">Delivery Type</option>
                      {deliveryTypes.map((b) => (
                        <option key={b.id} value={b.id.toLowerCase()}>
                          {b.name.toUpperCase()}
                        </option>
                      ))}
                    </select>

                    <select
                      onChange={(e) => setSelectedCakeType(e.target.value)}
                      value={selectedCakeType || "all"}
                      className="px-3 py-2 border rounded-md shadow-sm focus:outline-none bg-white text-gray-700 border-pink-400 focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="all">Cake Type</option>
                      {cakeTypes.map((b) => (
                        <option key={b.id} value={b.id.toLowerCase()}>
                          {b.name.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="w-72 sm:my-2">
                  <input
                    aria-label="Search slips"
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none bg-white text-gray-700 border-pink-400 focus:ring-2 focus:ring-pink-500"
                    placeholder="Search by name, number, bill, etc..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 flex flex-wrap gap-3">
                    <button
                      onClick={() => setSelectedDateFilter("all")}
                      className={`px-3 py-2 border rounded-md text-sm ${
                        selectedDateFilter === "all"
                          ? "bg-pink-500 text-white border-pink-500"
                          : "bg-white text-gray-700 border-pink-400"
                      }`}
                    >
                      All
                    </button>

                    <button
                      onClick={() =>
                        setSelectedDateFilter(
                          selectedDateFilter === "today" ? "all" : "today"
                        )
                      }
                      className={`px-3 py-2 border rounded-md text-sm ${
                        selectedDateFilter === "today"
                          ? "bg-pink-500 text-white border-pink-500"
                          : "bg-white text-gray-700 border-pink-400"
                      }`}
                    >
                      Today: {formatShortDate(today)}
                    </button>

                    <button
                      onClick={() =>
                        setSelectedDateFilter(
                          selectedDateFilter === "tomorrow" ? "all" : "tomorrow"
                        )
                      }
                      className={`px-3 py-2 border rounded-md text-sm ${
                        selectedDateFilter === "tomorrow"
                          ? "bg-pink-500 text-white border-pink-500"
                          : "bg-white text-gray-700 border-pink-400"
                      }`}
                    >
                      Tomorrow: {formatShortDate(tomorrow)}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="flex justify-center w-full mt-1">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 -mb-4 bg-pink-300 hover:bg-pink-400 rounded-full z-10"
            aria-label={showFilters ? "Hide filters" : "Show filters"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 text-white-600 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable content area: only this scrolls */}
      <main className="flex-1 overflow-auto p-5">
        <div className="mx-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-semibold">Uploaded KOT</h3>
          </div>

          {filteredSlips.length === 0 ? (
            <p className="text-gray-500">No slips found.</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredSlips.map((slip) => (
                <Slip slip={slip} key={slip._id} />
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
