"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useAuth } from "./context/AuthContext";
import { ROLE_PAGES } from "./constants/roles";
import axios from "axios";

export default function HomePage() {
  const {
    user: { role },
  } = useAuth();

  useEffect(() => {
    const deleteOldSlips = async () => {
      const lastCalled = localStorage.getItem("lastCalled");
      const today = new Date().toLocaleDateString();

      if (lastCalled !== today) {
        try {
          const response = await axios.delete(
            `${process.env.NEXT_PUBLIC_API_URL}/api/slips/old`
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
  }, []); // Empty dependency array ensures this runs only once on mount

  const allowedRoutes = ROLE_PAGES[role] || [];

  const featureCards = [
    {
      title: "Upload Slip",
      desc: "Simple form to place your custom cake orders slip with all the details.",
      icon: "📄",
      link: "/upload-slip",
    },
    {
      title: "Slip List",
      desc: "View and manage all your cake orders in one convenient dashboard.",
      icon: "🧾",
      link: "/slip-list",
    },
    {
      title: "Place Order",
      desc: "Simple form to place your custom cake orders with all the details you need.",
      icon: "🛍️",
      link: "/place-order",
    },
    {
      title: "Order Management",
      desc: "View and manage all your cake orders in one convenient dashboard.",
      icon: "📄",
      link: "/orders",
    },
    {
      title: "Timely Delivery",
      desc: "Track your orders and get your delicious cakes right on time for your special occasions.",
      icon: "⏰",
      link: "/delivery",
    },
  ];

  return (
    <main className="min-h-screen bg-pink-50 py-10 px-4">
      <section className="flex flex-col items-center text-center p-8">
        <div className="grid md:grid-cols-2 gap-4 mt-8 w-full max-w-4xl">
          {featureCards
            .filter((card) => allowedRoutes.includes(card.link))
            .map((card) => (
              <FeatureCard key={card.link} {...card} />
            ))}
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
