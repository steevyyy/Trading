import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How do I book a ride with Connecta?',
    answer: 'Simply select your vehicle, enter pickup and destination locations, choose your date, and complete the booking. You can pay securely via M-Pesa.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept M-Pesa payments for all bookings. Payment is secure and processed instantly through Safaricom STK Push.'
  },
  {
    question: 'Can I cancel or modify my booking?',
    answer: 'Yes, you can cancel or modify your booking up to 24 hours before the scheduled time. Contact our support team for assistance.'
  },
  {
    question: 'Are your drivers licensed and insured?',
    answer: 'Absolutely! All our drivers are fully licensed, background-checked, and our vehicles are comprehensively insured for your safety.'
  },
  {
    question: 'Do you provide services outside Nairobi?',
    answer: 'Yes, we provide transportation services across Kenya. Contact us for bookings outside Nairobi for customized quotes.'
  },
  {
    question: 'How far in advance should I book?',
    answer: 'We recommend booking at least 24 hours in advance, especially for events. However, we also accommodate last-minute bookings based on availability.'
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-neutral-600">Everything you need to know about Connecta</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-neutral-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex justify-between items-center p-6 text-left hover:bg-neutral-50 transition-colors"
                >
                  <span className="font-semibold text-neutral-800 pr-4">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-neutral-600 flex-shrink-0 transition-transform ${openIndex === index ? 'transform rotate-180' : ''}`} />
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6 text-neutral-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};