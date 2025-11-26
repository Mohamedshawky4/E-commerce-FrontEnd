import dynamic from 'next/dynamic';
const FeaturedSection = dynamic(() => import('@/components/sections/FeaturedSection'));
const Testimonials = dynamic(() => import('@/components/sections/Testimonials'));
const FeatureGrid = dynamic(() => import('@/components/FeatureGrid'));
const Newsletter = dynamic(() => import('@/components/sections/Newsletter'));

import Hero from "@/components/sections/Hero";
import { ShieldCheck, Truck, Headphones } from "lucide-react";
import CategoriesSection from "@/components/sections/CategoriesSection";
import PromoBanner from "@/components/sections/PromoBanner";

export default function Home() {


  const features = [
    {
      title: "Secure Checkout",
      description: "Shop safely with encrypted payments and trusted gateways.",
      color: "primary",
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    },
    {
      title: "Fast Delivery",
      description: "Receive your orders quickly with our reliable shipping network.",
      color: "primary",
      icon: <Truck className="w-8 h-8 text-primary" />,
    },
    {
      title: "24/7 Support",
      description: "Our team is always here to help — anytime, anywhere.",
      color: "primary",
      icon: <Headphones className="w-8 h-8 text-primary" />,
    },
    {
      title: "Quality Assurance",
      description: "We prioritize quality and ensure your satisfaction.",
      color: "primary",
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    },
    {
      title: "Secure Payments",
      description: "Your payment is safe and secure with our trusted gateways.",
      color: "primary",
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    }
  ];

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center  font-sans">
      {/* <div className="absolute left-0 top-0 w-full h-full min-h-screen bg-gradient-to-r from-primary/5 via-transparent to-transparent pointer-events-none -z-10" /> */}

      <Hero />
      <CategoriesSection />

      {/* <div id="products-section"> */}
        <FeaturedSection
          title="Featured Products"
          endpoint="/products?sort=-price"
          linkHref="/products"
        />
      {/* </div> */}

      <PromoBanner />

      <FeaturedSection
        title="New Arrivals"
        endpoint="/products?sort=-createdAt"
        linkHref="/new-arrivals"
      />

      <FeaturedSection
        title="Top Rated"
        endpoint="/products?sort=-averageRating"
      />

      <Testimonials />

      <FeatureGrid features={features} />

      <Newsletter />


    </main>
  );
}
