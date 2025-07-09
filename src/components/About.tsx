import { Users, TrendingUp, Globe, Award, Clock, Calendar, Target, Zap, Brain, Lightbulb, Compass, Map, Network, Link, Handshake, Shield, Star, Crown, Gem, Heart, Settings, Wrench, PenTool as Tool, Cog, Puzzle, Building, Layers, Package, MapPin, Navigation, Rocket, Plane, Flag, Mountain, Grid as Bridge, Key } from 'lucide-react';
import TestimonialCarousel from './TestimonialCarousel';
import { useContent } from '../hooks/useContent';

const About: React.FC = () => {
  const content = useContent();

  const credentials = [
    {
      icon: Target,
      title: '20+ Years Ecosystem Mastery',
      description: 'Deep expertise in building value from partnerships, API platforms, and developer communities with a proven track record turning integrations into revenue engines.'
    },
    {
      icon: Network,
      title: 'High Trust & Deep Network',
      description: 'Background at leading companies like Shopify, Linktree, and Lonely Planet, plus a respected network across ANZ retail tech and ecommerce communities.'
    },
    {
      icon: Puzzle,
      title: 'Fractional by Design',
      description: 'On-demand partnership expertise with premium packages designed specifically for startup and scale-up businesses. Veteran leadership at a part-time price point.'
    },
    {
      icon: Rocket,
      title: 'Market Entry Architect',
      description: 'Specialised experience guiding US/UK SaaS businesses into ANZ markets, leveraging networks and local expertise for successful expansion.'
    }
  ];

  return (
    <section>
      {/* Gray background section for Why Two-Fifths and 3-step process */}
      <div className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          {/* Main heading */}
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-gray-900 mb-4">
              {content.about.mainHeading}
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {content.about.description}
            </p>
          </div>

          {/* Three-Step Process - Vertical Flow in Styled Box */}
          <div className="rounded-2xl shadow-xl p-8 md:p-12" style={{ backgroundColor: '#c4374f' }}>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6 items-stretch">
                {/* Step 1: The Challenge */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-full flex flex-col relative shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer">
                  {/* Number 1 */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">1</span>
                  </div>
                  <h4 className="font-heading text-lg font-bold text-gray-900 mb-2">The Problem</h4>
                  <p className="text-gray-600 leading-relaxed flex-grow">
                    Most companies struggle with harnessing partnerships properly, and it can bumped down to a "nice-to-have" rather than a prioritised program of specialised work to generate growth.
                  </p>
                </div>

                {/* Step 2: The Transformation */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-full flex flex-col relative shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer">
                  {/* Number 2 */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">2</span>
                  </div>
                  <h4 className="font-heading text-lg font-bold text-gray-900 mb-2">My Solution</h4>
                  <p className="text-gray-600 leading-relaxed flex-grow">
                    I bring battle-tested, fractional leadership to carefully craft tailored partner programs designed to develop the right relationships with exactly the right partners to get your brand in front of new, ideal customers.
                  </p>
                </div>

                {/* Step 3: The Result */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-full flex flex-col relative shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer">
                  {/* Number 3 */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">3</span>
                  </div>
                  <h4 className="font-heading text-lg font-bold text-gray-900 mb-2">Your Results</h4>
                  <div className="text-gray-600 leading-relaxed flex-grow">
                    <div className="space-y-2 mb-4">
                      <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-50 rounded-full border border-red-200">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span className="text-red-700 font-medium text-sm">Increase your average deal size</span>
                      </div>
                      <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-50 rounded-full border border-red-200">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span className="text-red-700 font-medium text-sm">Reduce your average time to close</span>
                      </div>
                      <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-50 rounded-full border border-red-200">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span className="text-red-700 font-medium text-sm">Improve overall deal won percentages</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tagline text beneath the boxes */}
              <div className="mt-8 text-center">
                <p className="font-heading text-white text-lg leading-relaxed">
                  Revenue is a result, not a goal.<br />
                  Build a partner ecosystem on a foundation of trust and shared purpose, and growth will take care of itself.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* White background section for credentials, bio, and testimonials */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
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
          <div className="bg-black rounded-2xl p-8 md:p-12 mb-12 relative">
            {/* Background graphic icon */}
            <div className="absolute top-4 right-4 opacity-10">
              <img 
                src="/logo-symbol-inverse.png" 
                alt="Two-Fifths Logo" 
                className="w-16 h-16 object-contain"
              />
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="font-heading text-3xl font-bold mb-4">
                  <span style={{ color: '#c4374f' }}>{content.about.profileHeading}</span>
                </h3>
                <p className="text-xl mb-6 text-white font-heading">
                  {content.about.profileSubtitle}
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

          {/* Testimonials */}
          <TestimonialCarousel />
        </div>
      </div>
    </section>
  );
};

export default About;