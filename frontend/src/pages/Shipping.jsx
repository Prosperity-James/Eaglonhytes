import React from 'react';
import { TruckIcon, ClockIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';

const Shipping = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Delivery & Site Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide comprehensive delivery services for building materials and site support for your construction projects across Abuja and surrounding areas.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <TruckIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Material Delivery</h3>
            </div>
            <p className="text-gray-700">
              Fast and reliable delivery of building materials including cement, blocks, roofing sheets, and finishing materials to your construction site.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <ClockIcon className="h-8 w-8 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Same-Day Service</h3>
            </div>
            <p className="text-gray-700">
              Order before 2 PM and get same-day delivery within Abuja municipal area. Next-day delivery available for surrounding areas.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <MapPinIcon className="h-8 w-8 text-purple-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Wide Coverage</h3>
            </div>
            <p className="text-gray-700">
              We deliver to Abuja FCT and surrounding areas including Kuje, Gwagwalada, Kwali, Bwari, and other satellite towns.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Delivery Information</h2>
          
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Areas & Times</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Abuja Municipal (Central)</span>
                  <span className="text-green-600 font-medium">Same Day</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Kuje, Gwagwalada, Kwali</span>
                  <span className="text-blue-600 font-medium">1-2 Days</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Bwari, Abaji</span>
                  <span className="text-blue-600 font-medium">1-2 Days</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Other FCT Areas</span>
                  <span className="text-blue-600 font-medium">2-3 Days</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Charges</h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-green-800 font-medium">Free Delivery</p>
                  <p className="text-green-700 text-sm">Orders above ₦500,000 within Abuja Municipal</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 font-medium">Standard Delivery</p>
                  <p className="text-blue-700 text-sm">₦5,000 - ₦15,000 depending on location and quantity</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 font-medium">Express Delivery</p>
                  <p className="text-blue-700 text-sm">₦10,000 - ₦25,000 for urgent same-day delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Additional Services</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Site Support Services</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Material offloading and placement</li>
                <li>• Site inspection and material verification</li>
                <li>• Construction supervision and guidance</li>
                <li>• Quality control and material testing</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Special Handling</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Fragile materials (tiles, glass, fixtures)</li>
                <li>• Heavy equipment and machinery</li>
                <li>• Bulk orders and large quantities</li>
                <li>• Time-sensitive deliveries</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Need Delivery or Site Services?
          </h2>
          <p className="text-gray-600 mb-6">
            Contact us to discuss your delivery requirements and get a customized quote for your project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/2347038779189"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <PhoneIcon className="h-5 w-5 mr-2" />
              WhatsApp: +234 703 877 9189
            </a>
            <a
              href="tel:+2348123166662"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PhoneIcon className="h-5 w-5 mr-2" />
              Call: +234 812 316 6662
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
