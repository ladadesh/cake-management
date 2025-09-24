"use client";

import React, { useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import { branches } from "../constants/roles";

export default function UploadSlip() {
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryDay, setDeliveryDay] = useState("");
  const [deliveryMonth, setDeliveryMonth] = useState("");
  const [deliveryYear, setDeliveryYear] = useState("");
  // replaced single time string with separate selects for hour/minute/period
  const [deliveryHour, setDeliveryHour] = useState("");
  const [deliveryMinute, setDeliveryMinute] = useState("");
  const [deliveryPeriod, setDeliveryPeriod] = useState("");
  const [branch, setBranch] = useState("");
  const [deliveryType, setDeliveryType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const deliveryTypes = [
    { id: "delivery", name: "Delivery" },
    { id: "pickup", name: "Pick Up" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (!f) {
      setFile(null);
      setPreview(null);
      return;
    }
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return;

    // Validate separate date fields and combine into ISO string
    if (!deliveryDay || !deliveryMonth || !deliveryYear) {
      alert("Please provide day, month and year for delivery date.");
      setLoading(false);
      return;
    }

    // Validate time selects and convert to 24-hour HH:MM
    if (!deliveryHour || !deliveryMinute || !deliveryPeriod) {
      alert("Please provide delivery time (hour, minute and AM/PM).");
      setLoading(false);
      return;
    }

    const timeStr = `${deliveryHour}:${deliveryMinute} ${deliveryPeriod}`; // keep original for display

    // Pad day/month to 2 digits
    const dd = deliveryDay.padStart(2, "0");
    const mm = deliveryMonth.padStart(2, "0");
    const isoDate = `${dd}-${mm}-${deliveryYear}`;

    const formData = new FormData();
    formData.append("slip", file);
    formData.append("deliveryDate", isoDate);
    formData.append("deliveryTime", timeStr);
    formData.append("deliveryType", deliveryType);
    formData.append("branch", branch);

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:4001/api/slips",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Clear fields after successful upload
      setFile(null);
      setPreview(null);
      setDeliveryDate("");
      setDeliveryDay("");
      setDeliveryMonth("");
      setDeliveryYear("");
      setDeliveryHour("");
      setDeliveryMinute("");
      setDeliveryPeriod("");
      setDeliveryType("");
      setBranch("");
    } catch (error) {
      console.error("Upload request error:", error);
      // For now we just log. Could set an error state to show to the user.
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-pink-50 py-6 px-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md relative">
        <h2 className="text-2xl font-bold text-pink-600 mb-4">
          Upload Info Slip
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Date</label>
              <div className="flex items-center gap-2">
                <select
                  value={deliveryDay}
                  onChange={(e) => setDeliveryDay(e.target.value)}
                  className="input w-24 border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                  disabled={loading}
                >
                  <option value="">Day</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={String(d)}>
                      {d}
                    </option>
                  ))}
                </select>

                <select
                  value={deliveryMonth}
                  onChange={(e) => setDeliveryMonth(e.target.value)}
                  className="input w-36 border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                  disabled={loading}
                >
                  <option value="">Month</option>
                  {[
                    "01-January",
                    "02-February",
                    "03-March",
                    "04-April",
                    "05-May",
                    "06-June",
                    "07-July",
                    "08-August",
                    "09-September",
                    "10-October",
                    "11-November",
                    "12-December",
                  ].map((m) => {
                    const [num, name] = m.split("-");
                    return (
                      <option key={num} value={num}>
                        {name}
                      </option>
                    );
                  })}
                </select>

                <select
                  value={deliveryYear}
                  onChange={(e) => setDeliveryYear(e.target.value)}
                  className="input w-28 border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                  disabled={loading}
                >
                  <option value="">Year</option>
                  {(() => {
                    const current = new Date().getFullYear();
                    const years = [] as number[];
                    for (let y = current - 3; y <= current + 3; y++)
                      years.push(y);
                    return years.map((y) => (
                      <option key={y} value={String(y)}>
                        {y}
                      </option>
                    ));
                  })()}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Time</label>
              <div className="flex items-center gap-2">
                <select
                  value={deliveryHour}
                  onChange={(e) => setDeliveryHour(e.target.value)}
                  className="input w-24 border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                  disabled={loading}
                >
                  <option value="">Hour</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                    <option key={h} value={String(h)}>
                      {h}
                    </option>
                  ))}
                </select>

                <select
                  value={deliveryMinute}
                  onChange={(e) => setDeliveryMinute(e.target.value)}
                  className="input w-28 border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                  disabled={loading}
                >
                  <option value="">Minutes</option>
                  {["15", "30", "45"].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>

                <select
                  value={deliveryPeriod}
                  onChange={(e) => setDeliveryPeriod(e.target.value)}
                  className="input w-24 border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                  disabled={loading}
                >
                  <option value="">AM/PM</option>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Branch</label>
            <select
              name="branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="input w-full border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
              disabled={loading}
            >
              <option value="">Select branch</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Delivery Type</label>
            <select
              name="deliveryType"
              value={deliveryType}
              onChange={(e) => setDeliveryType(e.target.value)}
              className="input w-full border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
              disabled={loading}
            >
              <option value="">Select delivery type</option>
              {deliveryTypes.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">
              Upload Slip (image)
            </label>

            <div className="flex items-center gap-3">
              <label
                htmlFor="slip-file"
                className="flex  justify-center items-center gap-2 px-3 py-2 bg-white border border-pink-500 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 w-72"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-pink-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M3 14a1 1 0 011-1h12a1 1 0 011 1v1a2 2 0 01-2 2H4a2 2 0 01-2-2v-1z" />
                  <path d="M7 8l3-3 3 3V1h2v9H5V1h2v7z" />
                </svg>
                <span className="text-sm text-gray-700">Choose image</span>
              </label>

              <input
                id="slip-file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
                required
                disabled={loading}
              />

              {file ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                      // reset the underlying input value by selecting it and clearing
                      const inp = document.getElementById(
                        "slip-file"
                      ) as HTMLInputElement | null;
                      if (inp) inp.value = "";
                    }}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <span className="text-sm text-gray-400">No file chosen</span>
              )}
            </div>
          </div>

          {preview && (
            <div className="mt-2">
              <label className="block font-semibold mb-1">Preview</label>
              <img
                src={preview}
                alt="slip preview"
                className="max-h-64 rounded-md shadow-sm"
              />
            </div>
          )}

          <div>
            <button
              type="submit"
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-md w-full disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <g>
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        strokeOpacity="0.25"
                        stroke="#fff"
                        strokeWidth="4"
                      />
                      <path fill="#fff">
                        <animateTransform
                          attributeType="xml"
                          attributeName="transform"
                          type="rotate"
                          from="0 12 12"
                          to="360 12 12"
                          dur="1s"
                          repeatCount="indefinite"
                        />
                      </path>
                    </g>
                  </svg>
                  Uploading...
                </span>
              ) : (
                "Upload Slip"
              )}
            </button>
          </div>
        </form>

        {loading && <Loader />}
      </div>
    </main>
  );
}
