"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "./ui/button";
import { useAuth } from "@/context/auth-provider";

const words = [
  <motion.span
    key={0}
    className="inline-block leading-normal lg:mr-5 md:mr-3 mr-2 flowing-gradient"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0 * 0.1 }}
    style={{
      background: "linear-gradient(270deg, #FF6B6B, #FFD93D, #32BAFF, #FF6B6B)",
      backgroundSize: "400% 400%",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      animation: "flowingColors 7s ease infinite",
    }}
  >
    The new best way to hire talent
  </motion.span>,
  <span
    key={1}
    className="bg-gradient-to-r from-[#32BAFF] to-pink-500 bg-clip-text text-transparent"
  >
    &apos;AI Hire
  </span>,
  <span
    key={2}
    className="bg-gradient-to-r from-[#6666FF] to-red-400 bg-clip-text text-transparent"
  >
    Studio&apos;
  </span>,
];

const sentence = words.map((word, index) => (
  <motion.span
    key={index}
    className="inline-block lg:mr-5 md:mr-3 mr-2"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    {word}{" "}
  </motion.span>
));

export const HeroContent = () => {
  const { isAuth } = useAuth();
  return (
    <div className="relative z-20 text-center px-4 max-w-7xl">
      <motion.div className="text-white">
        <div className="leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8">
          <h1 className="break-words animate-character">{sentence}</h1>
        </div>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl mx-auto text-zinc-300/60 text-sm sm:text-base lg:text-lg"
      >
        AI Hire Studio is a cutting edge application designed to auto evaluate candidates for steadiness through auto interviews. So you hire right fresh talent that stays.
      </motion.p>
      {!isAuth && (
        <Link href="/corporatelogin">
          <Button
            className="py-2 px-6 mt-4 relative rounded-full bg-[#E8DDFF] hover:bg-[#C2B4FC] text-black font-semibold text-md"
            size="default"
          >
            Get Started
          </Button>
        </Link>
      )}
    </div>
  );
};
