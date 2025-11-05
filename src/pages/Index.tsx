import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, ChevronRight, Mail, Instagram, Phone, Brain, Layers, Newspaper, Settings, Bookmark, Shield } from "lucide-react";
import { motion } from "framer-motion";
import stockVideo from "@/image/stock.mp4";
import { fetchNews } from "@/lib/api";
import { NewsCard, type NewsItem } from "@/components/NewsCard";

// Contact details (edit as needed)
const CONTACT = {
  email: "finmate09@gmail.com",
  instagram: "https://instagram.com/finmate",
  phone: "+91 95619 61440",
};

const Index = () => {
  // Live market news for landing (default symbol)
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        setLoadingNews(true);
        // Use a liquid, widely-followed symbol to surface relevant articles
        const items = await fetchNews("AAPL");
        setNews(Array.isArray(items) ? items.slice(0, 6) : []);
      } catch {
        setNews([]);
      } finally {
        setLoadingNews(false);
      }
    })();
  }, []);

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
              <Link to="/about" state={{ from: 'landing' }}>
                <Button variant="ghost" className="text-white">
                  About
                </Button>
              </Link>
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
            LOOK FIRST  / THEN LEAP
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3 }}
            className="mt-6 text-xl max-w-2xl text-gray-300"
          >
            Your one stop platform for AI-powered stock market insights and trading tools.
            Letting you do hassle-free trading with confidence.
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
          {[
            {
              title: "AI‑assisted forecasts",
              desc:
                "Signal‑driven, rule‑based projections on recent price action help you gauge near‑term momentum and risk.",
            },
            {
              title: "Pro charts + indicators",
              desc:
                "Clean charts with SMA, EMA, Bollinger Bands and more—toggle what you need, compare symbols, and spot trends fast.",
            },
            {
              title: "Personal watchlist & prefs",
              desc:
                "Your symbols, density and indicator choices are saved to your account and sync across sessions.",
            },
            {
              title: "Live market news",
              desc:
                "Curated headlines from Yahoo Finance keep you on top of catalysts while you analyze the chart.",
            },
            {
              title: "Simple portfolio tracking",
              desc:
                "Add positions with cost and quantity to monitor P/L contextually alongside price and news.",
            },
            {
              title: "Fast search & discovery",
              desc:
                "Autocomplete powered by Yahoo surfaces stocks quickly with names, symbols and exchanges.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="bg-[#0f131c] p-8 rounded-xl border border-white/10 shadow-lg hover:bg-[#141823] transition"
            >
              <div className="p-3 rounded-full bg-primary/20 w-fit mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ✅ WHY FINMATE (Unique Value) */}
      <section className="mx-auto max-w-7xl px-6 pb-28">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="text-4xl font-semibold text-center mb-14"
        >
          Why FinMate
        </motion.h2>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Explainable AI",
              desc: "Forecasts with human‑readable rationale from RSI, MACD, BBands and ATR—no black boxes.",
              Icon: Brain,
            },
            {
              title: "Compare in one view",
              desc: "Overlay multiple symbols from your watchlist to see relative strength instantly.",
              Icon: Layers,
            },
            {
              title: "Live market news",
              desc: "Fresh Yahoo Finance headlines per symbol keep catalysts in context with the chart.",
              Icon: Newspaper,
            },
            {
              title: "Preferences that stick",
              desc: "Density, indicators and last symbol sync to your account—with graceful guest fallbacks.",
              Icon: Settings,
            },
            {
              title: "Watchlist that travels",
              desc: "Server‑backed list when signed in; local fallback when you’re browsing as a guest.",
              Icon: Bookmark,
            },
            {
              title: "Fast and resilient",
              desc: "Auto‑refresh, skeletons and robust error handling keep the UI smooth under real load.",
              Icon: Shield,
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="bg-[#0f131c] p-7 rounded-xl border border-white/10 hover:bg-[#141823] transition"
            >
              <div className="p-3 rounded-full bg-primary/20 w-fit mb-4">
                <f.Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-1">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ✅ NEWS SECTION (Live from backend) */}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {loadingNews && (
            <>
              <div className="h-20 rounded-xl bg-neutral-900/40 border border-neutral-800 animate-pulse" />
              <div className="h-20 rounded-xl bg-neutral-900/40 border border-neutral-800 animate-pulse" />
              <div className="h-20 rounded-xl bg-neutral-900/40 border border-neutral-800 animate-pulse" />
              <div className="h-20 rounded-xl bg-neutral-900/40 border border-neutral-800 animate-pulse" />
            </>
          )}

          {!loadingNews && news.length === 0 && (
            <p className="text-gray-400">No news available right now.</p>
          )}

          {!loadingNews && news.map((n) => (
            <NewsCard key={n.uuid} news={n} />
          ))}
        </div>
      </section>

      {/* ✅ FOOTER */}
      <footer className="w-full bg-[#0b0e14] border-t border-white/10 py-10 mt-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 items-start">

            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-white">Finmate</span>
            </div>

            <div className="flex flex-col gap-2 text-gray-400">
              <span className="text-sm font-semibold text-white/90">Links</span>
              <div className="flex gap-6">
                <Link to="/about" state={{ from: 'landing' }} className="hover:text-white">About</Link>
                <Link to="/privacy" className="hover:text-white">Privacy</Link>
                <Link to="/terms" className="hover:text-white">Terms</Link>
                <Link to="/support" className="hover:text-white">Support</Link>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-gray-400">
              <span className="text-sm font-semibold text-white/90">Contact Us</span>
              <div className="flex flex-col gap-2">
                <a href={`mailto:${CONTACT.email}`} className="hover:text-white flex items-center gap-2">
                  <Mail size={16} /> {CONTACT.email}
                </a>
                <a href={CONTACT.instagram} target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-2">
                  <Instagram size={16} /> {CONTACT.instagram.replace('https://', '')}
                </a>
                <a href={`tel:${CONTACT.phone.replace(/[^+\d]/g, '')}`} className="hover:text-white flex items-center gap-2">
                  <Phone size={16} /> {CONTACT.phone}
                </a>
              </div>
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
