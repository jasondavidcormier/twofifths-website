import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Calendar, MessageCircle, FileText, PieChart, Settings, Target, TrendingUp } from 'lucide-react';
import { useContent } from '../hooks/useContent';

const NextSteps: React.FC = () => {
  const content = useContent();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    challenge: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Google Apps Script Web App URL - your actual URL
      const scriptURL = 'https://script.google.com/macros/s/AKfycbyUtDMgz_tPNpX68MHWNvVokB-pnrNiBkFav2y6gS85lAHDcCV1yDTgy41PIXLpXt0CZA/exec';
      
      const response = await fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          ...formData,
          timestamp: new Date().toISOString(),
          source: 'next-steps-form'
        }),
      });
      
      // Scroll to form after successful submission
      const conversationForm = document.querySelector('[data-section="conversation-form"]') as HTMLElement;
      if (conversationForm) {
        const headerHeight = 80;
        const elementPosition = conversationForm.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting to Google Sheets:', error);
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSuccessClose = () => {
    setIsSubmitted(false);
    setFormData({
      name: '',
      email: '',
      company: '',
      challenge: ''
    });
  };

  const steps = [
    {
      icon: MessageCircle,
      title: "30 Minute Discovery Call",
      description: "Let's openly discuss your current challenges and ambitions. We'll identify key opportunities and a potential path forward."
    },
    {
      icon: Target,
      title: "Async Teardown",
      description: "Share your existing partner program (or even just an idea). I'll provide a concise video analysis with actionable, no-fluff feedback."
    },
    {
      icon: Calendar,
      title: "Market Fit Assessment",
      description: "Tell me your aspirations to grow in ANZ. I'll share some critical strategic advantages you have, and potential blind spots you're overlooking."
    },
    {
      icon: TrendingUp,
      title: "Custom Proposal",
      description: "Your business is unique. Let's collaborate to design a bespoke partnership solution that precisely fits your strategic objectives and desired outcomes."
    }
  ];

  return (
    <section data-section="next-steps" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold text-gray-900 mb-6">
            {content.nextSteps.heading}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {content.nextSteps.description}
          </p>
        </div>

        {/* Next Step Options */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="text-center group">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                 style={{ backgroundColor: '#c4374f' }}>
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">
              30 Minute Discovery Call
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Let's openly discuss your current challenges and ambitions. I'll identify key opportunities and a potential path forward.
            </p>
          </div>
          
          <div className="text-center group">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                 style={{ backgroundColor: '#c4374f' }}>
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">
              Async Jam Session
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Share your existing partner program (or even just an idea). I'll provide analysis with actionable, no-fluff feedback.
            </p>
          </div>
          
          <div className="text-center group">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                 style={{ backgroundColor: '#c4374f' }}>
              <PieChart className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">
              Market Fit Assessment
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Tell me your aspirations to grow in ANZ. I'll share some critical strategic advantages you have, and potential blind spots you're overlooking.
            </p>
          </div>
          
          <div className="text-center group">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                 style={{ backgroundColor: '#c4374f' }}>
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">
              Custom Proposal
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your business is unique. Let's collaborate to design a bespoke partnership solution that precisely fits your strategic objectives and desired outcomes.
            </p>
          </div>
        </div>

        {/* CTA Form */}
        <div data-section="conversation-form" className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h3 className="font-heading text-3xl font-bold text-gray-900 mb-6">
                {content.nextSteps.formHeading}
              </h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {content.nextSteps.formDescription}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm sm:text-base">Free 30-minute strategic consultation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm sm:text-base">Personalised partnership strategy recommendations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm sm:text-base">Pure value, zero obligation</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 rounded-xl p-6">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="next-name" className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="next-name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                        style={{ 
                          '--tw-ring-color': '#c4374f'
                        } as React.CSSProperties}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'transparent';
                          e.target.style.boxShadow = '0 0 0 2px #c4374f';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#d1d5db';
                          e.target.style.boxShadow = 'none';
                        }}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="next-email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="next-email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                        style={{ 
                          '--tw-ring-color': '#c4374f'
                        } as React.CSSProperties}
                        onFocus={(e) => {
                          e.target.style.borderColor = 'transparent';
                          e.target.style.boxShadow = '0 0 0 2px #c4374f';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#d1d5db';
                          e.target.style.boxShadow = 'none';
                        }}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="next-company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company *
                    </label>
                    <input
                      type="text"
                      id="next-company"
                      name="company"
                      required
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors"
                      style={{ 
                        '--tw-ring-color': '#c4374f'
                      } as React.CSSProperties}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'transparent';
                        e.target.style.boxShadow = '0 0 0 2px #c4374f';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.boxShadow = 'none';
                      }}
                      placeholder="Your company name"
                    />
                  </div>

                  <div>
                    <label htmlFor="next-challenge" className="block text-sm font-medium text-gray-700 mb-2">
                      What's your biggest partnership challenge? *
                    </label>
                    <textarea
                      id="next-challenge"
                      name="challenge"
                      required
                      rows={4}
                      value={formData.challenge}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors resize-none"
                      style={{ 
                        '--tw-ring-color': '#c4374f'
                      } as React.CSSProperties}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'transparent';
                        e.target.style.boxShadow = '0 0 0 2px #c4374f';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.boxShadow = 'none';
                      }}
                      placeholder="Tell me about your current partnership situation and what you'd like to achieve..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex items-center justify-center space-x-2 px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 text-white ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    style={{ backgroundColor: '#c4374f' }}
                  >
                    <span className="hidden sm:inline">{isLoading ? 'Sending...' : 'Accelerate My Partnership Journey'}</span>
                    <span className="sm:hidden">{isLoading ? 'Sending...' : 'Send Email'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h4 className="font-heading text-2xl font-bold text-gray-900 mb-4">Your Path to Growth Just Got Clearer.</h4>
                  <p className="text-lg text-gray-600 mb-6">
                    Thanks for reaching out! I've received your message and am already reviewing your details. Expect personalised insights for your partnership strategy within 24 hours.
                  </p>
                  <p className="text-sm text-gray-500">
                    In the meantime, <a href="https://www.linkedin.com/in/jasondavidcormier/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">connect with me on LinkedIn</a> or give me a call if something urgent comes up.
                  </p>
                  <button
                    onClick={handleSuccessClose}
                    className="mt-6 px-6 py-2 rounded-lg font-medium transition-colors duration-300 text-white"
                    style={{ backgroundColor: '#c4374f' }}
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NextSteps;