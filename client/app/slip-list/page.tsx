"use client";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import { branches, cakeTypes, deliveryTypes } from "../constants/roles";

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewSlip, setPreviewSlip] = useState<Slip | null>(null);

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePreview();
      }
    };
    if (previewUrl) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [previewUrl]);

  const fetchSlips = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:4001/api/slips");
      setSlips(res.data || []);
    } catch (err) {
      console.error("Failed to fetch slips", err);
    } finally {
      setLoading(false);
    }
  };

  const openPreview = (url?: string | null, slip?: Slip | null) => {
    if (!url) return; // don't open preview without a valid URL
    setPreviewUrl(url);
    setPreviewSlip(slip ?? null);
  };

  const closePreview = () => {
    setPreviewUrl(null);
    setPreviewSlip(null);
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
    <div className="h-screen flex flex-col">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center ">
          <Loader />
        </div>
      )}

      {/* Top: sticky header / controls */}
      <div className="bg-white/95 backdrop-blur-sm border-b">
        <div className="p-3 mx-5">
          {branches?.length > 0 && (
            <div className="mb-2 flex items-center justify-between gap-3 flex-col md:flex-row sm:flex-row">
              <div className="flex items-center gap-3">
                <div className="flex flex-wrap gap-3">
                  <select
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    value={selectedBranch || "all"}
                    className="px-3 py-2 border rounded-md shadow-sm focus:outline-none bg-pink-50 text-gray-700 border-pink-400 focus:ring-2 focus:ring-pink-500"
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
                    className="px-3 py-2 border rounded-md shadow-sm focus:outline-none bg-pink-50 text-gray-700 border-pink-400 focus:ring-2 focus:ring-pink-500"
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
                    className="px-3 py-2 border rounded-md shadow-sm focus:outline-none bg-pink-50 text-gray-700 border-pink-400 focus:ring-2 focus:ring-pink-500"
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
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none bg-pink-50 text-gray-700 border-pink-400 focus:ring-2 focus:ring-pink-500"
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
                        : "bg-pink-50 text-gray-700 border-pink-400"
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
                        : "bg-pink-50 text-gray-700 border-pink-400"
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
                        : "bg-pink-50 text-gray-700 border-pink-400"
                    }`}
                  >
                    Tomorrow: {formatShortDate(tomorrow)}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scrollable content area: only this scrolls */}
      <main className="flex-1 overflow-auto p-5">
        <div className="mx-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-semibold">Uploaded Slips</h3>
          </div>

          {filteredSlips.length === 0 ? (
            <p className="text-gray-500">No slips found.</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSlips.map((slip) => (
                <li key={slip._id}>
                  <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition overflow-hidden">
                    <div className="relative p-4 bg-gray-50">
                      <img
                        src={
                          (slip.imageUrl && slip.imageUrl) || "/placeholder.png"
                        }
                        alt={`Slip for ${slip.branch}`}
                        className="w-full h-64 object-contain rounded-md border"
                      />
                    </div>

                    <div className="p-6">
                      <h4 className="text-xl font-semibold mb-2">
                        {slip.branch?.toUpperCase() || "Branch"}
                      </h4>

                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-sm font-medium text-gray-600 text-transform: uppercase">
                          {slip.deliveryType || "Delivery"}
                        </span>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-medium text-gray-700">
                            {slip.deliveryDate}
                          </span>
                          <span className="text-sm text-gray-500 bg-pink-50 px-2 py-1 rounded">
                            {slip.deliveryTime}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 gap-2">
                        <button
                          onClick={() => openPreview(slip.imageUrl, slip)}
                          className="inline-flex items-center px-4 py-2 bg-pink-500 hover:bg-pink-700 text-white text-base rounded-md cursor-pointer"
                        >
                          View
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="ml-2 bi bi-eye"
                            viewBox="0 0 16 16"
                          >
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                          </svg>
                        </button>
                        <a
                          href={slip.imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-gray-500 underline"
                        >
                          Open image
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      {/* Preview Modal */}
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

          <div className="relative max-w-3xl w-full mx-auto bg-white rounded shadow-lg overflow-hidden">
            <div className="flex justify-between items-center p-3 border-b">
              <div>
                <h4 className="font-semibold">Slip Preview</h4>
                {previewSlip?.branch && (
                  <p className="text-sm text-gray-500">{previewSlip.branch}</p>
                )}
              </div>
              <button
                onClick={closePreview}
                className="p-2 rounded hover:bg-gray-100"
                aria-label="Close preview"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-700"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="p-4">
              <img
                src={previewUrl}
                alt={
                  previewSlip
                    ? `Slip for ${previewSlip.branch}`
                    : "Slip preview"
                }
                className="w-full h-[60vh] object-contain bg-gray-50"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
