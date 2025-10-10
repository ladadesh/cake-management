"use client";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { List, Table } from "lucide-react";
import Loader from "../components/Loader";
import { branches, cakeTypes, deliveryTypes } from "../constants/roles";
import Slip from "../components/Slip";
import { useUser } from "../hooks/useUser";
import SlipTableRow from "../components/SlipTableRow";

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
  deliveryMonth?: string;
}

export default function SlipList() {
  const { role } = useUser();
  const [slips, setSlips] = useState<Slip[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [selectedDeliveryType, setSelectedDeliveryType] = useState<
    string | null
  >(null);
  const [selectedCakeType, setSelectedCakeType] = useState<string | null>(null);
  const [selectedDateFilter, setSelectedDateFilter] = useState<
    "today" | "tomorrow" | null
  >("today"); // Default to today
  const [showFilters, setShowFilters] = useState(true);
  const [customDate, setCustomDate] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

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

  const minDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 5);
    return d.toISOString().split("T")[0];
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setCustomDate(date);
    setSelectedDateFilter(null); // Deselect today/tomorrow if a custom date is chosen
  };

  // Determine the date to fetch based on the filter state
  const dateToFetch = useMemo(() => {
    if (customDate) {
      return customDate;
    }
    if (selectedDateFilter === "today") {
      const d = new Date(today);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(d.getDate()).padStart(2, "0")}`;
    }
    if (selectedDateFilter === "tomorrow") {
      const d = new Date(tomorrow);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(d.getDate()).padStart(2, "0")}`;
    }
    return null;
  }, [customDate, selectedDateFilter, today, tomorrow]);

  useEffect(() => {
    if (dateToFetch) {
      fetchSlips(dateToFetch);
    } else {
      // Handle case where no date is selected, maybe fetch all or none
      setSlips([]);
    }
  }, [dateToFetch]);

  const fetchSlips = async (date: string) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/slips`,
        {
          params: { date },
        }
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
  }, [search, slips, selectedBranch, selectedDeliveryType, selectedCakeType]);

  return (
    <div className="h-screen flex flex-col bg-pink-50 ">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center ">
          <Loader />
        </div>
      )}

      {/* Top: sticky header / controls */}
      <div className="backdrop-blur-sm border-b relative pt-1">
        {showFilters && (
          <>
            <div className="px-4 py-2">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
                  <div className="flex flex-wrap items-center gap-2">
                    {role === "chef" ? (
                      <div className="flex-1 flex gap-3">
                        <button
                          onClick={() => {
                            setSelectedDateFilter("today");
                            setCustomDate("");
                          }}
                          className={`px-3 py-2 border rounded-md text-sm height-34px w-max ${
                            selectedDateFilter === "today"
                              ? "bg-pink-500 text-white border-pink-500"
                              : "bg-white text-gray-700 border-pink-400"
                          }`}
                        >
                          Today: {formatShortDate(today)}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDateFilter("tomorrow");
                            setCustomDate("");
                          }}
                          className={`px-3 py-2 border rounded-md text-sm height-34px w-max ${
                            selectedDateFilter === "tomorrow"
                              ? "bg-pink-500 text-white border-pink-500"
                              : "bg-white text-gray-700 border-pink-400"
                          }`}
                        >
                          Tomorrow: {formatShortDate(tomorrow)}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedDateFilter("today");
                            setCustomDate("");
                          }}
                          className={`px-3 py-2 border rounded-md text-sm height-34px w-max ${
                            selectedDateFilter === "today" && !customDate
                              ? "bg-pink-500 text-white border-pink-500"
                              : "bg-white text-gray-700 border-pink-400"
                          }`}
                        >
                          Today: {formatShortDate(today)}
                        </button>
                        <input
                          type="date"
                          value={customDate}
                          onChange={handleDateChange}
                          min={minDate}
                          className={`px-3 py-1.5 border rounded-md text-sm focus:outline-none  border-pink-400 focus:ring-2 focus:ring-pink-500 ${
                            customDate
                              ? "bg-pink-500 text-white border-pink-500"
                              : "bg-white text-gray-700"
                          }`}
                        />
                      </div>
                    )}
                  </div>

                  <div className="w-full md:w-72">
                    <input
                      aria-label="Search slips"
                      className="w-full px-2 py-2 border rounded-md shadow-sm focus:outline-none bg-white height-34px text-gray-700 border-pink-400 focus:ring-2 focus:ring-pink-500"
                      placeholder="Search by name, number, bill, branch..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <div className="flex-1">
                      <select
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        value={selectedBranch || "all"}
                        className="w-full px-3 py-1 border rounded-md shadow-sm focus:outline-none bg-white height-34px text-gray-700 border-pink-400 focus:ring-2 focus:ring-pink-500 height-34px"
                      >
                        <option value="all">All Branches</option>
                        {branches.map((b) => (
                          <option key={b.id} value={b.id.toLowerCase()}>
                            {b.name.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <select
                        onChange={(e) =>
                          setSelectedDeliveryType(e.target.value)
                        }
                        value={selectedDeliveryType || "all"}
                        className="w-full px-3 py-1 border rounded-md shadow-sm focus:outline-none bg-white height-34px text-gray-700 border-pink-400 focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="all">Delivery Type</option>
                        {deliveryTypes.map((b) => (
                          <option key={b.id} value={b.id.toLowerCase()}>
                            {b.name.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <select
                        onChange={(e) => setSelectedCakeType(e.target.value)}
                        value={selectedCakeType || "all"}
                        className="w-full px-3 py-1 border rounded-md shadow-sm focus:outline-none bg-white height-34px text-gray-700 border-pink-400 focus:ring-2 focus:ring-pink-500"
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
                </div>
                <div className="px-2 mx-2 flex justify-end height-34px">
                  {/* <div className="flex-shrink-0"> */}
                  {(role === "admin" || role === "staff") && (
                    <div className="flex items-center gap-2 border border-pink-400 rounded-md p-1">
                      <button
                        onClick={() => setViewMode("card")}
                        className={`p-1 rounded-md ${
                          viewMode === "card"
                            ? "bg-pink-500 text-white"
                            : "text-gray-600 hover:bg-pink-100"
                        }`}
                        aria-label="Card View"
                      >
                        <Table size={20} />
                      </button>
                      <button
                        onClick={() => setViewMode("table")}
                        className={`p-1 rounded-md ${
                          viewMode === "table"
                            ? "bg-pink-500 text-white"
                            : "text-gray-600 hover:bg-pink-100"
                        }`}
                        aria-label="Table View"
                      >
                        <List size={20} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
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
            <>
              {viewMode === "card" ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredSlips.map((slip) => (
                    <Slip slip={slip} key={slip._id} />
                  ))}
                </ul>
              ) : (
                <div className="bg-white shadow-md rounded-lg">
                  <SlipTableRow filteredSlips={filteredSlips} />
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
