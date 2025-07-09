import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useContent } from '../hooks/useContent';

const TestimonialCarousel: React.FC = () => {
  const content = useContent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Company icon mapping based on testimonial names and companies
  const getCompanyIcon = (name: string, title: string) => {
    const company = title.toLowerCase();
    
    if (company.includes('shippit')) return '/testimonialicons/shippit.png';
    if (company.includes('brauz')) return '/testimonialicons/brauz.png';
    if (company.includes('lonely planet')) return '/testimonialicons/lonelyplanet.png';
    if (company.includes('syncio')) return '/testimonialicons/syncio.png';
    if (company.includes('convert digital')) return '/testimonialicons/convertdigital.jpg';
    if (company.includes('myob')) return '/testimonialicons/MYOB.png';
    if (company.includes('klaviyo')) return '/testimonialicons/klaviyo.png';
    if (company.includes('gocardless')) return '/testimonialicons/gocardless.png';
    if (company.includes('youpay')) return '/testimonialicons/youpay.png';
    if (company.includes('shopify')) return '/testimonialicons/shopify.png';
    if (company.includes('fluent commerce')) return '/testimonialicons/fluentcommerce.png';
    
    // Default fallback - use shippit for the second shippit testimonial
    if (name === 'Shauna Butcher') return '/testimonialicons/shippit.png';
    
    return null;
  };

  // Function to shuffle array using Fisher-Yates algorithm
  const shuffleArray = (array: typeof content.testimonials) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Randomize testimonials on component mount
  const [testimonials] = useState(() => shuffleArray(content.testimonials));

  // Update testimonials when content changes
  useEffect(() => {
    // Re-shuffle when testimonials change
    setCurrentIndex(0);
  }, [content.testimonials]);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate visible testimonials and max index based on screen size
  const visibleCount = isMobile ? 1 : 3;
  const maxIndex = testimonials.length - visibleCount;

  const handleTransition = (newIndex: number) => {
    if (isTransitioning) return;
    
    // Ensure newIndex is within bounds
    const clampedIndex = Math.max(0, Math.min(newIndex, maxIndex));
    
    if (clampedIndex === currentIndex) return;
    
    setIsTransitioning(true);
    setCurrentIndex(clampedIndex);
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const handleNext = () => {
    handleTransition(currentIndex + 1);
  };

  const handlePrevious = () => {
    handleTransition(currentIndex - 1);
  };

  const goToSlide = (index: number) => {
    handleTransition(index);
  };

  return (
    <div className="bg-white py-2">
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative group">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0 || isTransitioning}
            className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 z-10 hover:bg-gray-50 opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ color: '#c4374f' }}
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex || isTransitioning}
            className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 z-10 hover:bg-gray-50 opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ color: '#c4374f' }}
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Testimonials Container */}
          <div className="px-8 md:px-12">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ 
                  transform: `translateX(-${(currentIndex * 100) / visibleCount}%)`,
                }}
              >
                {testimonials.map((testimonial, index) => {
                  const companyIcon = getCompanyIcon(testimonial.name, testimonial.title);
                  
                  return (
                    <div 
                      key={`${testimonial.name}-${index}`} 
                      className={`flex-shrink-0 px-2 md:px-3 ${isMobile ? 'w-full' : 'w-1/3'}`}
                    >
                      <div className="bg-gray-100 rounded-lg p-4 md:p-6 relative h-full flex flex-col">
                        {/* Quote icon */}
                        <div className="absolute top-3 left-3 md:top-4 md:left-4" style={{ color: '#c4374f' }}>
                          <Quote className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        
                        <p className="text-gray-700 text-sm leading-relaxed mt-6 md:mt-8 mb-4 flex-grow">
                          {testimonial.quote}
                        </p>
                        
                        {/* Bottom section with logo and text - always at bottom */}
                        <div className="mt-auto">
                          {/* Red separator line */}
                          <div className="w-6 md:w-8 h-0.5 mb-3" style={{ backgroundColor: '#c4374f' }}></div>
                          
                          <div className="flex items-center space-x-3">
                            {/* Company icon */}
                            {companyIcon && (
                              <img 
                                src={companyIcon} 
                                alt={`${testimonial.title.split(' at ')[1]} logo`}
                                className="w-8 h-8 md:w-10 md:h-10 object-contain flex-shrink-0"
                                style={{ 
                                  backgroundColor: 'transparent',
                                  mixBlendMode: 'multiply',
                                  filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
                                }}
                              />
                            )}
                            
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 text-sm truncate">{testimonial.name}</p>
                              <p className="text-xs text-gray-600 leading-tight">{testimonial.title}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dot Indicators - Show if we have more testimonials than visible count */}
          {testimonials.length > visibleCount && (
            <div className="flex justify-center space-x-2 mt-6 md:mt-8">
              {Array.from({ length: maxIndex + 1 }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  disabled={isTransitioning}
                  className={`h-2 md:h-3 rounded-full transition-all duration-300 disabled:cursor-not-allowed ${
                    index === currentIndex 
                      ? 'w-6 md:w-8' 
                      : 'w-2 md:w-3 hover:scale-125'
                  }`}
                  style={{ 
                    backgroundColor: index === currentIndex ? '#c4374f' : '#d1d5db'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;