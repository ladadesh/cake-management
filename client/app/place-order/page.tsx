"use client";
import React, { useState } from "react";

export default function PlaceOrder() {
  interface FormData {
    bookingName: string;
    contactNumber: string;
    deliveryDate: string;
    deliveryTime: string;
    cakeKg: string;
    cakeShape: string;
    hamper: string;
    message: string;
    topper: string;
    deliveryType: string;
    address: string;
    takenBy: string;
    preparationDate: string;
    preparationTime: string;
    cakeDescription: string;
    total: number;
    paid: number;
    balance: number;
  }

  const [formData, setFormData] = useState<FormData>({
    bookingName: "",
    contactNumber: "",
    deliveryDate: "",
    deliveryTime: "",
    cakeKg: "",
    cakeShape: "",
    hamper: "",
    message: "",
    topper: "",
    deliveryType: "",
    address: "",
    takenBy: "",
    preparationDate: "",
    preparationTime: "",
    total: 0,
    balance: 0,
    paid: 0,
    cakeDescription: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Order Submitted:", formData);
  };

  return (
    <main className="min-h-screen bg-pink-50 py-6 px-4">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-pink-600 mb-2">
          Place Your Cake Order
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Booking Name */}
          <div className="col-span-2 md:col-span-1">
            <label className="block font-semibold mb-1">Booking Name</label>
            <input
              type="text"
              name="bookingName"
              value={formData.bookingName}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </div>

          {/* Contact Number */}
          <div className="col-span-2 md:col-span-1">
            <label className="block font-semibold mb-1">Contact Number</label>
            <input
              type="number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </div>

          {/* Delivery Date */}
          <div className="col-span-2 md:col-span-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="block font-semibold mb-1">Delivery Date</label>
              <input
                type="date"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleChange}
                className="input w-full"
                required
              />
            </div>

            {/* Delivery Time */}
            <div className="col-span-1">
              <label className="block font-semibold mb-1">Delivery Time</label>
              <input
                type="time"
                name="deliveryTime"
                value={formData.deliveryTime}
                onChange={handleChange}
                className="input w-full"
                required
              />
            </div>
          </div>

          <div className="col-span-2 md:col-span-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cake Kg */}
            <div className="col-span-1">
              <label className="block font-semibold mb-1">
                Cake Weight (in kg)
              </label>
              <select
                name="cakeKg"
                value={formData.cakeKg}
                onChange={handleChange}
                className="input w-full"
                required
              >
                <option value="">Select kg</option>
                <option value="0.5">0.5 kg</option>
                <option value="1">1 kg</option>
                <option value="1.5">1.5 kg</option>
                <option value="2">2 kg</option>
                <option value="3">3 kg</option>
                <option value="5">5 kg</option>
              </select>
            </div>
            {/* Cake Shape */}
            <div className="col-span-1">
              <label className="block font-semibold mb-1">Cake Shape</label>
              <select
                name="cakeShape"
                value={formData.cakeShape}
                onChange={handleChange}
                className="input w-full"
                required
              >
                <option value="">Select shape</option>
                <option value="heart">Heart</option>
                <option value="round">Round</option>
                <option value="square">Square</option>
                <option value="singleTier">Single Tier</option>
                <option value="doubleTier">Double Tier</option>
                <option value="rectangle">Rectangle</option>
              </select>
            </div>
          </div>

          {/* Cake Description */}
          <div className="col-span-2">
            <label className="block font-semibold mb-1">Cake Description</label>
            <textarea
              name="cakeDescription"
              value={formData.cakeDescription}
              onChange={handleChange}
              className="input w-full"
              placeholder="e.g. double tier, fix fruit cake"
              rows={1}
            />
          </div>

          <div className="col-span-2 md:col-span-1 grid grid-cols-1 md:grid-cols-2">
            {/* Cake Hamper */}
            <div className="col-span-1">
              <label className="block font-semibold mb-1">Cake Hamper</label>
              <div className="flex gap-4 mt-3">
                <label>
                  <input
                    type="radio"
                    name="hamper"
                    value="yes"
                    onChange={handleChange}
                    checked={formData.hamper === "yes"}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="hamper"
                    value="no"
                    onChange={handleChange}
                    checked={formData.hamper === "no"}
                  />{" "}
                  No
                </label>
              </div>
            </div>
            {/* Cake Topper */}
            <div className="col-span-1">
              <label className="block font-semibold mb-1">Cake Topper</label>
              <div className="flex gap-4 mt-3">
                <label>
                  <input
                    type="radio"
                    name="topper"
                    value="yes"
                    onChange={handleChange}
                    checked={formData.topper === "yes"}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="topper"
                    value="no"
                    onChange={handleChange}
                    checked={formData.topper === "no"}
                  />{" "}
                  No
                </label>
              </div>
            </div>
          </div>

          {/* Cake message*/}
          <div className="col-span-2 md:col-span-1">
            <label className="block font-semibold mb-1">Message on Cake</label>
            <input
              type="text"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="input w-full"
              placeholder="e.g. Happy Birthday Riya!"
              required
            />
          </div>

          <div className="col-span-2 md:col-span-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* total amount */}
            <div className="col-span-1">
              <label className="block font-semibold mb-1">Total</label>
              <input
                type="number"
                name="total"
                value={formData.total}
                onChange={handleChange}
                className="input w-full"
                required
              />
            </div>

            {/* Paid */}
            <div className="col-span-1">
              <label className="block font-semibold mb-1">Paid</label>
              <input
                type="number"
                name="paid"
                value={formData.paid}
                onChange={handleChange}
                className="input w-full"
                required
              />
            </div>
          </div>

          <div className="col-span-2 md:col-span-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* balance */}
            <div className="col-span-1">
              <label className="block font-semibold mb-1">Balance</label>
              <input
                type="number"
                name="balance"
                disabled
                value={formData.total - formData.paid}
                // onChange={handleChange}
                className="input w-full"
                required
              />
            </div>

            {/* Delivery Type */}
            <div className="col-span-1 md:col-span-1">
              <label className="block font-semibold mb-1">Delivery Type</label>
              <div className="flex gap-4 mt-3">
                <label>
                  <input
                    type="radio"
                    name="deliveryType"
                    value="pickup"
                    onChange={handleChange}
                    checked={formData.deliveryType === "pickup"}
                  />{" "}
                  Pickup
                </label>
                <label>
                  <input
                    type="radio"
                    name="deliveryType"
                    value="delivery"
                    onChange={handleChange}
                    checked={formData.deliveryType === "delivery"}
                  />{" "}
                  Delivery
                </label>
              </div>
            </div>
          </div>

          {/* Conditional Address Field */}
          {formData.deliveryType === "delivery" && (
            <div className="col-span-2">
              <>
                <label className="block font-semibold mb-1">
                  Delivery Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input w-full"
                  placeholder="Enter your address"
                  required
                />
              </>
            </div>
          )}

          {/* Order taken by */}
          <div className="col-span-2 md:col-span-1">
            <label className="block font-semibold mb-1">Order Taken By</label>
            <input
              type="text"
              name="takenBy"
              value={formData.takenBy}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </div>

          {/* Preparation Date & Time */}
          {/* Preparation Date */}
          <div className="col-span-2 md:col-span-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="block font-semibold mb-1">
                Preparation Date
              </label>
              <input
                type="date"
                name="preparationDate"
                value={formData.preparationDate}
                onChange={handleChange}
                className="input w-full"
                required
              />
            </div>

            {/* Preparation Time */}
            <div className="col-span-1">
              <label className="block font-semibold mb-1">
                Preparation Time
              </label>
              <input
                type="time"
                name="preparationTime"
                value={formData.preparationTime}
                onChange={handleChange}
                className="input w-full"
                required
              />
            </div>
          </div>

          {/*  */}

          {/* Submit Button */}
          <div className="col-span-2">
            <button
              type="submit"
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-md w-full"
            >
              Submit Order
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
