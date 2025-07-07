import React from 'react';
import { Mail, Linkedin } from 'lucide-react';

const Header: React.FC = () => {
  const scrollToNextSteps = () => {
    const conversationForm = document.querySelector('[data-section="conversation-form"]');
    if (conversationForm) {
      conversationForm.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-end space-x-3">
          <a
            href="https://www.linkedin.com/in/jasondavidcormier/"
            target="_blank"
            rel="noopener noreferrer"
            className="group w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl text-white"
            style={{ backgroundColor: 'rgba(196, 55, 79, 0.9)' }}
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <button
            onClick={scrollToNextSteps}
            className="group w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl text-white"
            style={{ backgroundColor: 'rgba(196, 55, 79, 0.9)' }}
          >
            <Mail className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;