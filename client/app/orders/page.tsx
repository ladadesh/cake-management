"use client";
import React from "react";

interface Order {
  id: string;
  name: string;
  cakeType: string;
  deliveryDate: string;
  status: string;
}

export default function OrdersPage() {
  // Normally, orders would be fetched from a database or API
  const orders: Order[] = []; // Simulate empty state

  return (
    <main className="min-h-screen bg-pink-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-pink-600 mb-6">
          Your Cake Orders
        </h2>
        {orders.length === 0 ? (
          <div className="text-center text-gray-500">
            <p className="text-lg">No orders yet</p>
            <p className="mb-4">Place your first cake order to see it here</p>
            <a
              href="/place-order"
              className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-md"
            >
              Place an Order
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2">Order ID</th>
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">Cake Details</th>
                  <th className="px-4 py-2">Delivery Date</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-2">{order.id}</td>
                    <td className="px-4 py-2">{order.name}</td>
                    <td className="px-4 py-2">{order.cakeType}</td>
                    <td className="px-4 py-2">{order.deliveryDate}</td>
                    <td className="px-4 py-2">{order.status}</td>
                    <td className="px-4 py-2">
                      <button className="text-pink-500">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
