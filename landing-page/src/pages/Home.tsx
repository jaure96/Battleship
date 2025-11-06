import { useState } from "react";
import { Link } from "react-router-dom";
import { Ship, Crown, Bomb, Shield, Target, Menu, X } from "lucide-react";
import StepCard from "../components/StepCard";
import FeatureCard from "../components/FeatureCard";

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-linear-to-b from-[#0AA2DD] to-[#088AB8]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#0D1B2A]/95 backdrop-blur-sm z-50 border-b border-[#0AA2DD]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <Ship className="w-8 h-8 text-[#FFC107]" />
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
                href="https://play.google.com/store"
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

        {/* Mobile menu */}
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
                href="https://play.google.com/store"
                className="block bg-[#FFC107] text-[#0D1B2A] px-6 py-2 rounded-lg font-semibold text-center"
              >
                Download Now
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <Ship className="w-24 h-24 text-white drop-shadow-2xl" />
              <Crown className="w-12 h-12 text-[#FFC107] absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Battleship
          </h1>

          <p className="text-2xl md:text-3xl text-white/90 mb-4 font-light">
            Destroy the enemy fleet
          </p>

          <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Challenge your friends in the classic naval combat game. Create or
            join battles and become the ultimate fleet commander.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://play.google.com/store"
              className="bg-[#FFC107] text-[#0D1B2A] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#FFD54F] transition-all transform hover:scale-105 shadow-2xl flex items-center space-x-2"
            >
              <span>Get it on Google Play</span>
            </a>
            <a
              href="#how-to-play"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
            >
              Learn How to Play
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-[#0D1B2A]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            Game Features
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Crown className="w-12 h-12 text-[#FFC107]" />}
              title="Create Your Battle"
              description="Be the captain and create your own battle room. Configure your fleet and invite opponents with a unique battle code."
            />

            <FeatureCard
              icon={<Target className="w-12 h-12 text-[#FFC107]" />}
              title="Join Existing Battles"
              description="Enter a battle code to join ongoing games. Find your battleship and compete against other players."
            />

            <FeatureCard
              icon={<Ship className="w-12 h-12 text-[#FFC107]" />}
              title="Strategic Fleet Placement"
              description="Place your Carrier, Battleship, Crusier, Submarine, and Destroyer strategically on the grid."
            />

            <FeatureCard
              icon={<Bomb className="w-12 h-12 text-[#FFC107]" />}
              title="Real-time Combat"
              description="Engage in turn-based naval warfare. Target enemy positions and sink their entire fleet to win."
            />

            <FeatureCard
              icon={<Shield className="w-12 h-12 text-[#FFC107]" />}
              title="Classic Gameplay"
              description="Experience the timeless strategy game with intuitive touch controls and beautiful design."
            />

            <FeatureCard
              icon={<Crown className="w-12 h-12 text-[#FFC107]" />}
              title="Multiplayer Fun"
              description="Challenge friends or family members in exciting head-to-head naval battles."
            />
          </div>
        </div>
      </section>

      {/* How to Play Section */}
      <section
        id="how-to-play"
        className="py-20 px-4 bg-linear-to-b from-[#0D1B2A] to-[#0AA2DD]"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            How to Play
          </h2>

          <div className="space-y-8">
            <StepCard
              number="1"
              title="Create or Join a Battle"
              description="Choose to create a new battle and share your code, or join an existing battle by entering a friend's code."
            />

            <StepCard
              number="2"
              title="Place Your Ships"
              description="Strategically position your 5 ships on the grid: Carrier (5), Battleship (4), Crusier (3), Submarine (3), and Destroyer (2)."
            />

            <StepCard
              number="3"
              title="Take Turns Attacking"
              description="Tap cells on the enemy grid to launch attacks. Hit all parts of a ship to sink it."
            />

            <StepCard
              number="4"
              title="Destroy the Enemy Fleet"
              description="The first player to sink all of their opponent's ships wins the battle!"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-[#0D1B2A]">
        <div className="max-w-4xl mx-auto text-center">
          <Ship className="w-20 h-20 text-[#FFC107] mx-auto mb-8" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Command Your Fleet?
          </h2>
          <p className="text-xl text-white/80 mb-12">
            Download now and start battling with friends!
          </p>
          <a
            href="https://play.google.com/store"
            className="inline-block bg-[#FFC107] text-[#0D1B2A] px-12 py-5 rounded-xl font-bold text-xl hover:bg-[#FFD54F] transition-all transform hover:scale-105 shadow-2xl"
          >
            Download on Google Play
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D1B2A] border-t border-[#0AA2DD]/20 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Ship className="w-6 h-6 text-[#FFC107]" />
            <span className="text-white font-bold">Battleship</span>
          </div>
          <div className="flex justify-center space-x-6 mb-4">
            <Link
              to="/privacyPolicy"
              className="text-white/60 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
          <p className="text-white/60 text-sm">
            &copy; 2025 Battleship. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
