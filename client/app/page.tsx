import React from "react";
import Link from "next/link";
// import { useState } from "react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-pink-50 py-10 px-4">
      <section className="flex flex-col items-center text-center p-8">
        {/* <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl w-full">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-left mb-6 md:mb-0">
              <h1 className="text-2xl font-bold text-pink-600 mb-2">
                Cake Affair
              </h1>
              <p className="mb-4">
                Delicious custom cakes for all your special occasions. Order now
                and make your celebrations even sweeter!
              </p>
              <ul className="text-sm space-y-1 mb-4">
                <li>✔ Custom designs for any occasion</li>
                <li>✔ Fresh, high-quality ingredients</li>
                <li>✔ Easy ordering and management</li>
              </ul>
              <Link
                href="/place-order"
                className="bg-pink-500 text-white py-2 px-4 rounded"
              >
                Order Now
              </Link>
            </div>
            <img src="/cake.png" alt="cake" className="w-32 md:w-48" />
          </div>
        </div> */}

        <div className="grid md:grid-cols-2 gap-4 mt-8 w-full max-w-4xl">
          <FeatureCard
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
          />
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
