import React from 'react';
import './index.css';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ExperienceSection from './components/ExperienceSection';
import SkillsSection from './components/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';
import Navigation from './components/Navigation';
import FloatingElements from './components/FloatingElements';
import CharacterAnimations from './components/CharacterAnimations';
import { useActiveSection } from './hooks/useActiveSection';

function App() {
  const activeSection = useActiveSection();

  return (
    <div className="relative min-h-screen bg-ocean-gradient overflow-x-hidden">
      {/* Floating background elements */}
      <FloatingElements />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Character Animations */}
      <CharacterAnimations currentSection={activeSection} />
      
      {/* Main content */}
      <main>
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      
      {/* Footer */}
      <footer className="bg-one-piece-deep-blue text-one-piece-gold text-center py-8 border-t border-one-piece-gold/20">
        <p className="text-lg font-pirate">
          "The One Piece is real!" - Balaji Premkumar, Code Pirate 🏴‍☠️
        </p>
        <p className="text-sm mt-2 opacity-80">
          © 2025 Balaji Premkumar. All treasures reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;