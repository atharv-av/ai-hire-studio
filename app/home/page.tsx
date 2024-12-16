"use client"

import React from "react";
import { PricingPlans } from "@/components/pricing-plans";
import { Footer } from "@/components/footer";
import { ServicesSlider } from "@/components/services-silder";
import { TitleText } from "@/components/utils/title-text";
import { DescriptionText } from "@/components/utils/description-text";
import { Header } from "@/components/header";
import { HeroContent } from "@/components/hero-content";
import { sendGAEvent } from '@next/third-parties/google'

function HomePage() {
  sendGAEvent({
    event: 'page_view',
    value: 'home_page_visit'
  });
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section
        id="home"
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 via-[#2C0368] to-[#0a0a0a] z-0"></div>

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-10"></div>

        {/* Content */}
        <HeroContent />
      </section>

      {/* Services section */}
      <section
        id="services"
        className="min-h-screen md:pb-44 xl:pb-0 pb-20 flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a0a] to-gray-800 text-white"
      >
        <TitleText text="Our Services" align="center" size="xl" />
        <DescriptionText
          prefix="We offer"
          words={["Tests", "Evaluation", "Hiring"]}
          typingSpeed={100}
          deletingSpeed={50}
          delayBetweenWords={2000}
          className="md:text-4xl text-lg text-center"
        />
        <ServicesSlider />
      </section>

      {/* Plans section */}
      <section
        id="plans"
        className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-800 via-[#2C0368] to-[#0a0a0a] text-white"
      >
        <div className="w-full max-w-3xl mx-auto px-4 py-16">
          <TitleText text="Subscription Plans" align="center" size="xl" />
          <DescriptionText
            prefix="AI Hire Studio is"
            words={["Convenient", "Premium", "Fantastic"]}
            typingSpeed={100}
            deletingSpeed={50}
            delayBetweenWords={2000}
            className="md:text-4xl text-lg text-center"
          />
          <PricingPlans />
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default HomePage;
