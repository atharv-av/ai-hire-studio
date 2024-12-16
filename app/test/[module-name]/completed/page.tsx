import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function CompletedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-black/70 flex flex-col gap-4 mx-4 max-w-2xl p-5 rounded-2xl lg:shadow-2xl border border-slate-700">
        <p className="text-white font-semibold lg:text-4xl text-2xl">
          Thanks for attempting the test
        </p>
        <p className="text-white font-semibold lg:text-2xl text-base">
          You will recieve an email with your results soon.
        </p>
        <Link href="/tests">
          <Button
            size="lg"
            className="w-full md:w-auto rounded-2xl bg-white hover:bg-white/80"
          >
            Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const modules = [
    { "module-name": "React" },
    { "module-name": "MERN Stack" },
    { "module-name": "Machine Learning" },
    { "module-name": "Human Resource" },
  ];

  return modules.map((module) => ({
    "module-name": module["module-name"],
  }));
}

