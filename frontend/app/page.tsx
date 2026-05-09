"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/login");
    }
  }, []);

  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-2xl">Welcome, you are logged in ✅</h1>
    </div>
  );
}