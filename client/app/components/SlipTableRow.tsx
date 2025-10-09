"use client";
import React, { useState, useEffect } from "react";

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
  status?: string | string[];
  deliveryMonth?: string;
  notes?: string;
}

interface SlipTableRowProps {
  filteredSlips: SlipInterface[];
}

const SlipTableRow = ({ filteredSlips }: SlipTableRowProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewSlip, setPreviewSlip] = useState<SlipInterface | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePreview();
    };
    if (previewUrl) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openPreview = (url?: string | null, slip?: SlipInterface | null) => {
    if (!url) return;
    setPreviewUrl(url);
    setPreviewSlip(slip ?? null);
  };

  const closePreview = () => {
    setPreviewUrl(null);
    setPreviewSlip(null);
  };

  return (
    <>
      <table className="min-w-full leading-normal block md:table">
        <thead className="hidden md:table-header-group">
          <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm ">
            <th className="px-5 py-3 font-semibold">Bill #</th>
            <th className="px-5 py-3 font-semibold">Branch</th>
            <th className="px-5 py-3 font-semibold">Customer</th>
            <th className="px-5 py-3 font-semibold">Number</th>
            <th className="px-5 py-3 font-semibold">Delivery</th>
            <th className="px-5 py-3 font-semibold">Type</th>
            <th className="px-5 py-3 font-semibold">Cake</th>
            <th className="px-5 py-3 font-semibold">Hamper</th>
          </tr>
        </thead>
        <tbody className="block md:table-row-group">
          {filteredSlips.map((slip) => (
            <tr
              key={slip._id}
              className="block md:table-row border-b border-gray-200 hover:bg-gray-50 mb-4 md:mb-0 cursor-pointer my-2"
              onClick={() => openPreview(slip.imageUrl, slip)}
            >
              <td
                className="px-5 py-3 text-sm block md:table-cell"
                data-label="Bill #"
              >
                <span className="font-bold md:hidden">Bill #: </span>
                {slip.billNumber}
              </td>
              <td
                className="px-5 py-3 text-sm block md:table-cell"
                data-label="Branch"
              >
                <span className="font-bold md:hidden">Branch: </span>
                {slip.branch?.toUpperCase()}
              </td>
              <td
                className="px-5 py-3 text-sm block md:table-cell"
                data-label="Customer"
              >
                <span className="font-bold md:hidden">Customer: </span>
                {slip.customerName}
              </td>
              <td
                className="px-5 py-3 text-sm block md:table-cell"
                data-label="Number"
              >
                <span className="font-bold md:hidden">Number: </span>
                {slip.customerNumber}
              </td>
              <td
                className="px-5 py-3 text-sm block md:table-cell"
                data-label="Delivery"
              >
                <span className="font-bold md:hidden">Delivery: </span>
                {slip.deliveryDate}-{slip.deliveryMonth} at {slip.deliveryTime}
              </td>
              <td
                className="px-5 py-3 text-sm capitalize block md:table-cell"
                data-label="Type"
              >
                <span className="font-bold md:hidden">Type: </span>
                {slip.deliveryType}
              </td>
              <td
                className="px-5 py-3 text-sm capitalize block md:table-cell"
                data-label="Cake"
              >
                <span className="font-bold md:hidden">Cake: </span>
                {slip.cakeType}
              </td>
              <td
                className="px-5 py-3 text-sm block md:table-cell"
                data-label="Hamper"
              >
                <span className="font-bold md:hidden">Hamper: </span>
                {slip.hamper}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

export default SlipTableRow;
