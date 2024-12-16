"use client"

import React, { useState, useRef, useEffect } from "react";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

// Define the interface for the feature
interface Feature {
  text: string;
  included: boolean;
}

// Define the interface for the plan
interface Plan {
  title: string;
  price: string;
  features: Feature[];
  buttonText: string;
  imgSrc: string;
  isPro: boolean;
}

// Define the props for the PricingPlan component
interface PricingPlanProps {
  title: string;
  price: string;
  features: Feature[];
  buttonText: string;
  imgSrc: string;
  isPro: boolean;
}

const PricingPlan: React.FC<PricingPlanProps> = ({
  title,
  price,
  features,
  buttonText,
  imgSrc,
  isPro,
}) => (
  <div
    className={`${
      isPro
        ? "bg-gradient-to-b from-[#32BAFF]/30 to-black"
        : "bg-gradient-to-b from-gray-500 to-black"
    } border-white border rounded-2xl p-4 md:p-6 shadow-lg w-full md:w-80 flex-shrink-0 mx-auto`}
  >
    <div className="absolute -inset-[10px] -z-10 bg-white opacity-20 blur-3xl transition group-hover:duration-300 duration-1000 group-hover:opacity-40" />
    <div className="flex justify-center mb-2 md:mb-4">
      <div className="w-24 h-24 md:w-32 md:h-32">
        <img
          src={imgSrc}
          alt={`${title} Illustration`}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
    <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 -mt-4 md:-mt-8">
      {title}
    </h2>
    <p className="text-3xl md:text-4xl font-bold mb-2 md:mb-4">{price}</p>
    <ul className="mb-4 text-sm md:text-base">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center mb-1 md:mb-2">
          {feature.included ? (
            <CheckIcon className="w-4 h-4 md:w-5 md:h-5" />
          ) : (
            <Cross2Icon className="w-4 h-4 md:w-5 md:h-5" />
          )}
          <span className="ml-2">{feature.text}</span>
        </li>
      ))}
    </ul>
    <Button className="w-full bg-yellow-500 hover:bg-white rounded-full text-black text-sm md:text-base">
      {buttonText}
    </Button>
  </div>
);

export const PricingPlans: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState<number>(1);
  const sliderRef = useRef<HTMLDivElement>(null);

  const plans: Plan[] = [
    {
      title: "Starter",
      price: "Free",
      features: [
        { text: "Unlimited files in draft", included: true },
        { text: "Unlimited viewers and commenters", included: true },
        { text: "Unlimited editors on 3 team files", included: true },
        { text: "1 team project", included: false },
        { text: "30-day version history", included: false },
        { text: "Unlimited cloud storage", included: false },
      ],
      buttonText: "Get Started",
      imgSrc: `/sub2.png`,
      isPro: false,
    },
    {
      title: "Professional",
      price: "₹25,000",
      features: [
        { text: "Unlimited files in draft", included: true },
        { text: "Unlimited viewers and commenters", included: true },
        { text: "Unlimited editors on 3 team files", included: true },
        { text: "1 team project", included: true },
        { text: "30-day version history", included: true },
        { text: "Unlimited cloud storage", included: true },
      ],
      buttonText: "Contact Us",
      imgSrc: `/sub1.png`,
      isPro: true,
    },
  ];

  const infinitePlans = [plans[1], ...plans, plans[0]];

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      const handleScroll = () => {
        const index = Math.round(slider.scrollLeft / slider.offsetWidth);
        setActiveSlide(index);
      };
      slider.addEventListener("scroll", handleScroll);
      return () => slider.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      if (activeSlide === 0) {
        setTimeout(() => {
          slider.scrollTo({
            left: slider.offsetWidth * plans.length,
            behavior: "auto",
          });
          setActiveSlide(plans.length);
        }, 300);
      } else if (activeSlide === infinitePlans.length - 1) {
        setTimeout(() => {
          slider.scrollTo({ left: slider.offsetWidth, behavior: "auto" });
          setActiveSlide(1);
        }, 300);
      }
    }
  }, [activeSlide, plans.length]);

  const scrollTo = (index: number) => {
    const slider = sliderRef.current;
    if (slider) {
      slider.scrollTo({ left: index * slider.offsetWidth, behavior: "smooth" });
    }
  };

  return (
    <div className="pb-10">
      {/* Mobile Slider */}
      <div className="md:hidden">
        <div className="relative overflow-hidden">
          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {infinitePlans.map((plan, index) => (
              <div key={index} className="snap-center w-full flex-shrink-0">
                <PricingPlan {...plan} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex mt-6 justify-center space-x-2">
          {plans.map((_, index) => (
            <button
              key={index}
              className={`w-20 h-2 rounded-full ${
                activeSlide === index + 1 ? "bg-yellow-500" : "bg-gray-400"
              }`}
              onClick={() => scrollTo(index + 1)}
            />
          ))}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex justify-center items-center">
        {plans.map((plan, index) => (
          <PricingPlan key={index} {...plan} />
        ))}
      </div>
    </div>
  );
};
