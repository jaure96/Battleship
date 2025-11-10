import { Ship, X } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#0AA2DD] to-[#088AB8]">
      {/* Navigation */}
      <nav className="bg-[#0D1B2A] border-b border-[#0AA2DD]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <Ship className="w-8 h-8 text-[#FFC107]" />
              <span className="text-2xl font-bold text-white tracking-tight">
                Battleship
              </span>
            </Link>
            <Link
              to="/"
              className="text-white/90 hover:text-white transition-colors flex items-center space-x-2"
            >
              <X className="w-5 h-5" />
              <span>Close</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Privacy Policy Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-[#0D1B2A] mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 mb-8">Last updated: November 10, 2025</p>

          <div className="prose prose-lg max-w-none">
            {/* INTRODUCTION */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0D1B2A] mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Welcome to Battleship. We are committed to protecting your
                privacy and ensuring you have a positive experience. This
                Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when using our mobile application,
                including when advertising is displayed through Google AdMob.
              </p>
            </section>

            {/* INFORMATION WE COLLECT */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0D1B2A] mb-4">
                2. Information We Collect
              </h2>

              <h3 className="text-xl font-semibold text-[#0D1B2A] mb-3">
                2.1 Personal Information
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may collect information you provide voluntarily, such as when
                you create or join battles and contact support. This may
                include:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Battle names and codes</li>
                <li>Game statistics and progress</li>
                <li>Device information</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#0D1B2A] mb-3">
                2.2 Automatically Collected Information
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may automatically collect:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Device model and operating system</li>
                <li>App usage data and gameplay analytics</li>
                <li>Crash and performance logs</li>
                <li>Mobile network information</li>
                <li>Advertising ID (for delivering ads through AdMob)</li>
              </ul>
            </section>

            {/* ADVERTISING / ADMOB SECTION */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0D1B2A] mb-4">
                4. Data Sharing and Disclosure
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell your personal information. We may share certain
                data as described below:
              </p>
              <ul className="list-disc pl-6 mb-8 text-gray-700 space-y-2">
                <li>
                  <strong>Other Players:</strong> Battle information is shared
                  with players you match with.
                </li>
                <li>
                  <strong>Service Providers:</strong> We use third-party service
                  providers such as Google AdMob.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose
                  information if required by law.
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-[#0D1B2A] mb-3">
                4.1 Advertising and Ad Networks (Google AdMob)
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our application uses Google AdMob to display advertisements.
                Google may collect and use:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Device information and usage data</li>
                <li>Advertising ID</li>
                <li>Approximate location</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                Ads may be personalized or non-personalized depending on your
                device settings. You can opt out of personalized ads in your
                device settings:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  Android: Settings → Google → Ads → Opt out of Ads
                  Personalization
                </li>
              </ul>
            </section>

            {/* CHILDREN */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0D1B2A] mb-4">
                7. Children's Privacy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Our application is not intended for children under 13. We do not
                knowingly collect data from children under 13. Google AdMob is
                configured to serve **non-personalized** ads to users in regions
                requiring child protection measures.
              </p>
            </section>

            {/* CONSENT */}
            <section>
              <h2 className="text-2xl font-bold text-[#0D1B2A] mb-4">
                13. Consent
              </h2>
              <p className="text-gray-700 leading-relaxed">
                By using our application, including viewing advertisements, you
                consent to the data practices described in this Privacy Policy.
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0D1B2A] border-t border-[#0AA2DD]/20 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/60 text-sm">
            &copy; 2025 Battleship. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
