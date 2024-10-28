import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function PricesButton() {
  return (
    <a
      href="/see.html"
      className="fixed top-4 right-4 inline-flex items-center px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-md shadow-lg transition-colors duration-200 font-medium"
    >
      <ExternalLink className="w-4 h-4 mr-2" />
      See Prices
    </a>
  );
}