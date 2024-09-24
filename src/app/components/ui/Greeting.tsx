"use client";
import React, { useEffect, useState } from "react";

const Greeting = () => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 11) {
      setGreeting("Selamat Pagi");
    } else if (currentHour >= 11 && currentHour < 15) {
      setGreeting("Selamat Siang");
    } else if (currentHour >= 15 && currentHour < 18) {
      setGreeting("Selamat Sore");
    } else {
      setGreeting("Selamat Malam");
    }
  }, []);
  return <div className="text-lg font-urbanist text-gray-500">{greeting} . . .</div>;
};

export default Greeting;
