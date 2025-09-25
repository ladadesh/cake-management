"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import axios from "axios";

export default function HomePage() {
  useEffect(() => {
    const deleteOldSlips = async () => {
      const lastCalled = localStorage.getItem("lastCalled");
      const today = new Date().toLocaleDateString();

      if (lastCalled !== today) {
        try {
          const response = await axios.delete(
            "http://localhost:4001/api/slips/old"
          );

          if (response.status === 200) {
            console.log("Successfully deleted old slips.");
            localStorage.setItem("lastCalled", today);
          } else {
            console.error("Failed to delete old slips.");
          }
        } catch (error) {
          console.error("Error calling delete API:", error);
        }
      } else {
        console.log("Delete API already called today.");
      }
    };

    deleteOldSlips(); // Call the function when the component mounts
  }, []);

  return (
    <main className="min-h-screen bg-pink-50 py-10 px-4">
      <section className="flex flex-col items-center text-center p-8">
        <div className="grid md:grid-cols-2 gap-4 mt-8 w-full max-w-4xl">
          <FeatureCard
            title="Upload Slip"
            desc="Simple form to place your custom cake orders slip with all the details."
            icon="📄"
            link="upload-slip"
          />

          <FeatureCard
            title="Slip List"
            desc="View and manage all your cake orders in one convenient dashboard."
            icon="🧾"
            link="slip-list"
          />

          {/* <FeatureCard
            title="Place Order"
            desc="Simple form to place your custom cake orders with all the details you need."
            icon="🛍️"
            link="place-order"
          />
          <FeatureCard
            title="Order Management"
            desc="View and manage all your cake orders in one convenient dashboard."
            icon="📄"
            link="orders"
          />
          <FeatureCard
            title="Timely Delivery"
            desc="Track your orders and get your delicious cakes right on time for your special occasions."
            icon="⏰"
            link="/"
          /> */}
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  title,
  desc,
  icon,
  link,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  link: string;
}) {
  return (
    <Link href={link}>
      <div className="bg-white rounded-xl shadow p-4 text-center">
        <div className="text-3xl mb-2">{icon}</div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{desc}</p>
      </div>
    </Link>
  );
}
