import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, QuestionMarkCircleIcon, PhoneIcon } from '@heroicons/react/24/outline';

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqData = [
    {
      category: "Land Purchase & Sales",
      questions: [
        {
          question: "How do I purchase land through Eaglonhytes?",
          answer: "To purchase land, browse our available properties, contact us for a site visit, verify the land documents, make payment through our secure channels, and complete the legal transfer process. We guide you through every step."
        },
        {
          question: "What documents do I need to buy land?",
          answer: "You'll need valid identification (National ID, International Passport, or Driver's License), proof of income or bank statement, and completed purchase agreement forms. We'll help you prepare all necessary documentation."
        },
        {
          question: "Are the land titles genuine and verified?",
          answer: "Yes, all our properties come with verified titles including Certificate of Occupancy (C of O), Survey Plans, and Deed of Assignment. We conduct thorough due diligence on all properties before listing."
        },
        {
          question: "Can I pay for land in installments?",
          answer: "Yes, we offer flexible payment plans including installmental payments spread over 6-24 months depending on the property. Contact us to discuss payment options that suit your budget."
        },
        {
          question: "What is the process for land verification?",
          answer: "We verify all properties through government agencies, conduct site inspections, check for encumbrances, verify ownership history, and ensure all documents are authentic before listing any property."
        }
      ]
    },
    {
      category: "Property Development",
      questions: [
        {
          question: "Do you provide property development services?",
          answer: "Yes, we offer comprehensive property development services including architectural design, construction management, building materials supply, and project supervision from foundation to completion."
        },
        {
          question: "How long does it take to develop a property?",
          answer: "Development timeline varies by project size. A typical residential building takes 6-12 months, while commercial properties may take 12-18 months. We provide detailed timelines during project planning."
        },
        {
          question: "Can you help with building permits and approvals?",
          answer: "Absolutely! We handle all regulatory approvals including building permits, environmental impact assessments, and other required government approvals for your development project."
        },
        {
          question: "What building materials do you supply?",
          answer: "We supply quality building materials including cement, blocks, roofing sheets, tiles, plumbing fixtures, electrical materials, doors, windows, and finishing materials. All materials meet Nigerian building standards."
        }
      ]
    },
    {
      category: "Location & Accessibility",
      questions: [
        {
          question: "Where are your properties located?",
          answer: "Our properties are primarily located in Abuja FCT and surrounding areas including Kuje, Gwagwalada, Kwali, and other developing districts with good access to major roads and amenities."
        },
        {
          question: "Are the locations accessible by public transport?",
          answer: "Yes, most of our properties are located along major access roads with public transportation. We prioritize locations with good road networks and proximity to essential services."
        },
        {
          question: "What amenities are available in the areas?",
          answer: "Our property locations typically have access to electricity, water supply, schools, healthcare facilities, markets, and religious centers. We provide detailed area information for each property."
        }
      ]
    },
    {
      category: "Legal & Documentation",
      questions: [
        {
          question: "What legal protections do I have as a buyer?",
          answer: "You're protected by Nigerian property laws, purchase agreements, title insurance options, and our guarantee of authentic documentation. We work with certified lawyers to ensure legal compliance."
        },
        {
          question: "How do I transfer land ownership?",
          answer: "Land transfer involves deed preparation, stamp duty payment, registration at the land registry, and issuance of new ownership documents. We handle this process with our legal partners."
        },
        {
          question: "What if there are disputes over the land?",
          answer: "We provide dispute resolution support and work with legal experts to resolve any issues. Our thorough verification process minimizes the risk of disputes, but we stand behind our sales."
        }
      ]
    },
    {
      category: "Financing & Investment",
      questions: [
        {
          question: "Do you offer financing options?",
          answer: "We partner with financial institutions to provide mortgage and loan options. We can also connect you with banks and microfinance institutions that offer property financing."
        },
        {
          question: "Is land a good investment in Abuja?",
          answer: "Yes, Abuja's growing population and development make land a solid investment. Property values have shown consistent appreciation, especially in well-located areas with good infrastructure."
        },
        {
          question: "What are the tax implications of land ownership?",
          answer: "Land ownership involves ground rent, property tax, and capital gains tax on sale. We provide guidance on tax obligations and connect you with tax advisors for comprehensive planning."
        }
      ]
    },
    {
      category: "Customer Support",
      questions: [
        {
          question: "How can I contact customer support?",
          answer: "Contact us via WhatsApp at +234 703 877 9189 or +234 812 316 6662, visit our office at Building Materials Market, Timber Shed, Kugbo, Abuja, or use our online contact form."
        },
        {
          question: "Do you provide after-sales support?",
          answer: "Yes, we provide ongoing support including document updates, property management referrals, development consultation, and assistance with any post-purchase needs."
        },
        {
          question: "Can I get a refund if I'm not satisfied?",
          answer: "Refund policies depend on the specific circumstances and stage of the transaction. We work to resolve any issues and have policies in place to protect both buyers and sellers."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-100 to-amber-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-yellow-200 via-amber-200 to-yellow-200 py-20 border-b-4 border-amber-300">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-yellow-50 opacity-30"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white rounded-full shadow-lg">
              <QuestionMarkCircleIcon className="h-16 w-16 text-amber-600" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6 text-gray-800">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions about land sales, property development, 
            and our services at Eaglonhytes Global Consults.
          </p>
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* FAQ Categories */}
        <div className="space-y-10">
          {faqData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-2xl shadow-xl border-2 border-amber-200 overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-200 via-amber-200 to-yellow-200 p-8 border-b-4 border-amber-300">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                  <div className="w-2 h-8 bg-amber-500 rounded-full mr-4"></div>
                  {category.category}
                </h2>
              </div>
              
              <div className="divide-y divide-yellow-100">
                {category.questions.map((item, questionIndex) => {
                  const itemKey = `${categoryIndex}-${questionIndex}`;
                  const isOpen = openItems[itemKey];
                  
                  return (
                    <div key={questionIndex} className="transition-all duration-200 hover:bg-yellow-50">
                      <button
                        className="flex justify-between items-center w-full text-left p-8 focus:outline-none focus:ring-4 focus:ring-yellow-200 focus:ring-offset-2 transition-all duration-200"
                        onClick={() => toggleItem(itemKey)}
                      >
                        <h3 className="text-xl font-semibold text-gray-800 pr-6 leading-relaxed">
                          {item.question}
                        </h3>
                        <div className={`p-2 rounded-full transition-all duration-300 ${
                          isOpen ? 'bg-amber-500 text-white rotate-180' : 'bg-amber-100 text-amber-700'
                        }`}>
                          <ChevronDownIcon className="h-6 w-6 flex-shrink-0" />
                        </div>
                      </button>
                      
                      {isOpen && (
                        <div className="px-8 pb-8 animate-fade-in">
                          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-xl border-l-4 border-yellow-400">
                            <p className="text-gray-700 leading-relaxed text-lg">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-gradient-to-r from-yellow-200 via-amber-200 to-yellow-200 rounded-2xl p-10 text-center shadow-2xl border-4 border-amber-300">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white rounded-full shadow-lg">
              <PhoneIcon className="h-12 w-12 text-amber-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-700 mb-8 text-lg max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our expert team is here to help you with all your land acquisition and property development needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="https://wa.me/2347038779189"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold text-lg rounded-xl hover:from-amber-600 hover:to-yellow-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              WhatsApp: +234 703 877 9189
            </a>
            <a
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-white border-2 border-amber-400 text-gray-900 font-bold text-lg rounded-xl hover:bg-amber-50 transform hover:scale-105 transition-all duration-300 shadow-md"
            >
              <PhoneIcon className="h-6 w-6 mr-3" />
              Contact Form
            </a>
          </div>
        </div>
      </div>
      
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .bg-gradient-accent {
          background: linear-gradient(135deg, #D4AF37 0%, #F7DC6F 100%);
        }
      `}</style>
    </div>
  );
};

export default FAQ;
