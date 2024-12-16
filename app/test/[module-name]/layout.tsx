"use client";

import { useAuth } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuth) {
      router.replace("/login");
    }
  }, [isAuth, router]);
  return (
    <div className="min-h-screen h-fit relative bg-gradient-to-r">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800 via-[#2C0368] to-[#0a0a0a]"></div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <div className="relative min-h-screen flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
