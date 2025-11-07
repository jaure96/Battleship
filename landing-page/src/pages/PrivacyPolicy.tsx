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
          <p className="text-gray-600 mb-8">Last updated: October 22, 2025</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0D1B2A] mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Welcome to Battleship ("we," "our," or "us"). We are committed
                to protecting your privacy and ensuring you have a positive
                experience while using our mobile application. This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you use our mobile application.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Please read this privacy policy carefully. If you do not agree
                with the terms of this privacy policy, please do not access the
                application.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0D1B2A] mb-4">
                2. Information We Collect
              </h2>
              <h3 className="text-xl font-semibold text-[#0D1B2A] mb-3">
                2.1 Personal Information
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may collect personal information that you voluntarily provide
                to us when you:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Create or join a battle</li>
                <li>Use the application's features</li>
                <li>Contact us for support</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                This information may include:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Battle names and codes</li>
                <li>Game statistics and progress</li>
                <li>Device information</li>
              </ul>

              <h3 className="text-xl font-semibold text-[#0D1B2A] mb-3 mt-6">
                2.2 Automatically Collected Information
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                When you use our application, we may automatically collect
                certain information about your device, including:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Device type and operating system</li>
                <li>Unique device identifiers</li>
                <li>Mobile network information</li>
                <li>Application usage data</li>
                <li>Crash reports and performance data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0D1B2A] mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Provide, operate, and maintain our application</li>
                <li>Enable multiplayer game functionality</li>
                <li>Match players for battles</li>
                <li>Improve and optimize the application</li>
                <li>Understand how users interact with our application</li>
                <li>Respond to user inquiries and provide support</li>
                <li>Detect, prevent, and address technical issues</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0D1B2A] mb-4">
                4. Data Sharing and Disclosure
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell your personal information. We may share your
                information in the following circumstances:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>
                  <strong>With Other Players:</strong> Battle codes and
                  game-related information are shared with players you choose to
                  play with
                </li>
                <li>
                  <strong>Service Providers:</strong> We may share information
                  with third-party service providers who perform services on our
                  behalf
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose
                  information if required by law or in response to valid legal
                  requests
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with any
                  merger, sale of company assets, or acquisition
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0D1B2A] mb-4">
                5. Data Security
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We implement appropriate technical and organizational security
                measures to protect your personal information. However, please
                note that no method of transmission over the internet or
                electronic storage is 100% secure, and we cannot guarantee
                absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0D1B2A] mb-4">
                6. Data Retention
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We retain your personal information only for as long as
                necessary to fulfill the purposes outlined in this Privacy
                Policy, unless a longer retention period is required or
                permitted by law. Game data and battle information may be
                retained for the duration of active games and for a reasonable
                period thereafter.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0D1B2A] mb-4">
                7. Children's Privacy
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our application is not intended for children under the age of
                13. We do not knowingly collect personal information from
                children under 13. If you are a parent or guardian and believe
                that your child has provided us with personal information,
                please contact us, and we will take steps to delete such
                information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0D1B2A] mb-4">
                8. Your Rights
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Depending on your location, you may have the following rights
                regarding your personal information:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Access to your personal information</li>
                <li>Correction of inaccurate data</li>
                <li>Deletion of your personal information</li>
                <li>Restriction of processing</li>
                <li>Data portability</li>
                <li>Object to processing</li>
                <li>Withdraw consent</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                To exercise these rights, please contact us using the
                information provided below.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0D1B2A] mb-4">
                9. Third-Party Services
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our application may contain links to third-party websites or
                services. We are not responsible for the privacy practices of
                these third parties. We encourage you to review their privacy
                policies before providing any personal information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0D1B2A] mb-4">
                10. Changes to This Privacy Policy
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date. You are advised
                to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0D1B2A] mb-4">
                11. International Data Transfers
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Your information may be transferred to and maintained on
                computers located outside of your state, province, country, or
                other governmental jurisdiction where data protection laws may
                differ. By using our application, you consent to such transfers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0D1B2A] mb-4">
                12. Contact Us
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our
                privacy practices, please contact us at:
              </p>
              <div className="bg-gray-100 p-6 rounded-lg">
                <p className="text-gray-700 font-semibold mb-2">
                  Battleship App
                </p>
                <p className="text-gray-700">Email: x.jauregi96@gmail.com</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0D1B2A] mb-4">
                13. Consent
              </h2>
              <p className="text-gray-700 leading-relaxed">
                By using our application, you consent to our Privacy Policy and
                agree to its terms.
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
