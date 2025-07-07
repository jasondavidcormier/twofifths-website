import React from 'react';
import { Users, TrendingUp, Globe, Award } from 'lucide-react';
import TestimonialCarousel from './TestimonialCarousel';
import { useContent } from '../hooks/useContent';

const About: React.FC = () => {
  const content = useContent();

  const credentials = [
    {
      icon: Users,
      title: '20+ Years Ecosystem Mastery',
      description: 'Deep expertise in building value from partnerships, API platforms, and developer communities with a proven track record turning integrations into revenue engines.'
    },
    {
      icon: TrendingUp,
      title: 'High Trust & Deep Network',
      description: 'Background at leading companies like Shopify, Linktree, and Lonely Planet, plus a respected network across ANZ retail tech and ecommerce communities.'
    },
    {
      icon: Award,
      title: 'Fractional by Design',
      description: 'Senior-level partnership expertise, part-time but on-demand, designed specifically for start-up and scale-up businesses.'
    },
    {
      icon: Globe,
      title: 'Market Entry Architect',
      description: 'Specialised experience guiding US/UK SaaS businesses into ANZ markets, leveraging networks and local expertise for successful expansion.'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Main heading */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold text-gray-900 mb-4">
            {content.about.mainHeading}
          </h2>
          <p className="font-heading text-xl font-semibold text-gray-700 mb-6">
            {content.about.tagline}
          </p>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {content.about.description}
          </p>
        </div>

        {/* Credentials grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {credentials.map((credential, index) => {
            const Icon = credential.icon;
            return (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                     style={{ backgroundColor: '#c4374f' }}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">
                  {credential.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {credential.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Profile section */}
        <div className="bg-black rounded-2xl p-8 md:p-12 mb-12">
          {/* Background graphic icon */}
          <div className="absolute top-4 right-4 opacity-10">
            <img 
              src="/logo-symbol-inverse.png" 
              alt="Two Fifths Logo" 
              className="w-16 h-16 object-contain"
            />
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="font-heading text-3xl font-bold mb-4">
                <span style={{ color: '#c4374f' }}>{content.about.profileHeading}</span>
              </h3>
              <p className="text-xl mb-6 text-white">
                <span className="font-heading">{content.about.profileSubtitle}</span>
              </p>
              <div className="space-y-3">
                {content.about.profilePoints.map((point, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-3 h-3 sm:w-2 sm:h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#c4374f' }}></div>
                    <span className="text-white">{point}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <img 
                src="/CormierProfile.png" 
                alt="Jason Cormier" 
                className="w-64 h-64 rounded-2xl mx-auto object-cover ring-4 ring-white ring-offset-4 ring-offset-black shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Logo strip */}
        <div className="text-center mb-12">
          <p className="text-xl text-gray-600 mb-8">
            Successfully built, managed, and grew partner programs for brands you know
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            <img 
              src="/1280px-Shopify_logo_2018.svg.webp" 
              alt="Shopify" 
              className="h-8 md:h-10 object-contain"
            />
            <img 
              src="/shippit-logo-3.png" 
              alt="Shippit" 
              className="h-8 md:h-10 object-contain"
            />
            <img 
              src="/lonelyplanetNEW_2.png" 
              alt="Lonely Planet" 
              className="h-8 md:h-10 object-contain"
            />
            <img 
              src="/Linktree_logo.svg.webp" 
              alt="Linktree" 
              className="h-5 md:h-7 object-contain"
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

        {/* Testimonials */}
        <TestimonialCarousel />
      </div>
    </section>
  );
};

export default About;