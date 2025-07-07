import React, { useState } from 'react';
import { useContent } from './hooks/useContent';
import Header from './components/Header';
import Hero from './components/Hero';
import AudienceSelector from './components/AudienceSelector';
import ServicePackages from './components/ServicePackages';
import About from './components/About';
import Contact from './components/Contact';
import PlaybookDownload from './components/PlaybookDownload';
import NextSteps from './components/NextSteps';

export type Audience = 'australian' | 'international' | null;

function App() {
  // Initialize content system
  useContent();
  
  const [selectedAudience, setSelectedAudience] = useState<Audience>(null);
  const [showPlaybookModal, setShowPlaybookModal] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <About />
      <AudienceSelector 
        selectedAudience={selectedAudience}
        onAudienceSelect={setSelectedAudience}
      />
      {selectedAudience && (
        <ServicePackages 
          audience={selectedAudience}
          onPlaybookDownload={() => setShowPlaybookModal(true)}
        />
      )}
      <NextSteps />
      
      {showPlaybookModal && (
        <PlaybookDownload onClose={() => setShowPlaybookModal(false)} />
      )}
      <Contact />
    </div>
  );
}

export default App;