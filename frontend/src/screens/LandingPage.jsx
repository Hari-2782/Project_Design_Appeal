import React from "react";
import HomeHero from "../components/Homepage/modules/HomeHero";
import AppFooter from "../components/Homepage/Appfooter";
import HowItWorks from "../components/Homepage/HowItWorks";
import HomeOffer from "../components/Homepage/HomeOffer";
import HomeEnq from "../components/Homepage/HomeEnq";
import UProject from "../components/Homepage/UProject";
import HomeAppbar from "../components/Homepage/HomeAppbar";
import ReviewSection from "../components/Homepage/ReviewSection";
import ChatBot from "../components/Homepage/ChatBot";


function Home() {
  return (
    <div className="home">
      <HomeAppbar />
      <HomeHero />
      <UProject />
      <HowItWorks />
      <ReviewSection />
      <HomeOffer />
      <HomeEnq />
      <ChatBot />
      
      <div className="content-container"></div>
      <AppFooter />
    </div>
  );
}

export default function SimpleContainer() {
  return (
    <div className="simple-container">
      <Home />
    </div>
  );
}
