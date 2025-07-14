import React from 'react';
import { Mail, Linkedin } from 'lucide-react';

const Header: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToNextSteps = () => {
    const conversationForm = document.querySelector('[data-section="conversation-form"]');
    if (conversationForm) {
      const headerHeight = 80;
      const elementPosition = conversationForm.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToCredentials = () => {
    console.log('Credentials button clicked'); // Debug log
    const element = document.getElementById('credentials-section');
    console.log('Found credentials element:', element); // Debug log
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;
      
      console.log('Scrolling to position:', offsetPosition); // Debug log
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
      console.error('Credentials section not found!');
    }
  };

  const scrollToTestimonials = () => {
    // Find the testimonials carousel
    const testimonialSection = document.querySelector('.bg-white.py-2');
    if (testimonialSection) {
      const headerHeight = 80;
      const elementPosition = testimonialSection.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <button 
            onClick={scrollToTop}
            className="flex items-center hover:opacity-80 transition-opacity duration-300"
          >
            <img 
              src="/logo-full-inverse.png" 
              alt="Two-Fifths Logo" 
              className="h-8"
            />
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 font-heading">
            <button
              onClick={() => scrollToSection('about-section')}
              className="text-white hover:text-red-500 transition-colors font-medium"
              style={{ '--hover-color': '#c4374f' } as React.CSSProperties}
              onMouseEnter={(e) => e.currentTarget.style.color = '#c4374f'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
            >
              Expertise
            </button>
            <button
              onClick={scrollToCredentials}
              className="text-white hover:text-red-500 transition-colors font-medium"
              style={{ '--hover-color': '#c4374f' } as React.CSSProperties}
              onMouseEnter={(e) => e.currentTarget.style.color = '#c4374f'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
            >
              Credentials
            </button>
            <button
              onClick={scrollToTestimonials}
              className="text-white hover:text-red-500 transition-colors font-medium"
              style={{ '--hover-color': '#c4374f' } as React.CSSProperties}
              onMouseEnter={(e) => e.currentTarget.style.color = '#c4374f'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
            >
              Testimonials
            </button>
            <button
              onClick={() => scrollToSection('audience-selector')}
              className="text-white hover:text-red-500 transition-colors font-medium"
              style={{ '--hover-color': '#c4374f' } as React.CSSProperties}
              onMouseEnter={(e) => e.currentTarget.style.color = '#c4374f'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
            >
              Services
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <a
              href="https://www.linkedin.com/in/jasondavidcormier/"
              target="_blank"
              rel="noopener noreferrer"
              className="group w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl text-white"
              style={{ backgroundColor: 'rgba(196, 55, 79, 0.9)' }}
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <button
              onClick={scrollToNextSteps}
              className="group w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl text-white"
              style={{ backgroundColor: 'rgba(196, 55, 79, 0.9)' }}
            >
              <Mail className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;