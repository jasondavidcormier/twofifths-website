import React from 'react';
import { ArrowDown } from 'lucide-react';
import { useContent } from '../hooks/useContent';

const Hero: React.FC = () => {
  const content = useContent();

  const scrollToAudience = () => {
    document.getElementById('audience-selector')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Mobile: Stacked layout, Desktop: Split layout */}
      <div className="absolute inset-0 flex flex-col md:flex-row">
        {/* Left side - Solid background for logo and text */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full bg-gradient-to-br from-black via-gray-900 to-black"></div>
        {/* Right side - Hero image (hidden on mobile) */}
        <div 
          className="hidden md:block w-full md:w-1/2 h-full bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: 'url("/JasonFinalHeroIImageCropped.jpg")',
            backgroundSize: 'cover'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/60"></div>
        </div>
      </div>
      
      {/* Mobile hero image as background with overlay */}
      <div 
        className="md:hidden absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("/JasonFinalHeroIImageCropped.jpg")',
          backgroundSize: 'cover'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90"></div>
      </div>
      
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="w-full max-w-6xl mx-auto px-6 flex">
          {/* Content positioned on the left side */}
          <div className="w-full md:w-1/2 text-white text-center md:text-left py-20 md:py-0 flex items-center">
            <div className="max-w-lg mx-auto md:mx-0 w-full">
              <div className="flex items-center justify-center md:justify-start mb-8">
                <img 
                  src="/logo-full-inverse.png" 
                  alt="Two Fifths Logo" 
                  className="h-16 sm:h-20 md:h-18 lg:h-20 xl:h-24 drop-shadow-2xl object-contain"
                />
              </div>
              
              <h1 className="font-heading text-3xl sm:text-4xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 leading-tight">
                <span data-cms-field="hero.headline">{content.hero.headline}</span>
              </h1>
              
              <p className="text-lg sm:text-xl md:text-base lg:text-lg xl:text-xl mb-8 text-gray-200 leading-relaxed">
                <span data-cms-field="hero.subheadline">{content.hero.subheadline}</span>
              </p>
              
              <button
                onClick={scrollToAudience}
                className="group inline-flex items-center space-x-3 px-6 py-3 md:px-6 lg:px-8 md:py-3 lg:py-4 rounded-full text-base md:text-base lg:text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl text-white"
                style={{ backgroundColor: '#c4374f' }}
              >
                <span data-cms-field="hero.ctaText">{content.hero.ctaText}</span>
                <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;