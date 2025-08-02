import React from 'react';
import { PersonalInfo, SocialLinks, OnePieceQuotes } from '../constants';

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="section-title">
          {OnePieceQuotes.contact} 📮
        </h2>
        
        <div className="pirate-card p-8 mb-8">
          <h3 className="text-2xl font-pirate font-bold text-one-piece-gold mb-6">
            Ready to Set Sail Together?
          </h3>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Whether you're looking for a skilled crew member for your next adventure or want to discuss exciting opportunities, 
            I'm always ready to embark on new journeys in the world of technology!
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-one-piece-treasure mb-4">Contact Information</h4>
              
              <div className="space-y-4">
                <a 
                  href={SocialLinks.email}
                  className="flex items-center justify-center space-x-3 p-4 border border-one-piece-gold/30 rounded-lg hover:border-one-piece-gold transition-colors group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">📧</span>
                  <span className="text-one-piece-gold group-hover:text-one-piece-treasure">{PersonalInfo.email}</span>
                </a>
                
                <a 
                  href={SocialLinks.phone}
                  className="flex items-center justify-center space-x-3 p-4 border border-one-piece-gold/30 rounded-lg hover:border-one-piece-gold transition-colors group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">📱</span>
                  <span className="text-one-piece-gold group-hover:text-one-piece-treasure">{PersonalInfo.phone}</span>
                </a>
                
                <div className="flex items-center justify-center space-x-3 p-4 border border-one-piece-gold/30 rounded-lg">
                  <span className="text-2xl">📍</span>
                  <span className="text-one-piece-gold">{PersonalInfo.location}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-one-piece-treasure mb-4">Social Links</h4>
              
              <div className="space-y-4">
                <a 
                  href={SocialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-3 p-4 border border-one-piece-gold/30 rounded-lg hover:border-one-piece-gold transition-colors group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">🐙</span>
                  <span className="text-one-piece-gold group-hover:text-one-piece-treasure">GitHub Profile</span>
                </a>
                
                <a 
                  href={SocialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-3 p-4 border border-one-piece-gold/30 rounded-lg hover:border-one-piece-gold transition-colors group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">💼</span>
                  <span className="text-one-piece-gold group-hover:text-one-piece-treasure">LinkedIn Profile</span>
                </a>
                
                <div className="p-4 border border-one-piece-treasure/30 rounded-lg bg-one-piece-treasure/10">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-xl">⚡</span>
                    <span className="text-one-piece-treasure font-bold">Quick Response</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    I typically respond within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pirate-card p-6 bg-gradient-to-r from-one-piece-sunset/20 to-one-piece-treasure/20">
          <div className="flex items-center justify-center space-x-4 text-4xl mb-4">
            <span className="animate-wave">🏴‍☠️</span>
            <span className="animate-float">⚓</span>
            <span className="animate-wave">💎</span>
          </div>
          <p className="text-lg font-pirate text-one-piece-gold">
            "The seas are vast, and there are many islands yet to be explored!"
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Let's create something amazing together! 🚀
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
