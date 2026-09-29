import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Phone, MapPin, Truck } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQPage: React.FC = () => {
  const faqs: FAQItem[] = [
    {
      question: 'Where is your primary showroom located in Lahore?',
      answer: 'Our flagship retail showroom is located at 7, Babar Block, New Garden Town, Lahore 54600, Pakistan. Our head office and manufacturing facilities are situated at 56 Sultan Mehmood Road, Shalimar Town, Mehmood Booti, Lahore 54920.'
    },
    {
      question: 'What are the delivery timelines across Pakistan?',
      answer: 'Within the Lahore metropolitan area, in-stock products are dispatched and installed within 3 to 5 business days. For Karachi, Islamabad, Rawalpindi, Peshawar, and other provincial hubs, secure transit takes approximately 5 to 9 business days.'
    },
    {
      question: 'Is assembly included with my furniture order?',
      answer: 'Yes! White-glove on-site assembly is carried out by trained Interwood technicians for all major bedframes, wardrobes, modular sofas, executive workstations, and dining tables.'
    },
    {
      question: 'What payment methods do you support?',
      answer: 'We support Cash on Delivery (COD) across Pakistan, as well as in-person payment & inspection at our Babar Block, New Garden Town showroom prior to home dispatch.'
    },
    {
      question: 'How do I care for solid wood and natural veneers in Pakistan’s climate?',
      answer: 'We recommend dusting surfaces weekly with a dry microfibre cloth, keeping furniture away from humid damp walls or direct extreme ultraviolet exposure, and promptly blotting any liquid spills with a dry absorbent cloth.'
    },
    {
      question: 'Can I request a custom size or fabric upholstery?',
      answer: 'Yes. For specialized dimensions, modular adaptations, or commercial executive requirements, our interior designers can assist you at our Lahore showroom or via WhatsApp inquiry.'
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#8B6F47]">
          Customer Assistance
        </span>
        <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-[#171717]">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-lg mx-auto">
          Common queries regarding delivery in Lahore, on-site assembly, materials, and showroom appointments.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden transition-all shadow-xs"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4"
              >
                <span className="text-sm font-semibold text-[#171717]">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-500 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#8B6F47]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs text-stone-600 leading-relaxed font-light border-t border-stone-100 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-[#EDE8DF] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-[#171717]">Need more assistance?</h3>
          <p className="text-xs text-stone-600">Speak directly with our Lahore showroom team at +92 42 111-203-203</p>
        </div>
        <Link
          to="/contact"
          className="px-6 py-2.5 bg-[#171717] hover:bg-[#8B6F47] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shrink-0"
        >
          Contact Showroom
        </Link>
      </div>
    </div>
  );
};
