"use client";

import React from "react";

// Define the props interface
interface TitleTextProps {
  text: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  size?: "small" | "medium" | "large" | "xl";
}

export const TitleText: React.FC<TitleTextProps> = ({
  text,
  subtitle,
  align = "center",
  size = "large",
}) => {
  // Size classes mapping
  const sizeClasses: Record<string, string> = {
    small: "text-2xl md:text-3xl",
    medium: "text-3xl md:text-4xl",
    large: "text-4xl md:text-5xl",
    xl: "text-5xl md:text-6xl",
  };

  // Alignment classes mapping
  const alignClasses: Record<string, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className={`${alignClasses[align]}`}>
      <div className="inline-block relative">
        <h1
          className={`${sizeClasses[size]} font-bold bg-gradient-to-r from-[#32BAFF] to-white bg-clip-text text-transparent relative`}
        >
          {text}
          <span
            className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#32BAFF] to-white animate-[underline_4s_ease-in-out_infinite]"
          />
        </h1>
      </div>
      {subtitle && (
        <p className="mt-2 text-gray-600 text-lg font-light">{subtitle}</p>
      )}
      <style jsx>{`
        @keyframes underline {
          0% {
            transform: scaleX(0);
            opacity: 0;
          }
          50% {
            transform: scaleX(1);
            opacity: 1;
          }
          100% {
            transform: scaleX(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
