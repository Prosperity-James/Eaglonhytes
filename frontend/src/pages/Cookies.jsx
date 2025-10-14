import React from 'react';

const Cookies = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Are Cookies</h2>
              <p className="text-gray-700 mb-4">
                Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and improving site functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Cookies</h2>
              <p className="text-gray-700 mb-4">We use cookies for the following purposes:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li><strong>Essential Cookies:</strong> Required for basic site functionality and security</li>
                <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our website</li>
                <li><strong>Functionality Cookies:</strong> Remember your preferences and settings</li>
                <li><strong>Authentication Cookies:</strong> Keep you logged in during your session</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Types of Cookies We Use</h2>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900">Session Cookies</h3>
                  <p className="text-blue-800">Temporary cookies that expire when you close your browser</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-900">Persistent Cookies</h3>
                  <p className="text-green-800">Remain on your device for a set period or until manually deleted</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-900">Third-Party Cookies</h3>
                  <p className="text-purple-800">Set by external services we use for analytics and functionality</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Managing Cookies</h2>
              <p className="text-gray-700 mb-4">
                You can control and manage cookies in several ways:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Browser settings: Most browsers allow you to refuse or delete cookies</li>
                <li>Opt-out tools: Use browser extensions or privacy tools</li>
                <li>Privacy settings: Adjust settings in your browser's privacy section</li>
              </ul>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-yellow-800">
                  <strong>Note:</strong> Disabling cookies may affect the functionality of our website and your user experience.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about our Cookie Policy, please contact us:
              </p>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p><strong>Eaglonhytes Global Consults</strong></p>
                <p>Building Materials Market, Timber Shed, Kugbo, Abuja FCT, Nigeria</p>
                <p>Phone: +234 703 877 9189 | +234 812 316 6662</p>
                <p>WhatsApp: Available for inquiries</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cookies;
