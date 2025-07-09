import { Users, TrendingUp, Globe, Award, Clock, Calendar, Target, Zap, Brain, Lightbulb, Compass, Map, Network, Link, Handshake, Shield, Star, Crown, Gem, Heart, Settings, Wrench, PenTool as Tool, Cog, Puzzle, Building, Layers, Package, MapPin, Navigation, Rocket, Plane, Flag, Mountain, Grid as Bridge, Key } from 'lucide-react';
import TestimonialCarousel from './TestimonialCarousel';
import { useContent } from '../hooks/useContent';

const About: React.FC = () => {
  const content = useContent();

  // Icon options for each credential - you can choose which set to use
  const iconOptions = {
    ecosystemMastery: [
      { icon: Clock, name: 'Clock', description: 'Represents time/experience' },
      { icon: Brain, name: 'Brain', description: 'Represents expertise/knowledge' },
      { icon: Target, name: 'Target', description: 'Represents precision/mastery' },
      { icon: Compass, name: 'Compass', description: 'Represents navigation/guidance' },
      { icon: Lightbulb, name: 'Lightbulb', description: 'Represents insights/innovation' }
    ],
    trustNetwork: [
      { icon: Network, name: 'Network', description: 'Represents connections' },
      { icon: Handshake, name: 'Handshake', description: 'Represents trust/partnerships' },
      { icon: Shield, name: 'Shield', description: 'Represents trust/reliability' },
      { icon: Star, name: 'Star', description: 'Represents reputation/excellence' },
      { icon: Heart, name: 'Heart', description: 'Represents relationships/care' }
    ],
    fractionalDesign: [
      { icon: Settings, name: 'Settings', description: 'Represents customization/precision' },
      { icon: Puzzle, name: 'Puzzle', description: 'Represents perfect fit solution' },
      { icon: Layers, name: 'Layers', description: 'Represents structured approach' },
      { icon: Tool, name: 'Tool', description: 'Represents specialized expertise' },
      { icon: Package, name: 'Package', description: 'Represents packaged solution' }
    ],
    marketEntry: [
      { icon: MapPin, name: 'MapPin', description: 'Represents location/market entry' },
      { icon: Rocket, name: 'Rocket', description: 'Represents launch/acceleration' },
      { icon: Bridge, name: 'Bridge', description: 'Represents connection/entry' },
      { icon: Key, name: 'Key', description: 'Represents access/unlocking markets' },
      { icon: Flag, name: 'Flag', description: 'Represents territory/market presence' }
    ]
  };

  const credentials = [
    {
      icon: Target, // OPTION 3: Target for precision/mastery - SELECTED
      title: '20+ Years Ecosystem Mastery',
      description: 'Deep expertise in building value from partnerships, API platforms, and developer communities with a proven track record turning integrations into revenue engines.'
    },
    {
      icon: Network, // OPTION 1: Network for connections
      title: 'High Trust & Deep Network',
      description: 'Background at leading companies like Shopify, Linktree, and Lonely Planet, plus a respected network across ANZ retail tech and ecommerce communities.'
    },
    {
      icon: Puzzle, // OPTION 2: Puzzle for perfect fit - SELECTED
      title: 'Fractional by Design',
      description: 'On-demand partnership expertise with premium packages designed specifically for startup and scale-up businesses. Veteran leadership at a part-time price point.'
    },
    {
      icon: Rocket, // OPTION 2: Rocket for launch/acceleration - SELECTED
      title: 'Market Entry Architect',
      description: 'Specialised experience guiding US/UK SaaS businesses into ANZ markets, leveraging networks and local expertise for successful expansion.'
    }
  ];

  // You can uncomment this section to see all icon options rendered
  const renderIconOptions = () => (
    <div className="mb-8 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Icon Options Preview:</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-sm mb-2">20+ Years Ecosystem Mastery:</h4>
          <div className="flex space-x-4">
            {iconOptions.ecosystemMastery.map(({ icon: Icon, name, description }) => (
              <div key={name} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center mb-1">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-xs text-gray-600">{name}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-sm mb-2">High Trust & Deep Network:</h4>
          <div className="flex space-x-4">
            {iconOptions.trustNetwork.map(({ icon: Icon, name, description }) => (
              <div key={name} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center mb-1">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-xs text-gray-600">{name}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-sm mb-2">Fractional by Design:</h4>
          <div className="flex space-x-4">
            {iconOptions.fractionalDesign.map(({ icon: Icon, name, description }) => (
              <div key={name} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center mb-1">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-xs text-gray-600">{name}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-sm mb-2">Market Entry Architect:</h4>
          <div className="flex space-x-4">
            {iconOptions.marketEntry.map(({ icon: Icon, name, description }) => (
              <div key={name} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center mb-1">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-xs text-gray-600">{name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

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

        {/* Uncomment the line below to see all icon options */}
        {/* {renderIconOptions()} */}

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
    </section>
  );
};

export default About;