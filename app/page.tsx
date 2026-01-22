import dynamic from 'next/dynamic';
const FeaturedSection = dynamic(() => import('@/components/sections/FeaturedSection'));
const Testimonials = dynamic(() => import('@/components/sections/Testimonials'));
const FeatureGrid = dynamic(() => import('@/components/FeatureGrid'));
const Newsletter = dynamic(() => import('@/components/sections/Newsletter'));
const CategoriesSection = dynamic(() => import('@/components/sections/CategoriesSection'));
const PromoBanner = dynamic(() => import('@/components/sections/PromoBanner'));
const HomeFAQ = dynamic(() => import('@/components/sections/HomeFAQ'));

import Hero from "@/components/sections/Hero";
import { ShieldCheck, Truck, Headphones } from "lucide-react";

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
    <main className="relative flex min-h-screen flex-col items-center justify-center  font-sans overflow-x-hidden">
      <Hero />

      <CategoriesSection />

      <FeaturedSection
        title="Featured Selection"
        endpoint="/products?sort=-price&limit=8"
        linkHref="/products"
      />

      <PromoBanner />

      <FeaturedSection
        title="New Tech Drops"
        endpoint="/products?sort=-createdAt&limit=8"
        linkHref="/new-arrivals"
      />

      <FeaturedSection
        title="Elite Tier Assets"
        endpoint="/products?sort=-averageRating&limit=8"
      />

      <Testimonials />

      <FeatureGrid features={features} />

      <HomeFAQ />

      <Newsletter />
    </main>
  );
}
