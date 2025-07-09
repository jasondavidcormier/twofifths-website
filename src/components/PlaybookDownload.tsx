import React, { useState } from 'react';
import { X, Download, CheckCircle, Mail } from 'lucide-react';

interface PlaybookDownloadProps {
  onClose: () => void;
}

const PlaybookDownload: React.FC<PlaybookDownloadProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    email: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Google Apps Script Web App URL - replace with your actual URL
      const scriptURL = 'https://script.google.com/a/macros/twofifthsfractional.com/s/AKfycbwoa42toWvuJ3XOr02CUO0NjZpkKzJ-1qWuFreoQxc3WUun7ec2oD4P146vRn2JY8fZSQ/exec';
      
      const response = await fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email: formData.email,
          timestamp: new Date().toISOString(),
          source: 'playbook-waitlist'
        })
      });
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting to Google Sheets:', error);
      // Still show success to user since no-cors mode doesn't allow error detection
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSuccessClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
               style={{ backgroundColor: '#c4374f' }}>
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Join the Playbook Waitlist
          </h3>
          <p className="text-gray-600">
            Enter your email below. Be the very first to know when my comprehensive ANZ Expansion Guide, your playbook for market entry, is ready.
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>

              <label htmlFor="modal-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="modal-email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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



            <button
              type="submit"
              disabled={isLoading || !formData.email}
              className={`w-full text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 ${
                isLoading || !formData.email ? 'opacity-50 cursor-not-allowed' : ''
              }`}
             style={{ backgroundColor: '#c4374f' }}
            >
              <Mail className="w-5 h-5" />
              <span>{isLoading ? 'Adding to waitlist...' : 'Join Waitlist'}</span>
            </button>
          </form>
        ) : (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h4 className="font-heading text-xl font-bold text-gray-900 mb-2">You're on the list!</h4>
            <p className="text-gray-600">
              Excellent! We'll notify you via email the moment the ANZ Expansion Playbook is ready for download. Thanks for your interest!
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
  );
};

export default PlaybookDownload;