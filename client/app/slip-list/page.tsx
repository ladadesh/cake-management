"use client";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Loader from "../components/Loader";

const page = () => {
  const [slips, setSlips] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewSlip, setPreviewSlip] = useState<any | null>(null);

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

  const openPreview = (url: string, slip: any) => {
    setPreviewUrl(url);
    setPreviewSlip(slip);
  };

  const closePreview = () => {
    setPreviewUrl(null);
    setPreviewSlip(null);
  };

  const filteredSlips = useMemo(() => {
    if (!search.trim()) return slips;
    const q = search.toLowerCase();
    return slips.filter((s) => {
      return (
        String(s.branch || "")
          .toLowerCase()
          .includes(q) ||
        String(s.deliveryType || "")
          .toLowerCase()
          .includes(q) ||
        String(s.deliveryDate || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [search, slips]);

  return (
    <div className="mt-8 relative mx-5">
      {loading && <Loader />}

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold">Uploaded Slips</h3>
        <div className="flex items-center gap-2">
          <input
            aria-label="Search slips"
            className="px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search by branch, type or date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filteredSlips.length === 0 ? (
        <p className="text-gray-500">No slips found.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSlips.map((slip) => (
            <li key={slip._id}>
              <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition overflow-hidden">
                <div className="relative p-4 bg-gray-50">
                  <img
                    src={slip.imageUrl}
                    alt={`Slip for ${slip.branch}`}
                    className="w-full h-48 object-contain rounded-md border"
                  />
                </div>

                <div className="p-4">
                  <h4 className="text-md font-semibold mb-1">
                    {slip.branch || "Branch"}
                  </h4>
                  <p className="text-sm text-gray-500 mb-2">
                    {slip.deliveryType || "Delivery"} •{" "}
                    {slip.deliveryDate || "-"}
                  </p>

                  <div className="flex items-center justify-between"></div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <button
                      onClick={() => openPreview(slip.imageUrl, slip)}
                      className="inline-flex items-center px-3 py-2 bg-pink-500 hover:bg-pink-700 text-white text-sm rounded-md"
                    >
                      View
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
};

export default page;
