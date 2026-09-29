import React from 'react';
import { MessageSquareText } from 'lucide-react';

interface WhatsAppButtonProps {
  productName?: string;
  productPrice?: number;
  sku?: string;
  variant?: 'floating' | 'primary' | 'outline' | 'pill';
  className?: string;
  number?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  productName,
  productPrice,
  sku,
  variant = 'primary',
  className = '',
  number = '+9242111203203'
}) => {
  const cleanNumber = number.replace(/[^0-9]/g, '');

  const generateMessage = () => {
    if (productName) {
      const priceText = productPrice ? ` (Catalog Price: Rs. ${productPrice.toLocaleString()})` : '';
      const skuText = sku ? ` [SKU: ${sku}]` : '';
      return `Hello, I am interested in ${productName}${skuText}${priceText}. Please provide the current price, availability and delivery information.`;
    }
    return `Hello Interwood Lahore, I would like to inquire about your furniture collections and Lahore showroom assistance.`;
  };

  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(generateMessage())}`;

  if (variant === 'floating') {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Inquire via WhatsApp"
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 font-medium text-sm ${className}`}
      >
        <MessageSquareText className="w-5 h-5 fill-white text-white" />
        <span className="hidden sm:inline">WhatsApp Inquiry</span>
      </a>
    );
  }

  if (variant === 'outline') {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-2 border border-[#8B6F47] text-[#171717] hover:bg-[#8B6F47]/10 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${className}`}
      >
        <MessageSquareText className="w-4 h-4 text-[#8B6F47]" />
        <span>WhatsApp Inquiry</span>
      </a>
    );
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-6 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all shadow-xs hover:shadow-md ${className}`}
    >
      <MessageSquareText className="w-4 h-4 fill-white" />
      <span>WhatsApp Inquiry</span>
    </a>
  );
};
