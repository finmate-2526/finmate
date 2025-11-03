import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import stockVideo from "@/image/stock.mp4";

// Dummy News Data
const newsData = [
  {
    title: "Tech Stocks Surge as Nasdaq Hits Record High",
    source: "Reuters",
    time: "2 hours ago",
  },
  {
    title: "Tesla’s Q4 Earnings Beat Expectations",
    source: "Bloomberg",
    time: "5 hours ago",
  },
  {
    title: "Bitcoin Rallies Above $120k After ETF Approval",
    source: "CoinDesk",
    time: "1 hour ago",
  },
  {
    title: "Nvidia Reveals Next Gen AI Chip Series",
    source: "CNBC",
    time: "30 minutes ago",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">

      {/* ✅ HERO SECTION */}
      <div className="relative w-full isolate overflow-hidden pb-32">

        {/* Animated background glow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 -z-20 bg-gradient-to-b from-black via-[#0b0f1a] to-[#0f0f1f]"
        />

        {/* Parallax neon streaks */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 2 }}
          style={{ y: "-10%" }}
          className="absolute inset-0 -z-10 blur-3xl bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-fuchsia-500/20"
        />

        {/* Floating particles */}
        <div className="absolute inset-0 -z-10">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0.1, 0.5, 0.1],
                scale: [0.8, 1.2, 0.8],
                y: ["0%", "-80%"],
              }}
              transition={{
                duration: 6 + Math.random() * 5,
                repeat: Infinity,
                repeatType: "mirror",
              }}
              style={{
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
              }}
            />
          ))}
        </div>

        {/* ✅ NAVBAR */}
        <nav className="mx-auto max-w-7xl px-6 py-5 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="h-7 w-7 text-primary" />
              <span className="text-2xl font-bold text-white">Finmate</span>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" className="text-white">
                  Sign in
                </Button>
              </Link>
              <Link to="/login">
                <Button className="px-6">Get Started</Button>
              </Link>
            </div>
          </motion.div>
        </nav>

        {/* ✅ HERO CONTENT */}
        <div className="w-full flex flex-col items-center text-center px-6 pt-28 relative z-10">

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl sm:text-7xl font-bold tracking-tight text-white"
          >
            LOOK FIRST THEN LEAP
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3 }}
            className="mt-6 text-xl max-w-2xl text-gray-300"
          >
            Make smarter investment decisions with Finmate's advanced AI predictions.
            Track stocks, analyze trends, and stay ahead of the market with real-time insights.
          </motion.p>

          {/* ✅ TradingView-style video */}
          <motion.div
            className="relative w-full max-w-[1400px] mt-16"
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
          >
            <div className="absolute inset-0 -z-10 opacity-60 blur-3xl bg-gradient-to-r from-purple-600/30 via-blue-600/30 to-purple-600/30" />

            <motion.div
              animate={{ scale: [1, 1.01, 1] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="relative w-full rounded-xl overflow-hidden shadow-2xl border border-white/10"
            >
              <video
                src={stockVideo}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto object-cover"
              />
            </motion.div>
          </motion.div>

          {/* HERO BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4 }}
            className="mt-14 flex items-center justify-center gap-x-8"
          >
            <Link to="/register">
              <Button size="lg" className="gap-2 text-xl px-8 py-4">
                Start Trading <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>

            <Link to="/login">
              <Button
                size="lg"
                variant="ghost"
                className="text-xl px-8 py-4 text-white"
              >
                Sign in to Dashboard
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ✅ FEATURES SECTION */}
      <section className="mx-auto max-w-7xl px-6 pb-32">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-4xl font-semibold text-center mb-14"
        >
          Powerful Tools for Smarter Investing
        </motion.h2>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {["AI Predictions", "Real-time Analytics", "Smart Portfolio"].map(
            (title, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                className="bg-[#0f131c] p-8 rounded-xl border border-white/10 shadow-lg hover:bg-[#141823] transition"
              >
                <div className="p-3 rounded-full bg-primary/20 w-fit mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-400">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
              </motion.div>
            )
          )}
        </div>
      </section>

      {/* ✅ NEWS SECTION (TradingView Style) */}
      <section className="mx-auto max-w-7xl px-6 pb-32">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-4xl font-semibold mb-10"
        >
          Latest Market News
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {newsData.map((n, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="bg-[#0f131c] p-6 rounded-xl border border-white/10 hover:bg-[#141823] transition"
            >
              <h3 className="text-xl font-semibold">{n.title}</h3>
              <p className="text-gray-400 mt-2">
                {n.source} • {n.time}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ✅ FOOTER */}
      <footer className="w-full bg-[#0b0e14] border-t border-white/10 py-10 mt-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-white">Finmate</span>
            </div>

            <div className="flex gap-6 text-gray-400">
              <Link to="/privacy" className="hover:text-white">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-white">
                Terms
              </Link>
              <Link to="/support" className="hover:text-white">
                Support
              </Link>
            </div>
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            © {new Date().getFullYear()} Finmate. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
