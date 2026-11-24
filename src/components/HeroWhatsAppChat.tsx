import React from 'react';
import {ArrowUpRight} from 'lucide-react';
import {useStudio} from '../context/StudioContext';

const DEFAULT_WHATSAPP_DIGITS = '2349161407826';
const DEFAULT_WHATSAPP_GREETING =
  'Hello SOLMONIX STUDIO, I would like to discuss a creative or digital project.';

function WhatsAppBrandIcon({className = 'h-4 w-4'}: {className?: string}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2ZM17.46 15.96C17.23 16.61 16.12 17.2 15.6 17.28C15.12 17.35 14.52 17.38 13.86 17.17C13.46 17.04 12.95 16.87 12.3 16.59C9.56 15.41 7.77 12.65 7.63 12.46C7.49 12.27 6.51 10.97 6.51 9.62C6.51 8.27 7.22 7.61 7.47 7.34C7.72 7.07 8.01 7 8.2 7C8.39 7 8.58 7.01 8.74 7.01C8.92 7.02 9.15 6.95 9.38 7.5C9.62 8.08 10.19 9.48 10.26 9.62C10.33 9.76 10.38 9.92 10.28 10.11C10.19 10.3 10.14 10.42 10 10.58C9.86 10.74 9.71 10.94 9.58 11.06C9.44 11.2 9.3 11.35 9.46 11.63C9.62 11.91 10.18 12.82 11 13.55C12.06 14.49 12.95 14.79 13.23 14.93C13.51 15.07 13.67 15.05 13.84 14.86C14.01 14.67 14.56 14.02 14.75 13.74C14.94 13.46 15.13 13.51 15.39 13.6C15.65 13.7 17.04 14.38 17.32 14.52C17.6 14.66 17.79 14.73 17.86 14.85C17.93 14.97 17.93 15.31 17.46 15.96Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function HeroWhatsAppChat() {
  const {settings} = useStudio();
  const configuredDigits = (settings.contact.whatsappNumber || '').replace(/[^\d]/g, '');
  const activeDigits = configuredDigits.length >= 7 ? configuredDigits : DEFAULT_WHATSAPP_DIGITS;
  const whatsappUrl = `https://wa.me/${activeDigits}?text=${encodeURIComponent(
    DEFAULT_WHATSAPP_GREETING
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Start WhatsApp Chat with SOLMONIX STUDIO"
      className="group inline-flex min-h-[46px] items-center justify-center gap-2.5 rounded-lg border border-[rgba(23,105,255,0.42)] bg-[#080D25] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:border-[#1769FF] hover:bg-[#1769FF]"
    >
      <WhatsAppBrandIcon className="h-4 w-4 shrink-0 text-[#25D366] transition-colors group-hover:text-white" />
      <span>WhatsApp Chat</span>
      <ArrowUpRight
        className="h-4 w-4 shrink-0 text-[#1769FF] transition-colors group-hover:text-white"
        aria-hidden="true"
      />
    </a>
  );
}
