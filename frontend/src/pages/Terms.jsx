import React from 'react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using Eaglonhytes Global Consults services, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Land Sales and Property Services</h2>
              <p className="text-gray-700 mb-4">
                Our services include but are not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Land sales and property transactions</li>
                <li>Property development and construction services</li>
                <li>Building materials supply and procurement</li>
                <li>Real estate consultation and advisory services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Property Verification and Due Diligence</h2>
              <p className="text-gray-700 mb-4">
                We conduct thorough verification of all properties including:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Title document verification</li>
                <li>Survey and site inspection</li>
                <li>Government approval confirmation</li>
                <li>Encumbrance checks</li>
              </ul>
              <p className="text-gray-700 mb-4">
                However, buyers are encouraged to conduct their own independent verification.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Payment Terms</h2>
              <p className="text-gray-700 mb-4">
                Payment terms vary by property and service. We offer:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Outright payment options</li>
                <li>Installmental payment plans (6-24 months)</li>
                <li>Flexible payment schedules based on agreement</li>
              </ul>
              <p className="text-gray-700 mb-4">
                All payments must be made through authorized channels and properly documented.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibent text-gray-900 mb-4">5. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                While we strive to provide accurate information and quality services, we are not liable for:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Changes in government policies affecting property ownership</li>
                <li>Natural disasters or force majeure events</li>
                <li>Third-party actions beyond our control</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Dispute Resolution</h2>
              <p className="text-gray-700 mb-4">
                Any disputes arising from our services shall be resolved through:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Direct negotiation and mediation</li>
                <li>Arbitration if necessary</li>
                <li>Nigerian courts as the final resort</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contact Information</h2>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p><strong>Eaglonhytes Global Consults</strong></p>
                <p>Building Materials Market, Timber Shed, Kugbo, Abuja FCT, Nigeria</p>
                <p>Phone: +234 703 877 9189 | +234 812 316 6662</p>
                <p>WhatsApp: Available for all inquiries</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
