"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { ServiceCard } from "@/components/utils/service-card";

// Define a type for the slide data
type Slide = {
  image: string;
  badge: string;
  title: string;
  content: string;
  btnText: string;
  btnTarget: string;
};

export const ServicesSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Sample data for the slides
  const slides: Slide[] = [
    {
      image:
        "https://img.freepik.com/free-vector/team-checking-giant-check-list-background_23-2148084371.jpg?t=st=1729239361~exp=1729242961~hmac=bd5478c0d6e6913268d6c868953e6c64d1de0a42fe9398c681342f4f96954e4c&w=826",
      badge: "Testing",
      title: "AI Based Tests",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      btnText: "Get Started",
      btnTarget: "/register",
    },
    {
      image:
        "https://img.freepik.com/free-vector/flat-feedback-concept-illustrated_23-2148946027.jpg?t=st=1729239526~exp=1729243126~hmac=b083f37919cc41468f6723aec3bec633e2bf7804efb32ceaf6faadbd67b3317b&w=826",
      badge: "Evaluation",
      title: "Evaluation API for results",
      content:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      btnText: "Learn More",
      btnTarget: "/about",
    },
    {
      image:
        "https://img.freepik.com/free-vector/visual-data-concept-illustration_114360-1713.jpg?t=st=1729239495~exp=1729243095~hmac=81ad09ab39d1c5fb754b4eb650497bc4906fe4c3106691f11f4037fb18e08b36&w=826",
      badge: "Full Control",
      title: "Corporate Account for test generation",
      content:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      btnText: "Learn More",
      btnTarget: "/about",
    },
    {
      image:
        "https://img.freepik.com/free-vector/man-having-online-job-interview_52683-43379.jpg?t=st=1729239605~exp=1729243205~hmac=da416b2f47fca9f337905733083c3dbd8306f14d69f966f7830e5ec208e5ef9a&w=826",
      badge: "Hiring",
      title: "Hire candidates seamlessly",
      content:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      btnText: "Contact Us",
      btnTarget: "/contact",
    },
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // Navigation functions
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Define props for the NavigationButton component
  interface NavigationButtonProps {
    direction: "Previous" | "Next";
    onClick: () => void;
    className: string;
  }

  // Navigation button component
  const NavigationButton: React.FC<NavigationButtonProps> = ({
    direction,
    onClick,
    className,
  }) => (
    <button
      onClick={onClick}
      className={`bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition ${className}`}
      aria-label={`${direction} slide`}
    >
      {direction === "Previous" ? (
        <ChevronLeft className="w-6 h-6 text-black" />
      ) : (
        <ChevronRight className="w-6 h-6 text-black" />
      )}
    </button>
  );

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 md:mb-0 mb-20">
      {/* Main slider */}
      <div className="overflow-hidden">
        <div
          className="transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          <div className="flex">
            {slides.map((slide, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0"
                style={{ width: "100%" }}
              >
                <ServiceCard {...slide} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop navigation arrows */}
      <div className="hidden lg:block">
        <NavigationButton
          direction="Previous"
          onClick={goToPrevious}
          className="absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-1/2"
        />
        <NavigationButton
          direction="Next"
          onClick={goToNext}
          className="absolute -right-2 top-1/2 -translate-y-1/2 translate-x-1/2"
        />
      </div>

      {/* Navigation container for mobile */}
      <div className="flex flex-col items-center mt-8 md:mt-6">
        {/* Mobile navigation arrows */}
        <div className="flex items-center gap-4 mb-4 lg:hidden">
          <NavigationButton
            direction="Previous"
            onClick={goToPrevious}
            className="relative"
          />
          <NavigationButton
            direction="Next"
            onClick={goToNext}
            className="relative"
          />
        </div>

        {/* Slide indicators */}
        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-20 h-2 rounded-full transition-all ${
                currentIndex === index ? "bg-yellow-500" : "bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
