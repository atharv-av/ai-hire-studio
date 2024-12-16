"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

// Define the props interface
interface ServiceCardProps {
  image: string;
  badge: string;
  title: string;
  content: string;
  btnText: string;
  btnTarget: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  image,
  badge,
  title,
  content,
  btnText,
  btnTarget,
}) => {
  const router = useRouter();
  return (
    <div className="flex flex-col h-[500px] md:h-fit md:flex-row bg-gradient-to-r from-indigo-900 to-black rounded-2xl items-center md:p-10 p-3 md:gap-8 gap-4">
      <img
        alt="service"
        className="md:w-1/2 w-full md:h-auto h-52 object-cover rounded-2xl"
        src={image}
      />
      <div className="flex flex-col items-center md:space-y-3 space-y-1 w-full md:w-1/2">
        <Badge className="bg-yellow-500 hover:text-white text-black px-2 py-1 rounded-full text-sm">
          {badge}
        </Badge>
        <h2 className="text-white text-center font-bold text-2xl md:text-4xl lg:text-5xl">
          {title}
        </h2>
        <p className="text-gray-200 text-center text-sm md:text-base lg:text-lg lg:w-full w-3/4">
          {content}
        </p>
        <Button
          onClick={() => {
            router.push(btnTarget);
          }}
          className="p-2 md:p-3 rounded-full bg-transparent text-white border border-white hover:bg-white hover:text-black transition"
        >
          {btnText}
        </Button>
      </div>
    </div>
  );
};
