import React from 'react';
import { Mail, Phone, Linkedin, MapPin } from 'lucide-react';
import { useContent } from '../hooks/useContent';

const Contact: React.FC = () => {
  const content = useContent();

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-4 mb-6">
              <img 
                src="/logo-full-inverse.png" 
                alt="Two Fifths Logo" 
                className="h-8"
              />
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Two Fifths Fractional: Strategic Partnership Leadership for SaaS. I deliver senior-level expertise, on demand, enabling you to scale through high-impact partnerships without the full-time commitment.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-6">Get in Touch</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">{content.contact.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">{content.contact.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">{content.contact.location}</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-6">Services</h4>
            <ul className="space-y-3 text-gray-300">
              <li>Fractional Partnership Leadership</li>
              <li>Partnership Strategy & Execution</li>
              <li>ANZ Market Entry & Expansion</li>
              <li>Partnership Program Audits & Optimisation</li>
              <li>Strategic Advisory & Coaching</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Two Fifths Fractional. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Contact;