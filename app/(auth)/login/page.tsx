"use client";
import { motion } from 'framer-motion'
import Footer from '@/components/Footer'
import AuthForm from '@/components/AuthForm'
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ThemeToggle from '@/components/ThemeToggle';

const Page = () => {
  const router = useRouter();
  //check if the token exists in local storage and navigate to home page if it does
  const { token , initialized } = useAuthStore();
  
  useEffect(() => {
    if (initialized && token) {
      console.log(token)
      router.push('/');
    }
  }, [initialized, token, router]);
  return (
    <>
      
      
      {/* Enhanced Background with Gradient and Patterns */}
      <div className="relative min-h-screen bg-linear-to-br from-background via-background/95 to-background/70 overflow-hidden">
      
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Gradient Orbs */}
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full filter blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/10 rounded-full filter blur-3xl"
            animate={{
              x: [-50, 50, -50],
              y: [-30, 30, -30],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        

        {/* Main Content */}
        <div className="relative z-10 pt-16 pb-0">
          <div className="absolute top-5 left-8 ">
        <ThemeToggle />
      </div>
          <div className="container mx-auto px-4">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-6"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4  bg-clip-text text-transparent text-gradient">
                Welcome to Our Store
              </h1>
            </motion.div>

            {/* Auth Form Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex justify-center items-center"
            >
              <AuthForm />
            </motion.div>

           
          </div>
        </div>
      </div>
      
    </>
  )
}

export default Page;