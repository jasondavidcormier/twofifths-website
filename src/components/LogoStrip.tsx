import React from 'react';

const LogoStrip: React.FC = () => {
  return (
    <section className="pt-16 pb-12 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Logo strip */}
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-8">
            A proven track record building and scaling partnerships for brands you know.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <img 
              src="/1280px-Shopify_logo_2018.svg.webp" 
              alt="Shopify" 
              className="h-8 md:h-10 object-contain hover:scale-110 transition-all duration-300"
            />
            <img 
              src="/shippit-logo-3.png" 
              alt="Shippit" 
              className="h-8 md:h-10 object-contain hover:scale-110 transition-all duration-300"
            />
            <img 
              src="/lonelyplanetNEW_2.png" 
              alt="Lonely Planet" 
              className="h-8 md:h-10 object-contain hover:scale-110 transition-all duration-300"
            />
            <img 
              src="/Linktree_logo.svg.webp" 
              alt="Linktree" 
              className="h-5 md:h-7 object-contain hover:scale-110 transition-all duration-300"
            />
            <img 
              src="/yellowpages.png" 
              alt="Yellow Pages" 
              className="h-8 md:h-10 object-contain hover:scale-110 transition-all duration-300"
            />
            <img 
              src="/Victoria_State_Government_logo.svg.png" 
              alt="Victorian Government" 
              className="h-8 md:h-10 object-contain hover:scale-110 transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogoStrip;