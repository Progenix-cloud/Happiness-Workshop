'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LoginModal } from '@/components/LoginModal';
import { useRouter } from 'next/navigation';
import { Sparkles, Zap, Heart, Users, BookOpen, Lightbulb } from 'lucide-react';

export function HeroSection() {
  const router = useRouter();
  const [showAnimation, setShowAnimation] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      router.push('/dashboard');
    }
  }, [router]);

  // Animation sequence: Show dots counting 1→2→3, then show content
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
      setShowContent(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    router.push('/dashboard');
  };

  // Parallax transforms
  const yParallax = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityParallax = useTransform(scrollY, [0, 300], [1, 0]);
  const scaleParallax = useTransform(scrollY, [0, 300], [1, 0.8]);

  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 2.8 } },
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-cyan-600 via-sky-500/50 via-cyan-500/40 to-blue-500/50 overflow-hidden scroll-smooth">
        {/* Animated Background Blobs */}
        <div className="fixed inset-0 z-0">
          {/* Blob 1 - Education */}
          <motion.div
            className="absolute top-10 left-10 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
            animate={{
              y: [0, 40, 0],
              x: [0, 40, 0],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          {/* Blob 2 - Playfulness */}
          <motion.div
            className="absolute top-40 right-10 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
            animate={{
              y: [0, -50, 0],
              x: [0, -50, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          />

          {/* Blob 3 - Community */}
          <motion.div
            className="absolute bottom-10 left-1/2 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
            animate={{
              y: [0, -40, 0],
              x: [0, 40, 0],
            }}
            transition={{ duration: 9, repeat: Infinity, delay: 1 }}
          />

          {/* Additional gradient blob */}
          <motion.div
            className="absolute top-1/2 right-1/4 w-96 h-96 bg-lime-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 7, repeat: Infinity }}
          />
        </div>

        {/* Hero Section with Enhanced 3-Dot Animation */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 md:px-8">
          {/* Animation Sequence: Dots (L→R) → Happiness Centered → Happiness (Left) → Layout */}
          <AnimatePresence mode="wait">
            {showAnimation && (
              <motion.div
                key="dots"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* STAGE 1: Dots Loading Animation - Left to Right (3 seconds) */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center gap-6 md:gap-10 mb-12"
                >
                  {/* Dot 1 - Education (Yellow) */}
                  <motion.div
                    className="relative w-14 h-14 md:w-20 md:h-20"
                    initial={{ x: -300, scale: 0, opacity: 0 }}
                    animate={{
                      x: 0,
                      scale: [0, 1.15, 1],
                      opacity: [0, 1, 1],
                    }}
                    transition={{
                      duration: 1,
                      times: [0, 0.6, 1],
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.2,
                    }}
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500" 
                      style={{
                        filter: 'blur(1px) drop-shadow(0 0 30px rgba(250, 204, 21, 0.5))',
                      }}
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600" />
                    <div className="absolute inset-[20%] rounded-full bg-gradient-to-br from-white/60 to-transparent" />
                  </motion.div>

                  {/* Dot 2 - Playfulness (Teal) */}
                  <motion.div
                    className="relative w-14 h-14 md:w-20 md:h-20"
                    initial={{ x: -300, scale: 0, opacity: 0 }}
                    animate={{
                      x: 0,
                      scale: [0, 1.15, 1],
                      opacity: [0, 1, 1],
                    }}
                    transition={{
                      duration: 1,
                      times: [0, 0.6, 1],
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.5,
                    }}
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-300 via-teal-400 to-teal-500"
                      style={{
                        filter: 'blur(1px) drop-shadow(0 0 30px rgba(20, 184, 166, 0.5))',
                      }}
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-200 via-teal-400 to-teal-600" />
                    <div className="absolute inset-[20%] rounded-full bg-gradient-to-br from-white/60 to-transparent" />
                  </motion.div>

                  {/* Dot 3 - Community (Orange) */}
                  <motion.div
                    className="relative w-14 h-14 md:w-20 md:h-20"
                    initial={{ x: -300, scale: 0, opacity: 0 }}
                    animate={{
                      x: 0,
                      scale: [0, 1.15, 1],
                      opacity: [0, 1, 1],
                    }}
                    transition={{
                      duration: 1,
                      times: [0, 0.6, 1],
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.8,
                    }}
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500"
                      style={{
                        filter: 'blur(1px) drop-shadow(0 0 30px rgba(251, 146, 60, 0.5))',
                      }}
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-200 via-orange-400 to-orange-600" />
                    <div className="absolute inset-[20%] rounded-full bg-gradient-to-br from-white/60 to-transparent" />
                  </motion.div>
                </motion.div>

                {/* STAGE 2: Happiness Center Then Slides Left */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 2 }}
                  className="w-full"
                >
                  {/* Centered Title First */}
                  <motion.h1
                    initial={{ opacity: 0, scale: 0.5, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 2.2 }}
                    className="text-6xl md:text-8xl font-black text-center mb-8 bg-gradient-to-r from-yellow-300 via-teal-300 to-orange-300 bg-clip-text text-transparent"
                  >
                    Happiness
                  </motion.h1>

                  {/* Then slides to left and layout appears */}
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3 }}
                  >
                    {/* This will fade out when showContent becomes true */}
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* Main Content - Split Layout (Left Title + Right Buttons) */}
            {showContent && (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-6xl"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                  {/* Left Side - Title & Tagline */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-left"
                  >
                    <motion.h1
                      className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-yellow-300 via-teal-300 to-orange-300 bg-clip-text text-transparent leading-tight"
                    >
                      Happiness
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="text-lg md:text-2xl text-gray-200 font-light leading-relaxed max-w-2xl"
                    >
                      Discover, Learn, Celebrate Community & Create Lasting Impact
                    </motion.p>

                    {/* Decorative Underline */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100px' }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="h-1 bg-gradient-to-r from-yellow-400 to-teal-400 rounded-full mt-6"
                    />
                  </motion.div>

                  {/* Right Side - Buttons */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col gap-4 md:justify-center"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={() => setShowModal(true)}
                        className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-bold px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-2xl transition-all"
                      >
                        Login / Join
                      </Button>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={() => router.push('/workshops/public')}
                        className="w-full border-2 border-teal-400 text-teal-300 hover:bg-teal-400/10 px-8 py-6 rounded-full text-lg font-bold transition-all"
                      >
                        Explore Workshops
                      </Button>
                    </motion.div>

                    {/* Scroll Indicator */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      className="flex justify-center mt-6"
                    >
                      <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-gray-400 text-sm flex flex-col items-center gap-2"
                      >
                        <span>Scroll to explore</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-teal-300">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Scrollable Content Sections - SMOOTH GRADIENT TRANSITIONS */}
      {showContent && (
        <div className="relative bg-gradient-to-b from-sky-600/70 via-blue-500/50 via-cyan-500/40 via-sky-500/35 to-blue-500/50">
          {/* Education Section */}
          <section id="education" className="min-h-screen py-20 px-4 md:px-8 snap-start bg-gradient-to-b from-cyan-600/30 via-sky-500/40 via-cyan-500/30 via-blue-500/35 to-sky-500/45">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ margin: '-100px' }}
              className="mb-20"
            >
              {/* Section Header with Enhanced Animation */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.2 }}
                    className="text-5xl md:text-6xl"
                  >
                    <BookOpen size={50} className="text-yellow-300" />
                  </motion.div>
                  <h2 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-yellow-300 via-yellow-200 to-orange-300 bg-clip-text text-transparent">
                    Education & Learning
                  </h2>
                </div>
              </motion.div>

              {/* Divider Line with Glow */}
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-transparent rounded-full mb-6"
                style={{
                  boxShadow: '0 0 20px rgba(250, 204, 21, 0.4)',
                }}
              />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg md:text-xl text-gray-200 max-w-3xl font-light leading-relaxed"
              >
                Unlock your potential through transformative learning experiences designed to inspire, engage, and empower
              </motion.p>
            </motion.div>

            {/* Glassomorphic Cards with Enhanced 3D */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Structured Workshops',
                  description: 'Curated learning paths designed by experts to build foundational and advanced skills',
                  icon: '📚',
                  stats: '500+ workshops',
                  color: 'from-yellow-500/20 to-orange-500/10',
                  borderColor: 'border-yellow-400/30',
                },
                {
                  title: 'Expert Trainers',
                  description: 'Learn from industry professionals with 10+ years of experience in their fields',
                  icon: '👨‍🏫',
                  stats: '200+ certified trainers',
                  color: 'from-yellow-500/15 to-amber-500/10',
                  borderColor: 'border-yellow-300/30',
                },
                {
                  title: 'Certificates & Recognition',
                  description: 'Earn recognized certificates upon completion to showcase your achievements',
                  icon: '🏆',
                  stats: '50K+ certificates issued',
                  color: 'from-amber-500/20 to-yellow-500/10',
                  borderColor: 'border-amber-400/30',
                },
                {
                  title: 'Interactive Learning',
                  description: 'Engage with peers through Q&A sessions, group projects, and live interactions',
                  icon: '💡',
                  stats: '10K+ active learners',
                  color: 'from-yellow-500/20 to-green-500/10',
                  borderColor: 'border-yellow-400/30',
                },
                {
                  title: 'Progress Tracking',
                  description: 'Monitor your learning journey with detailed analytics and personalized insights',
                  icon: '📊',
                  stats: '100% learning retention tools',
                  color: 'from-orange-500/20 to-yellow-500/10',
                  borderColor: 'border-orange-400/30',
                },
                {
                  title: 'Lifetime Access',
                  description: 'Access workshop materials anytime, anywhere with our cloud-based platform',
                  icon: '☁️',
                  stats: 'Available 24/7',
                  color: 'from-yellow-500/20 to-blue-500/10',
                  borderColor: 'border-yellow-300/30',
                },
              ].map((card, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30, rotateZ: -5 }}
                  whileInView={{ opacity: 1, y: 0, rotateZ: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                  viewport={{ margin: '-100px' }}
                  whileHover={{ y: -8, rotateZ: 2 }}
                  className="group perspective"
                >
                  <div
                    className={`relative h-full p-8 rounded-3xl backdrop-blur-2xl bg-gradient-to-br ${card.color} border-2 ${card.borderColor} hover:border-yellow-300/50 transition-all duration-300 cursor-pointer overflow-hidden shadow-2xl hover:shadow-yellow-500/20`}
                    style={{
                      background: `linear-gradient(135deg, rgba(${card.color.includes('yellow') ? '234, 179, 8' : '251, 146, 60'}, 0.2), rgba(${card.color.includes('orange') ? '251, 146, 60' : '168, 85, 247'}, 0.1))`,
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    {/* Gloss/Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />

                    {/* Animated Border Glow */}
                    <motion.div
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100"
                      animate={{
                        boxShadow: ['inset 0 0 20px rgba(234, 179, 8, 0)', 'inset 0 0 20px rgba(234, 179, 8, 0.3)', 'inset 0 0 20px rgba(234, 179, 8, 0)'],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />

                    <div className="relative z-10">
                      <motion.div
                        className="text-6xl mb-4"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: idx * 0.1 }}
                        whileHover={{ scale: 1.2, rotate: 10 }}
                      >
                        {card.icon}
                      </motion.div>
                      <h3 className="text-2xl font-bold text-yellow-100 mb-3 group-hover:text-yellow-200 transition-colors">{card.title}</h3>
                      <p className="text-gray-300 mb-4 text-sm leading-relaxed group-hover:text-gray-200 transition-colors">
                        {card.description}
                      </p>
                      <motion.div
                        className="flex items-center justify-between pt-4 border-t border-yellow-400/20 group-hover:border-yellow-400/50 transition-colors"
                      >
                        <span className="text-yellow-300 font-semibold text-sm group-hover:text-yellow-200">{card.stats}</span>
                        <motion.div
                          whileHover={{ rotate: 45, scale: 1.3 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Sparkles size={20} className="text-yellow-400" />
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Playfulness Section - Smooth Gradient Transition */}
        <section id="playfulness" className="min-h-screen py-20 px-4 md:px-8 bg-gradient-to-b from-sky-500/50 via-cyan-500/40 via-teal-500/35 via-sky-500/30 to-blue-500/45 snap-start">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ margin: '-100px' }}
              className="mb-16"
            >
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, -15, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <Zap size={56} className="text-teal-300" />
                </motion.div>
                <h2 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-teal-300 via-cyan-300 to-teal-200 bg-clip-text text-transparent">
                  Playfulness & Engagement
                </h2>
              </div>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-transparent rounded-full mb-6"
                style={{ boxShadow: '0 0 20px rgba(20, 184, 166, 0.4)' }}
              />
              <p className="text-lg md:text-xl text-gray-200 max-w-3xl font-light leading-relaxed">
                Experience learning that's engaging, fun, and truly memorable with interactive experiences
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Gamified Learning',
                  description: 'Earn badges, points, and climb leaderboards while learning new skills',
                  icon: '🎮',
                  stats: '1K+ gamified elements',
                  color: 'from-teal-500/20 to-cyan-500/10',
                  borderColor: 'border-teal-400/30',
                },
                {
                  title: 'Community Events',
                  description: 'Participate in workshops, challenges, and social events with fellow learners',
                  icon: '🎉',
                  stats: '50+ monthly events',
                  color: 'from-cyan-500/20 to-teal-500/10',
                  borderColor: 'border-cyan-400/30',
                },
                {
                  title: 'Creative Challenges',
                  description: 'Take on exciting challenges that push your creativity and problem-solving skills',
                  icon: '🚀',
                  stats: '200+ active challenges',
                  color: 'from-teal-500/20 to-green-500/10',
                  borderColor: 'border-teal-400/30',
                },
                {
                  title: 'Social Learning',
                  description: 'Collaborate with peers, share ideas, and build meaningful connections',
                  icon: '👥',
                  stats: '50K+ community members',
                  color: 'from-cyan-500/20 to-blue-500/10',
                  borderColor: 'border-cyan-400/30',
                },
                {
                  title: 'Instant Feedback',
                  description: 'Get real-time feedback on your progress and personalized recommendations',
                  icon: '💬',
                  stats: '100% feedback coverage',
                  color: 'from-teal-500/20 to-indigo-500/10',
                  borderColor: 'border-teal-400/30',
                },
                {
                  title: 'Rewards Program',
                  description: 'Unlock exclusive rewards, discounts, and perks as you advance your learning',
                  icon: '🎁',
                  stats: '500+ reward items',
                  color: 'from-cyan-500/20 to-teal-500/10',
                  borderColor: 'border-cyan-400/30',
                },
              ].map((card, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30, rotateZ: 5 }}
                  whileInView={{ opacity: 1, y: 0, rotateZ: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                  viewport={{ margin: '-100px' }}
                  whileHover={{ y: -8, rotateZ: -2 }}
                  className="group"
                >
                  <div
                    className={`relative h-full p-8 rounded-3xl backdrop-blur-2xl bg-gradient-to-br ${card.color} border-2 ${card.borderColor} hover:border-teal-300/50 transition-all duration-300 cursor-pointer shadow-2xl hover:shadow-teal-500/20`}
                  >
                    {/* Gloss Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />

                    {/* Animated Border Glow */}
                    <motion.div
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100"
                      animate={{
                        boxShadow: ['inset 0 0 20px rgba(20, 184, 166, 0)', 'inset 0 0 20px rgba(20, 184, 166, 0.3)', 'inset 0 0 20px rgba(20, 184, 166, 0)'],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />

                    <div className="relative z-10">
                      <motion.div
                        className="text-6xl mb-4"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: idx * 0.1 }}
                        whileHover={{ scale: 1.2, rotate: 10 }}
                      >
                        {card.icon}
                      </motion.div>
                      <h3 className="text-2xl font-bold text-teal-100 mb-3 group-hover:text-teal-200 transition-colors">{card.title}</h3>
                      <p className="text-gray-300 mb-4 text-sm leading-relaxed group-hover:text-gray-200 transition-colors">
                        {card.description}
                      </p>
                      <motion.div
                        className="flex items-center justify-between pt-4 border-t border-teal-400/20 group-hover:border-teal-400/50 transition-colors"
                      >
                        <span className="text-teal-300 font-semibold text-sm group-hover:text-teal-200">{card.stats}</span>
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Zap size={20} className="text-teal-400" />
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Empowerment Section - Smooth Gradient */}
        <section id="community" className="min-h-screen py-20 px-4 md:px-8 bg-gradient-to-b from-blue-500/45 via-cyan-500/35 via-teal-500/30 via-sky-500/40 to-blue-500/50 snap-start">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ margin: '-100px' }}
              className="mb-16"
            >
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  animate={{ scale: [1, 1.15, 1], rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Heart size={56} className="text-orange-300" />
                </motion.div>
                <h2 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-orange-300 via-orange-200 to-yellow-300 bg-clip-text text-transparent">
                  Community Empowerment
                </h2>
              </div>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-1 bg-gradient-to-r from-orange-400 via-red-400 to-transparent rounded-full mb-6"
                style={{ boxShadow: '0 0 20px rgba(251, 146, 60, 0.4)' }}
              />
              <p className="text-lg md:text-xl text-gray-200 max-w-3xl font-light leading-relaxed">
                Creating meaningful impact through collective growth, empowerment, and shared purpose
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Inclusive Community',
                  description: 'Build a diverse, welcoming space where everyone can learn and grow together',
                  icon: '🌍',
                  stats: '10K+ community members',
                  color: 'from-orange-500/20 to-red-500/10',
                  borderColor: 'border-orange-400/30',
                },
                {
                  title: 'Social Impact',
                  description: 'Make a difference through volunteer programs and community initiatives',
                  icon: '💪',
                  stats: '1K+ hours volunteered',
                  color: 'from-red-500/20 to-orange-500/10',
                  borderColor: 'border-red-400/30',
                },
                {
                  title: 'Mentorship Programs',
                  description: 'Connect with mentors and guides who can help shape your growth journey',
                  icon: '🤝',
                  stats: '500+ active mentors',
                  color: 'from-orange-500/20 to-yellow-500/10',
                  borderColor: 'border-orange-400/30',
                },
                {
                  title: 'Resource Sharing',
                  description: 'Access a library of shared resources, tools, and knowledge from the community',
                  icon: '📖',
                  stats: '5K+ shared resources',
                  color: 'from-yellow-500/20 to-orange-500/10',
                  borderColor: 'border-yellow-400/30',
                },
                {
                  title: 'Impact Metrics',
                  description: 'Track and celebrate the collective impact we create together as a community',
                  icon: '📈',
                  stats: '100K+ lives impacted',
                  color: 'from-orange-500/20 to-pink-500/10',
                  borderColor: 'border-orange-400/30',
                },
                {
                  title: 'Sustainability',
                  description: 'Build lasting change through sustainable programs and long-term partnerships',
                  icon: '🌱',
                  stats: '200+ partners worldwide',
                  color: 'from-green-500/20 to-orange-500/10',
                  borderColor: 'border-green-400/30',
                },
              ].map((card, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30, rotateZ: -5 }}
                  whileInView={{ opacity: 1, y: 0, rotateZ: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                  viewport={{ margin: '-100px' }}
                  whileHover={{ y: -8, rotateZ: 2 }}
                  className="group"
                >
                  <motion.div
                    whileHover={{ rotateY: 5, rotateX: 5 }}
                    transition={{ duration: 0.3 }}
                    className={`relative h-full p-8 rounded-3xl backdrop-blur-2xl bg-gradient-to-br ${card.color} border-2 ${card.borderColor} hover:border-orange-300/50 transition-all duration-300 cursor-pointer shadow-2xl hover:shadow-orange-500/20`}
                    style={{
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* Gloss Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />

                    {/* Animated Border Glow */}
                    <motion.div
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100"
                      animate={{
                        boxShadow: ['inset 0 0 20px rgba(251, 146, 60, 0)', 'inset 0 0 20px rgba(251, 146, 60, 0.3)', 'inset 0 0 20px rgba(251, 146, 60, 0)'],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />

                    <div className="relative z-10">
                      <motion.div
                        className="text-6xl mb-4"
                        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: idx * 0.1 }}
                        whileHover={{ scale: 1.3, rotate: 15 }}
                      >
                        {card.icon}
                      </motion.div>
                      <h3 className="text-2xl font-bold text-orange-100 mb-3 group-hover:text-orange-200 transition-colors">{card.title}</h3>
                      <p className="text-gray-300 mb-4 text-sm leading-relaxed group-hover:text-gray-200 transition-colors">
                        {card.description}
                      </p>
                      <motion.div
                        className="flex items-center justify-between pt-4 border-t border-orange-400/20 group-hover:border-orange-400/50 transition-colors"
                      >
                        <span className="text-orange-300 font-semibold text-sm group-hover:text-orange-200">{card.stats}</span>
                        <motion.div
                          whileHover={{ rotate: -45, scale: 1.3 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Heart size={20} className="text-orange-400" />
                        </motion.div>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Statistics Section */}
        <section id="impact" className="py-20 px-4 md:px-8 bg-gradient-to-b from-cyan-600/50 via-sky-500/40 via-blue-500/35 via-cyan-500/30 to-sky-500/45 snap-start">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ margin: '-100px' }}
              className="text-5xl md:text-6xl font-bold text-center mb-16 bg-gradient-to-r from-yellow-300 via-teal-300 to-orange-300 bg-clip-text text-transparent"
            >
              Our Impact by the Numbers
            </motion.h2>

            <div className="flex items-center justify-center gap-4 mb-8">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles size={56} className="text-purple-300" />
              </motion.div>
            </div>

            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '60%' }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-transparent rounded-full mb-8 mx-auto"
              style={{ boxShadow: '0 0 20px rgba(192, 132, 250, 0.4)' }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { value: '500+', label: 'Workshops', color: 'from-yellow-500 to-orange-500' },
                { value: '10K+', label: 'Participants', color: 'from-teal-500 to-cyan-500' },
                { value: '200+', label: 'Trainers', color: 'from-orange-500 to-pink-500' },
                { value: '100K+', label: 'Lives Impacted', color: 'from-yellow-400 to-teal-400' },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ margin: '-100px' }}
                  className="text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotateZ: 2 }}
                    className={`p-8 rounded-3xl bg-gradient-to-br ${stat.color} backdrop-blur-xl border border-white/20 shadow-2xl cursor-pointer`}
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                      className="text-5xl md:text-6xl font-black text-white mb-3"
                    >
                      {stat.value}
                    </motion.div>
                    <p className="text-lg font-semibold text-white/90 group-hover:text-white transition-colors">{stat.label}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="min-h-screen py-20 px-4 md:px-8 bg-gradient-to-b from-cyan-600/60 via-sky-500/45 via-blue-500/40 via-cyan-500/35 to-sky-500/50 flex items-center snap-start">
          <div className="max-w-4xl mx-auto text-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ margin: '-100px' }}
            >
              <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-yellow-300 via-teal-300 to-orange-300 bg-clip-text text-transparent">
                Ready to Transform Your Learning Journey?
              </h2>

              <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
                Join thousands of learners, trainers, and community members creating positive change through education, 
                playfulness, and empowerment.
              </p>

              <div className="flex gap-4 justify-center flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(true)}
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-bold px-10 py-4 rounded-full text-lg shadow-lg"
                >
                  Get Started Now
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/workshops/public')}
                  className="border-2 border-teal-400 text-teal-300 hover:bg-teal-400/10 px-10 py-4 rounded-full text-lg font-bold"
                >
                  Explore More
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="bg-gradient-to-t from-cyan-600/70 via-sky-500/50 via-blue-500/40 via-cyan-500/35 to-sky-500/60 border-t border-white/10 py-12 snap-end">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ margin: '-100px' }}
              className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12"
            >
              {/* Brand & Contact */}
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 via-teal-300 to-orange-300 bg-clip-text text-transparent">
                  Happiness
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Transforming lives through education, playfulness, and community empowerment.
                </p>
                <div className="flex flex-col gap-2 mt-2">
                  <motion.a
                    href="mailto:hello@happiness.app"
                    whileHover={{ x: 4 }}
                    className="text-teal-300 hover:text-teal-200 transition-colors font-medium"
                  >
                    📧 hello@happiness.app
                  </motion.a>
                  <motion.a
                    href="tel:+1234567890"
                    whileHover={{ x: 4 }}
                    className="text-teal-300 hover:text-teal-200 transition-colors font-medium"
                  >
                    📞 +1 (234) 567-8900
                  </motion.a>
                </div>
              </div>

              {/* Quick Links */}
              <div className="flex flex-col gap-4">
                <h4 className="text-lg font-bold text-yellow-300">Quick Links</h4>
                <div className="flex flex-col gap-2">
                  <motion.a
                    href="#education"
                    whileHover={{ x: 4 }}
                    className="text-gray-300 hover:text-yellow-300 transition-colors"
                  >
                    → Education & Learning
                  </motion.a>
                  <motion.a
                    href="#playfulness"
                    whileHover={{ x: 4 }}
                    className="text-gray-300 hover:text-teal-300 transition-colors"
                  >
                    → Playfulness & Engagement
                  </motion.a>
                  <motion.a
                    href="#community"
                    whileHover={{ x: 4 }}
                    className="text-gray-300 hover:text-orange-300 transition-colors"
                  >
                    → Community Empowerment
                  </motion.a>
                  <motion.a
                    href="#impact"
                    whileHover={{ x: 4 }}
                    className="text-gray-300 hover:text-orange-300 transition-colors"
                  >
                    → Our Impact
                  </motion.a>
                </div>
              </div>

              {/* Legal & Social */}
              <div className="flex flex-col gap-4">
                <h4 className="text-lg font-bold text-orange-300">Legal & Community</h4>
                <div className="flex flex-col gap-2">
                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => router.push('/privacy')}
                    className="text-left text-gray-300 hover:text-orange-300 transition-colors"
                  >
                    → Privacy Policy
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => router.push('/terms')}
                    className="text-left text-gray-300 hover:text-orange-300 transition-colors"
                  >
                    → Terms of Service
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => router.push('/ngo')}
                    className="text-left text-gray-300 hover:text-orange-300 transition-colors"
                  >
                    → Social Impact (NGO)
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => router.push('/contact')}
                    className="text-left text-gray-300 hover:text-orange-300 transition-colors"
                  >
                    → Contact Us
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ margin: '-100px' }}
              className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8 origin-center"
            />

            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ margin: '-100px' }}
              className="text-center text-gray-400 text-sm"
            >
              <p>© 2024 Happiness Workshop. All rights reserved. | Built with 💜 for Community Impact</p>
              <p className="mt-2 text-xs text-gray-500">
                Empowering learners, trainers, and communities worldwide through transformative education.
              </p>
            </motion.div>
          </div>
        </footer>
      </div>
      )}

      {/* Login Modal */}

      {/* Login Modal */}
      <AnimatePresence>
        {showModal && (
          <LoginModal
            open={showModal}
            onOpenChange={setShowModal}
            onSuccess={handleLoginSuccess}
          />
        )}
      </AnimatePresence>
    </>
  );
}
