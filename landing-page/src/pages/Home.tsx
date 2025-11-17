import { useState } from "react";
import { Link } from "react-router-dom";
import { Ship, Bomb, Shield, Target, Menu, X, Swords } from "lucide-react";
import StepCard from "../components/StepCard";
import FeatureCard from "../components/FeatureCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";

// @ts-expect-error: no type declarations for swiper CSS
import "swiper/css";
// @ts-expect-error: no type declarations for swiper CSS
import "swiper/css/navigation";
// @ts-expect-error: no type declarations for swiper CSS
import "swiper/css/pagination";

const IMAGES_PATH = [
  "screen1.png",
  "screen2.png",
  "screen3.png",
  "screen4.png",
  "screen5.png",
  "screen6.png",
  "screen7.png",
  "screen8.png",
];

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-linear-to-b from-[#0AA2DD] to-[#088AB8]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#0D1B2A]/95 backdrop-blur-sm z-50 border-b border-[#0AA2DD]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="/icon.png"
                alt="Battleship Logo"
                className="w-10 h-10"
              />
              <span className="text-2xl font-bold text-white tracking-tight">
                Battleship
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-white/90 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#how-to-play"
                className="text-white/90 hover:text-white transition-colors"
              >
                How to Play
              </a>
              <Link
                to="/privacyPolicy"
                className="text-white/90 hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <a
                href="https://play.google.com/store/apps/details?id=com.xjauregi.battleship"
                className="bg-[#FFC107] text-[#0D1B2A] px-6 py-2 rounded-lg font-semibold hover:bg-[#FFD54F] transition-all transform hover:scale-105"
              >
                Download Now
              </a>
            </div>

            <button
              className="md:hidden text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-[#0D1B2A] border-t border-[#0AA2DD]/20">
            <div className="px-4 py-4 space-y-3">
              <a
                href="#features"
                className="block text-white/90 hover:text-white py-2"
              >
                Features
              </a>
              <a
                href="#how-to-play"
                className="block text-white/90 hover:text-white py-2"
              >
                How to Play
              </a>
              <Link
                to="/privacyPolicy"
                className="block text-white/90 hover:text-white py-2"
                onClick={() => setMenuOpen(false)}
              >
                Privacy
              </Link>
              <a
                href="https://play.google.com/store/apps/details?id=com.xjauregi.battleship"
                className="block bg-[#FFC107] text-[#0D1B2A] px-6 py-2 rounded-lg font-semibold text-center"
              >
                Download Now
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-7xl mx-auto"
        >
          <img
            src="/icon-white.png"
            className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-8"
          />

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Battleship
          </h1>

          <p className="text-2xl md:text-3xl text-white/90 mb-4">
            Destroy the enemy fleet
          </p>

          <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Challenge your friends in the classic naval combat game.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://play.google.com/store/apps/details?id=com.xjauregi.battleship"
              className="bg-[#FFC107] text-[#0D1B2A] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#FFD54F] transition-all transform hover:scale-105 shadow-2xl"
            >
              Get it on Google Play
            </a>
            <a
              href="#how-to-play"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
            >
              Learn How to Play
            </a>
          </div>
        </motion.div>
      </section>

      {/* Carousel Section */}
      <section className="py-20 px-4 bg-[#0D1B2A]">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">
          App Preview
        </h2>

        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 2500 }}
          spaceBetween={30}
          slidesPerView={1.2}
          centeredSlides
          loop
          breakpoints={{
            768: { slidesPerView: 2.5 },
          }}
          className="max-w-5xl mx-auto"
        >
          {IMAGES_PATH.map((file, i) => (
            <SwiperSlide key={i}>
              <img
                src={`/screenshots/${file}`}
                className="rounded-2xl shadow-2xl border border-white/10"
                alt=""
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-[#0D1B2A]">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
          Game Features
        </h2>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Swords className="w-8 h-8 text-[#FFC107]" />,
              title: "Create Your Battle",
              description:
                "Be the captain and create your own battle room. Configure your fleet and invite opponents with a unique battle code.",
            },
            {
              icon: <Target className="w-8 h-8 text-[#FFC107]" />,
              title: "Join Existing Battles",
              description:
                "Enter a battle code to join ongoing games. Find your battleship and compete against other players.",
            },
            {
              icon: <Ship className="w-8 h-8 text-[#FFC107]" />,
              title: "Strategic Fleet Placement",
              description:
                "Place your Carrier, Battleship, Crusier, Submarine, and Destroyer strategically on the grid.",
            },

            {
              icon: <Bomb className="w-8 h-8 text-[#FFC107]" />,
              title: "Real-time Combat",
              description:
                "Engage in turn-based naval warfare. Target enemy positions and sink their entire fleet to win.",
            },
            {
              icon: <Shield className="w-8 h-8 text-[#FFC107]" />,
              title: "Classic Gameplay",
              description:
                "Experience the timeless strategy game with intuitive touch controls and beautiful design.",
            },
          ].map(({ icon, title, description }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <FeatureCard
                icon={icon}
                title={title}
                description={description}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* How to Play Section */}
      <section
        id="how-to-play"
        className="py-20 px-4 bg-linear-to-b from-[#0D1B2A] to-[#0AA2DD]"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
          How to Play
        </h2>

        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0 }}
            viewport={{ once: true }}
          >
            <StepCard
              number="1"
              title="Create or Join a Battle"
              description="Choose to create a new battle and share your code, or join an existing battle by entering a friend's code."
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            viewport={{ once: true }}
          >
            <StepCard
              number="2"
              title="Place Your Ships"
              description="Strategically position your 5 ships on the grid: Carrier (5), Battleship (4), Crusier (3), Submarine (3), and Destroyer (2)."
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.15 }}
            viewport={{ once: true }}
          >
            <StepCard
              number="3"
              title="Take Turns Attacking"
              description="Tap cells on the enemy grid to launch attacks. Hit all parts of a ship to sink it."
            />
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-[#0D1B2A] text-center">
        <Ship className="w-20 h-20 text-[#FFC107] mx-auto mb-8" />
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Command Your Fleet?
        </h2>
        <p className="text-xl text-white/80 mb-12">
          Download now and start battling with friends!
        </p>
        <a
          href="https://play.google.com/store/apps/details?id=com.xjauregi.battleship"
          className="inline-block bg-[#FFC107] text-[#0D1B2A] px-12 py-5 rounded-xl font-bold text-xl hover:bg-[#FFD54F] transition-all transform hover:scale-105 shadow-2xl"
        >
          Download on Google Play
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D1B2A] border-t border-[#0AA2DD]/20 py-8 px-4 text-center">
        <Ship className="w-6 h-6 text-[#FFC107] mx-auto mb-2" />
        <span className="text-white font-bold">Battleship</span>
        <p className="text-white/60 text-sm mt-3">
          &copy; 2025 Battleship. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
