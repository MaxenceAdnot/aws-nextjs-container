"use client";

import { useEffect, useState } from "react";

export default function Counter() {
  const [count, setCount] = useState<number | null>(null);

  const fetchCounter = async () => {
    try {
      const response = await fetch("/api/counter");
      if (response.ok) {
        const data = await response.json();
        setCount(data.counter);
      } else {
        console.error("Failed to increment counter value");
      }
    } catch (error) {
      console.error("Error increment counter value:", error);
    }
  };

  const resetCounter = async () => {
    try {
      const response = await fetch("/api/counter", { method: "DELETE" });
      if (response.ok) {
        setCount(0);
      } else {
        console.error("Failed to reset counter value");
      }
    } catch (error) {
      console.error("Error resetting counter value:", error);
    }
  };

  // Fetch the initial counter value
  useEffect(() => {
    fetchCounter();
  }, []);

  // Condition with count !== null to prevent rendering the text 'Hit counter;' before the initial value is fetched
  return (
    <div className="flex flex-col items-center p-4">
      {count !== null ? (
        <>
          <p className="text-2xl font-bold text-gray-800 mb-4">
            Hit counter: {count}
          </p>
          <div className="flex flex-row space-x-4">
            <button
              className="px-2 py-1 text-sm text-white bg-gray-400 rounded hover:bg-gray-600"
              onClick={fetchCounter}
            >
              Increment
            </button>
            <button
              className="px-2 py-1 text-sm text-white bg-gray-500 rounded hover:bg-gray-700"
              onClick={resetCounter}
            >
              Reset
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
