import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';

const features = [
  {
    icon: '🧠',
    title: 'AI-Powered Support',
    description: '24/7 access to our AI companion for immediate mental health support.'
  },
  {
    icon: '👥',
    title: 'Community',
    description: 'Connect with others who understand your journey in a safe space.'
  },
  {
    icon: '📊',
    title: 'Progress Tracking',
    description: 'Monitor your mental wellness journey with our intuitive tools.'
  },
  {
    icon: '🔒',
    title: 'Privacy First',
    description: 'Your data is encrypted and your privacy is our top priority.'
  }
];

export default function Landing() {
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-800">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-indigo-100 opacity-20"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50, 0],
              x: [0, Math.random() * 100 - 50, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <motion.header 
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.h1 
            className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
          >
            WellNest
          </motion.h1>
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className="relative group text-gray-700 hover:text-purple-600 transition-colors"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/phq9" 
              className="relative group text-gray-700 hover:text-purple-600 transition-colors"
            >
              Wellness Check
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <a 
              href="#features" 
              className="relative group text-gray-700 hover:text-purple-600 transition-colors"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a 
              href="#contact" 
              className="relative group text-gray-700 hover:text-purple-600 transition-colors"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </a>
          </nav>
          <Link to="/phq9">
            <motion.button 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </Link>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <motion.span 
            className="inline-block mb-4 px-4 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            🚀 Welcome to MindEase
          </motion.span>
          
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Your Mental Health, 
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {' '}Your Safe Space
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Confidential AI-guided support, counseling access, and a supportive community — 
            all in one secure platform designed for your mental wellness journey.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <Link to="/phq9">
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-medium text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Your Journey
              </motion.button>
            </Link>
            <motion.button
              className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-full font-medium text-lg hover:border-purple-400 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>
        
        {/* Animated Feature Showcase */}
        <motion.div 
          className="mt-20 w-full max-w-4xl bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="relative h-48">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeature}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
              >
                <span className="text-5xl mb-4">{features[currentFeature].icon}</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{features[currentFeature].title}</h3>
                <p className="text-gray-600">{features[currentFeature].description}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="flex justify-center mt-6 space-x-2">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentFeature(index)}
                className={`w-3 h-3 rounded-full transition-colors ${currentFeature === index ? 'bg-purple-600 w-6' : 'bg-gray-300'}`}
                aria-label={`Go to feature ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
        <div className="mt-6 space-x-4">
          <Link
            to="/phq9"
            className="px-6 py-3 bg-purple-600 text-white rounded-2xl shadow hover:bg-purple-700"
          >
            Take Wellness Check
          </Link>
          <a
            href="#features"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl shadow hover:bg-gray-300"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-6 bg-white">
        <h3 className="text-3xl font-bold text-center text-gray-900">Key Features</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
          {[
            { title: "AI Chat Support", desc: "Instant coping strategies in English + regional languages" },
            { title: "Confidential Counseling", desc: "Book stigma-free sessions with campus counselors" },
            { title: "Resource Hub", desc: "Relaxation audio, guides, videos curated for students" },
            { title: "Peer Community", desc: "Anonymous, moderated student support forum" },
          ].map((f, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow"
            >
              <h4 className="font-semibold text-lg text-purple-700">{f.title}</h4>
              <p className="text-gray-600 mt-2">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-gradient-to-br from-purple-50 to-blue-50">
        <h3 className="text-3xl font-bold text-center text-gray-900">How It Works</h3>
        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {[
            { step: "Step 1", desc: "Take a quick wellness check (PHQ-9 / GAD-7)" },
            { step: "Step 2", desc: "Get instant guidance or book a counselor" },
            { step: "Step 3", desc: "Explore resources & connect with peers" },
          ].map((s, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-white rounded-2xl shadow"
            >
              <h4 className="font-bold text-purple-700">{s.step}</h4>
              <p className="text-gray-600 mt-2">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-6 px-6 text-center bg-white shadow-inner">
        <p className="text-gray-600">© 2025 MindEase | Built for Students, Backed by Empathy</p>
      </footer>
    </div>
  );
}
