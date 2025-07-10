import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Audience } from '../App';
import { useContent } from '../hooks/useContent';

interface AudienceSelectorProps {
  selectedAudience: Audience;
  onAudienceSelect: (audience: Audience) => void;
}

const AudienceSelector: React.FC<AudienceSelectorProps> = ({ 
  selectedAudience, 
  onAudienceSelect 
}) => {
  const content = useContent();

  const audiences = [
    {
      id: 'australian' as const,
      title: content.audienceSelector.australian.title,
      subtitle: content.audienceSelector.australian.subtitle,
      description: content.audienceSelector.australian.description,
      logoSrc: '/logo-symbol.png',
      bgColor: 'bg-black',
      accentColor: '#c4374f',
      ctaText: 'View Packages Designed For You'
    },
    {
      id: 'international' as const,
      title: content.audienceSelector.international.title,
      subtitle: content.audienceSelector.international.subtitle,
      description: content.audienceSelector.international.description,
      logoSrc: '/logo-symbol-inverse.png',
      bgColor: '',
      customBg: '#c4374f',
      ctaText: 'View Collaboration Scenarios For You'
    }
  ];

  return (
    <section id="audience-selector" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold text-gray-900 mb-6">
            {content.audienceSelector.heading}
          </h2>
          
          {/* Helpful indicator - always visible */}
          <div className="mb-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-red-50 rounded-full border border-red-200">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0"></div>
              <span className="text-red-700 font-medium text-sm">I've bundled services to give you some ideas for how you might engage Two-Fifths.</span>
            </div>
          </div>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            <strong style={{ color: '#c4374f' }}>Click below to select</strong> the option that best describes your business and view example collaboration scenarios specifically designed for your needs.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {audiences.map((audience) => {
            const isSelected = selectedAudience === audience.id;
            
            return (
              <div
                key={audience.id}
                className={`relative group cursor-pointer transition-all duration-300 h-full ${
                  isSelected ? 'scale-105' : 'hover:scale-105 hover:shadow-2xl'
                }`}
                onClick={() => {
                  onAudienceSelect(audience.id);
                  // Auto-scroll to the collaboration scenarios section after a brief delay
                  setTimeout(() => {
                    const servicePackagesSection = document.querySelector('[data-section="service-packages"]');
                    if (servicePackagesSection) {
                      const headerHeight = 80;
                      const elementPosition = servicePackagesSection.getBoundingClientRect().top + window.pageYOffset;
                      const offsetPosition = elementPosition - headerHeight;
                      
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth',
                      });
                    }
                  }, 300);
                }}
              >
                <div className={`
                  relative ${audience.bgColor || ''} 
                  rounded-2xl p-8 text-white shadow-xl 
                  transition-all duration-300 h-full flex flex-col
                  ${isSelected ? 'ring-4 ring-white ring-opacity-50' : ''}
                `}
                style={audience.customBg ? { backgroundColor: audience.customBg } : undefined}>
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <img 
                        src={audience.logoSrc} 
                        alt="Two-Fifths Logo" 
                        className="w-8 h-8 object-contain bg-transparent"
                      />
                    </div>
                    <ArrowRight className={`w-6 h-6 transition-transform duration-300 ${
                      isSelected ? 'translate-x-1' : 'group-hover:translate-x-1'
                    }`} />
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-heading text-2xl font-bold mb-2">
                      {audience.title}
                    </h3>
                    <p className="text-lg opacity-90 mb-4">
                      {audience.subtitle}
                    </p>
                    <p className="text-white/80 leading-relaxed mb-6">
                      {audience.description}
                    </p>
                  </div>
                  
                  {/* Call-to-action button */}
                  <div className="mt-auto">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300">
                      <span className="text-sm font-medium">View Example Collaboration Scenarios For You</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className="w-4 h-4 rotate-45" 
                           style={{ backgroundColor: audience.accentColor || '#ffffff' }}></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AudienceSelector;