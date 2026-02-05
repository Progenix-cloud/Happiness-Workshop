'use client';

import { useState, useEffect } from 'react';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="fixed inset-0 z-0">
          {/* Blob 1 - Education */}
          <motion.div
            className="absolute top-10 left-10 w-64 h-64 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            animate={{
              y: [0, 40, 0],
              x: [0, 40, 0],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          {/* Blob 2 - Playfulness */}
          <motion.div
            className="absolute top-40 right-10 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            animate={{
              y: [0, -50, 0],
              x: [0, -50, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          />

          {/* Blob 3 - Community */}
          <motion.div
            className="absolute bottom-10 left-1/2 w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            animate={{
              y: [0, -40, 0],
              x: [0, 40, 0],
            }}
            transition={{ duration: 9, repeat: Infinity, delay: 1 }}
          />

          {/* Additional gradient blob */}
          <motion.div
            className="absolute top-1/2 right-1/4 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 7, repeat: Infinity }}
          />
        </div>

        {/* Hero Section with 3-Dot Animation */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
          {/* 3-Dot Animation - Shows first */}
          <AnimatePresence mode="wait">
            {showAnimation && (
              <motion.div
                key="dots"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-8 md:gap-12"
              >
                {/* Dot 1 - Education (Yellow) - Count "1" */}
                <motion.div
                  className="relative w-20 h-20 md:w-28 md:h-28"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.15, 1],
                    opacity: [0, 1, 1],
                  }}
                  transition={{
                    duration: 0.6,
                    times: [0, 0.6, 1],
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0,
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

                {/* Dot 2 - Playfulness (Teal) - Count "2" */}
                <motion.div
                  className="relative w-20 h-20 md:w-28 md:h-28"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.15, 1],
                    opacity: [0, 1, 1],
                  }}
                  transition={{
                    duration: 0.6,
                    times: [0, 0.6, 1],
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.4,
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

                {/* Dot 3 - Community (Orange) - Count "3" */}
                <motion.div
                  className="relative w-20 h-20 md:w-28 md:h-28"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.15, 1],
                    opacity: [0, 1, 1],
                  }}
                  transition={{
                    duration: 0.6,
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
            )}

            {/* Main Content - Shows after animation */}
            {showContent && (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center max-w-4xl mx-auto w-full"
              >
                <h1 className="text-5xl md:text-8xl font-black mb-6 bg-gradient-to-r from-yellow-300 via-teal-300 to-orange-300 bg-clip-text text-transparent">
                  Happiness
                </h1>

                <p className="text-xl md:text-2xl text-gray-200 mb-8 font-light">
                  Discover, Learn, Celebrate Community & Create Lasting Impact
                </p>

                <div className="flex gap-4 justify-center flex-wrap">
                  <Button
                    onClick={() => setShowModal(true)}
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-bold px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    Login / Join
                  </Button>
                  <Button
                    onClick={() => router.push('/workshops/public')}
                    variant="outline"
                    className="border-2 border-teal-400 text-teal-300 hover:bg-teal-400/10 px-8 py-6 rounded-full text-lg font-bold"
                  >
                    Explore Workshops
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Scrollable Content Sections - OUTSIDE HERO */}
      {showContent && (
        <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          {/* Education Section */}
          <section className="min-h-screen py-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-16"
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-4 text-yellow-300 flex items-center gap-3">
                <BookOpen size={40} /> Education & Learning
              </h2>
              <p className="text-gray-300 text-lg md:text-xl max-w-2xl">
                Unlock your potential through transformative learning experiences
              </p>
            </motion.div>

            {/* Glassomorphic Cards */}
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
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="group"
                >
                  <div
                    className={`relative h-full p-8 rounded-2xl backdrop-blur-xl bg-gradient-to-br ${card.color} border-2 ${card.borderColor} hover:border-yellow-300/50 transition-all duration-300 cursor-pointer overflow-hidden`}
                  >
                    {/* 3D Perspective Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative z-10">
                      <div className="text-5xl mb-4">{card.icon}</div>
                      <h3 className="text-2xl font-bold text-yellow-100 mb-3">{card.title}</h3>
                      <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                        {card.description}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-yellow-400/20">
                        <span className="text-yellow-300 font-semibold text-sm">{card.stats}</span>
                        <motion.div
                          whileHover={{ rotate: 45 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Sparkles size={20} className="text-yellow-400" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Playfulness Section */}
        <section className="min-h-screen py-20 px-4 md:px-8 bg-gradient-to-b from-slate-900 to-purple-900">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-16"
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-4 text-teal-300 flex items-center gap-3">
                <Zap size={40} /> Playfulness & Engagement
              </h2>
              <p className="text-gray-300 text-lg md:text-xl max-w-2xl">
                Experience learning that's engaging, fun, and truly memorable
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
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <div
                    className={`relative h-full p-8 rounded-2xl backdrop-blur-xl bg-gradient-to-br ${card.color} border-2 ${card.borderColor} hover:border-teal-300/50 transition-all duration-300 cursor-pointer`}
                  >
                    {/* 3D Flip Effect on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

                    <div className="relative z-10">
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                        {card.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-teal-100 mb-3">{card.title}</h3>
                      <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                        {card.description}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-teal-400/20">
                        <span className="text-teal-300 font-semibold text-sm">{card.stats}</span>
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Zap size={20} className="text-teal-400" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Empowerment Section */}
        <section className="min-h-screen py-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-16"
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-4 text-orange-300 flex items-center gap-3">
                <Heart size={40} /> Community Empowerment
              </h2>
              <p className="text-gray-300 text-lg md:text-xl max-w-2xl">
                Creating meaningful impact through collective growth and empowerment
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
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="group"
                >
                  <motion.div
                    whileHover={{ rotateY: 5, rotateX: 5 }}
                    transition={{ duration: 0.3 }}
                    className={`relative h-full p-8 rounded-2xl backdrop-blur-xl bg-gradient-to-br ${card.color} border-2 ${card.borderColor} hover:border-orange-300/50 transition-all duration-300 cursor-pointer`}
                    style={{
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* 3D Lighting Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

                    <div className="relative z-10">
                      <div className="text-5xl mb-4 group-hover:animate-bounce">
                        {card.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-orange-100 mb-3">{card.title}</h3>
                      <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                        {card.description}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-orange-400/20">
                        <span className="text-orange-300 font-semibold text-sm">{card.stats}</span>
                        <motion.div
                          whileHover={{ rotate: -45, scale: 1.3 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Heart size={20} className="text-orange-400" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Statistics Section */}
        <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold text-center mb-16 bg-gradient-to-r from-yellow-300 via-teal-300 to-orange-300 bg-clip-text text-transparent"
            >
              Our Impact by the Numbers
            </motion.h2>

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
                  className="text-center"
                >
                  <div
                    className={`p-8 rounded-2xl bg-gradient-to-br ${stat.color} backdrop-blur-xl border border-white/20 shadow-2xl`}
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                      className="text-5xl md:text-6xl font-black text-white mb-3"
                    >
                      {stat.value}
                    </motion.div>
                    <p className="text-lg font-semibold text-white/90">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="min-h-screen py-20 px-4 md:px-8 flex items-center">
          <div className="max-w-4xl mx-auto text-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
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
      </div>
      )}

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
