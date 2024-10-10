"use client";

import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import Greeting from "./components/ui/Greeting";
import Clock from "./components/ui/Clock/Clock";
import { FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  router.push("/dashboard");
}
