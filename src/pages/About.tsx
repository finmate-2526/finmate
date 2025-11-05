import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { TeamCard } from '@/components/TeamCard';
import hariom from '@/image/hariom.jpg';
import abhinav from '@/image/abhinav.jpg';
import vansh from '@/image/vansh.jpg';
import harshad from '@/image/harshad.jpg';
import bull from '@/image/bull_bear.jpg';
function AnimatedCard({ side = 'left', children }: { side?: 'left' | 'right'; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const base = 'transition-transform transition-opacity duration-700 ease-out';
  const hiddenClass = side === 'left' ? 'translate-x-[-30px] translate-y-6 opacity-0' : 'translate-x-[30px] translate-y-6 opacity-0';
  const visibleClass = 'translate-x-0 translate-y-0 opacity-100 scale-100';

  return (
    <div
      ref={ref}
      className={`${base} ${visible ? visibleClass : hiddenClass} will-change-transform`}
      style={{ transformOrigin: side === 'left' ? 'left center' : 'right center' }}
    >
      {children}
    </div>
  );
}

function AnimatedCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <AnimatedCard side="left">
        <div className="text-left">
          <h3 className="text-3xl font-bold mb-4 text-blue-400">Professional, Clean UI</h3>
          <p className="text-base text-gray-300 leading-relaxed">
            We focus on clarity and speed—giving you a streamlined market experience with thoughtfully
            designed components and delightful motion.
          </p>
        </div>
      </AnimatedCard>

      <AnimatedCard side="right">
        <div className="text-left">
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 w-fit px-1 py-1 rounded-lg mb-4">
            <div className="bg-[#0b0b0b] px-4 py-2 rounded-lg">
              <h3 className="text-3xl font-bold text-pink-400">Seamless Workflow</h3>
            </div>
          </div>
          <p className="text-base text-gray-300 leading-relaxed">
            From watchlists to portfolio insights, everything is one click away and works the way you expect.
          </p>
        </div>
      </AnimatedCard>

      <AnimatedCard side="left">
        <div className="text-left">
          <h3 className="text-3xl font-bold mb-4 text-orange-400">Reliable Data</h3>
          <p className="text-base text-gray-300 leading-relaxed">
            Market data, news, and analytics backed by resilient infrastructure and graceful fallbacks.
          </p>
        </div>
      </AnimatedCard>

      <AnimatedCard side="right">
        <div className="text-left">
          <h3 className="text-3xl font-bold mb-4 text-green-400">Accessibility First</h3>
          <p className="text-base text-gray-300 leading-relaxed">
            A11y-aware colors, keyboard-friendly controls, and responsive layouts—usable anywhere, anytime.
          </p>
        </div>
      </AnimatedCard>
    </div>
  );
}

const About: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const from = (location.state as any)?.from as 'dashboard' | 'landing' | undefined;
  const defaultBack = from === 'dashboard' ? '/dashboard' : '/';
  const onBack = () => {
    try {
      const idx = (window.history.state && (window.history.state as any).idx) ?? 0;
      if (idx > 0) return navigate(-1);
    } catch {}
    navigate(defaultBack);
  };

  return (
  <div className="min-h-screen bg-black text-white">
    {/* Hero Section */}
    <section className="relative overflow-hidden py-16">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Context-aware Back Button */}
        <div className="absolute top-6 left-6">
          <Button onClick={onBack} className="bg-violet-600 hover:bg-violet-700 text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="relative z-10 mt-10">
          <h1 className="text-5xl font-bold mb-6">About FinMate</h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              FinMate is a modern, indicator‑powered market companion. We bring live data, news, charts, and portfolio
              insights together in a fast, elegant interface.
            </p>
          </div>

          {/* Hero image */}
          <div className="mt-10">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-800/30 to-purple-900/30 border border-gray-800">
              <div className="relative w-full aspect-[16/9] sm:aspect-[21/9]">
                <img
                  src={bull}
                  alt="Hariom"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Philosophy */}
    <section className="py-14 bg-[#0b0b0b] border-t border-b border-gray-900">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-4">Our Philosophy</h2>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          Simplicity, speed, and trust. We believe trading tools should be intuitive and dependable.
        </p>
      </div>
    </section>

    {/* Features Grid */}
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedCards />
      </div>
    </section>

    {/* Team */}
    <section className="py-16 bg-[#0b0b0b]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-6 text-center">Meet the Team</h2>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-base text-gray-300 leading-relaxed mb-8">
           Visionaries behind FinMate, dedicated to crafting exceptional trading experiences.
          </p>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12">
            <TeamCard
              name="Hariom Shingane"
              role="ML Model"
              imgSrc={hariom}
              linkedinUrl="https://www.linkedin.com/in/hariom-shingne-14177a27b/"
              instagramUrl="https://www.instagram.com/hariom.shingane"
            />
            <TeamCard
              name="Abhinav Mande"
              role="Backend Developer"
              imgSrc={abhinav}
              linkedinUrl="https://www.linkedin.com/in/abhinav-mande"
              instagramUrl="https://www.instagram.com/abhinav.mande"
            />
            <TeamCard
              name="Vansh Narnaware"
              role="Frontend Developer"
              imgSrc={vansh}
              linkedinUrl="https://www.linkedin.com/in/vansh-narnaware/"
              instagramUrl="https://www.instagram.com/narnawarevansh?igsh=MXF4ZHI0bWEwd3Bmdw=="
            />
            <TeamCard
              name="Harshad Luche"
              role="Database expert"
              imgSrc={harshad}
              linkedinUrl="https://www.linkedin.com/in/harshad-luche/"
              instagramUrl="https://www.instagram.com/harshad.db"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
  );
};

export default About;
