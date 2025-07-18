import React from 'react';
import { Clock, Target, MessageCircle, TrendingUp, Search, Network, Users2, Zap, Download } from 'lucide-react';
import { Audience } from '../App';
import { useContent } from '../hooks/useContent';

interface ServicePackagesProps {
  audience: Audience;
  onPlaybookDownload: () => void;
}

const ServicePackages: React.FC<ServicePackagesProps> = ({ audience, onPlaybookDownload }) => {
  const content = useContent();

  const packages = audience === 'australian' 
    ? content.servicePackages.australian.packages 
    : content.servicePackages.international.packages;
  
  const audienceTitle = audience === 'australian' ? 'Australian SaaS Companies' : 'International SaaS Companies';
  const opportunityText = audience === 'australian' 
    ? content.servicePackages.australian.opportunityText
    : content.servicePackages.international.opportunityText;

  const sectionBg = audience === 'australian' ? 'bg-gray-900' : 'bg-white';
  const textColor = audience === 'australian' ? 'text-white' : 'text-gray-900';
  const subtextColor = audience === 'australian' ? 'text-gray-300' : 'text-gray-600';
  const cardBg = audience === 'australian' ? 'bg-black' : 'bg-white';
  const accentColor = audience === 'australian' ? '#c4374f' : '#000000';

  const iconMap = {
    'Fractional Partnership Architect': Users2,
    'Partnership Program Blueprint': Target,
    'Strategic Partnership Sprint': MessageCircle,
    'Advisory & Executive Coaching': TrendingUp,
    'Market Validation Sprint': Search,
    'Partner Network Foundation': Network,
    'Local Market Representation': Users2,
    'Growth Acceleration Program': Zap
  };

  return (
    <section data-section="service-packages" className={`py-20 ${sectionBg}`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className={`font-heading text-4xl font-bold ${textColor} mb-6`}>
            Solutions for {audienceTitle}
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className={`text-xl ${subtextColor} mb-8 leading-relaxed`}>
              {opportunityText}
            </p>
            <div className={`rounded-2xl p-6 border ${
              audience === 'australian' 
                ? 'bg-red-800/30 border-red-600/40'
                : 'bg-red-100 border-red-300'
            }`}>
              <p className={`text-lg font-medium ${audience === 'australian' ? 'text-gray-200' : 'text-gray-700'}`}>
                {audience === 'australian' 
                  ? 'Get partnership expertise without the full-time hire. I solve growth challenges with proven leadership and rapid execution.'
                  : 'Skip the guesswork, and start testing and learning what works quickly. Get the critical local partnership expertise I provide to rapidly scale in ANZ, without the costly full-time commitment.'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {packages.map((pkg, index) => {
            const Icon = iconMap[pkg.title] || Users2;
            const packageBg = audience === 'international' ? '' : 'bg-white';
            const packageBgColor = audience === 'international' ? '#c4374f' : undefined;
            const packageTextColor = audience === 'international' ? 'text-white' : 'text-gray-900';
            const packageSubtextColor = audience === 'international' ? 'text-red-100' : 'text-gray-600';
            const iconBg = audience === 'international' ? '#ffffff' : '#c4374f';
            const iconColor = audience === 'international' ? '#c4374f' : 'white';
            
            return (
              <div key={index} className={`${packageBg} rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 ${audience === 'international' ? '' : 'border border-gray-200'}`}
                   style={packageBgColor ? { backgroundColor: packageBgColor } : undefined}>
                <div className="h-full flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: audience === 'australian' ? '#c4374f' : '#ffffff' }}>
                    <img 
                      src={audience === 'australian' ? "/logo-symbol-inverse.png" : "/logo-symbol.png"} 
                      alt="Two-Fifths Logo" 
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <span className="text-sm font-medium px-3 py-1 rounded-full"
                        style={{ 
                          color: audience === 'international' ? '#ffffff' : '#c4374f',
                          backgroundColor: audience === 'international' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(196, 55, 79, 0.1)'
                        }}>
                    {pkg.subtitle}
                  </span>
                </div>
                
                <div className="flex-grow flex flex-col">
                  <h3 className={`font-heading text-2xl font-bold ${packageTextColor} mb-3`}>
                    {pkg.title}
                  </h3>
                  <div className={`${packageSubtextColor} mb-6 leading-relaxed`}>
                    {(() => {
                      const parts = pkg.description.split('. ');
                      const firstSentence = parts[0] + '.';
                      const restOfDescription = parts.slice(1).join('. ');
                      
                      return (
                        <>
                          <p className="font-bold mb-2">{firstSentence}</p>
                          <p>{restOfDescription}</p>
                        </>
                      );
                    })()}
                  </div>
                  
                  <div className="space-y-3 mb-6 flex-grow">
                    {pkg.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <div className="w-3 h-3 sm:w-2 sm:h-2 rounded-full flex-shrink-0" style={{ backgroundColor: audience === 'international' ? '#ffffff' : '#c4374f' }}></div>
                        <span className={packageSubtextColor}>{feature}</span>
                      </div>
                    ))}
                  </div>
                
                  {/* Good for box - positioned at bottom */}
                  <div className={`rounded-lg p-4 mt-auto ${
                    audience === 'international' ? 'bg-black/20' : 'bg-pink-100'
                  }`}>
                    <p className={`text-sm font-medium ${
                      audience === 'international' ? packageSubtextColor : 'text-red-600'
                    }`} style={audience === 'australian' ? { color: '#c4374f' } : undefined}>
                      {pkg.ideal}
                    </p>
                  </div>
                </div>
                </div>
              </div>
            );
          })}
        </div>

        {audience === 'international' && (
          <div className="rounded-2xl p-8 text-white text-center relative overflow-hidden"
               style={{ backgroundColor: '#000000' }}>
            {/* Shimmer effect */}
            <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            <div className="max-w-3xl mx-auto">
              <h3 className="font-heading text-2xl font-bold mb-4">
                ANZ Expansion Playbook - Coming Soon
              </h3>
              <p className="text-lg mb-6 text-red-100">
                Unlock the definitive guide to conquering Australia and New Zealand. Packed with actionable insights on market analysis, proven partnership strategies, critical regulatory considerations, and real-world success stories. Don't launch without it. Join the waitlist for first access.
              </p>
              <button
                onClick={onPlaybookDownload}
                className="relative inline-flex items-center space-x-2 hover:bg-red-700 px-8 py-3 rounded-full font-semibold transition-colors duration-300 text-white"
                style={{ backgroundColor: '#c4374f' }}>
                <Download className="w-5 h-5" />
                <span>Get Early Access</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default ServicePackages;