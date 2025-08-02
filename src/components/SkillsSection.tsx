import React, { useState } from 'react';
import { TechnicalSkills, OnePieceQuotes, getSkillDescription } from '../constants';
import * as Icons from 'react-icons/si';

const SkillsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('languages');
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Function to get the icon component
  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Icons.SiReact; // Fallback icon
  };

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title">
          {OnePieceQuotes.skills} 🍎
        </h2>
        
        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.entries(TechnicalSkills).map(([category, skills]) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-pirate font-bold transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category
                  ? 'bg-treasure-gradient text-one-piece-deep-blue shadow-lg'
                  : 'bg-one-piece-deep-blue/50 text-one-piece-gold border border-one-piece-gold/30 hover:bg-one-piece-gold/10'
              }`}
            >
              {category === 'languages' && '⚔️'}
              {category === 'frameworks' && '🛡️'}
              {category === 'databases' && '📦'}
              {category === 'tools' && '🔧'}
              {category === 'cloud' && '☁️'}
              <span className="ml-2 capitalize">{category}</span>
            </button>
          ))}
        </div>

        {/* Devil Fruit Powers Showcase */}
        <div className="pirate-card p-8 bg-gradient-to-br from-one-piece-straw-hat/20 to-one-piece-ship-brown/20 relative overflow-hidden">
          <div className="relative z-10 mb-8">
            <h3 className="text-3xl font-pirate font-bold text-one-piece-gold mb-4 text-center">
              Devil Fruit Powers 🍎⚡
            </h3>
            <p className="text-center text-one-piece-treasure mb-6">
              Each technology mastery grants unique abilities in the digital world
            </p>
          </div>

          {/* Skills Grid Layout */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {TechnicalSkills[selectedCategory as keyof typeof TechnicalSkills]?.map((skill, index) => {
              // Determine devil fruit type based on skill level
              const getPowerLevel = (level: number) => {
                if (level >= 95) return { rank: 'Mythical Zoan', powerType: '🐉', color: '#FF6B35', glow: 'shadow-red-500/50' };
                if (level >= 90) return { rank: 'Ancient Zoan', powerType: '🦖', color: '#FFD700', glow: 'shadow-yellow-500/50' };
                if (level >= 85) return { rank: 'Logia', powerType: '⚡', color: '#00BFFF', glow: 'shadow-blue-500/50' };
                if (level >= 80) return { rank: 'Special Paramecia', powerType: '💎', color: '#8A2BE2', glow: 'shadow-purple-500/50' };
                if (level >= 75) return { rank: 'Paramecia', powerType: '🌟', color: '#32CD32', glow: 'shadow-green-500/50' };
                return { rank: 'Basic Zoan', powerType: '🐺', color: '#CD853F', glow: 'shadow-orange-500/50' };
              };

              const power = getPowerLevel(skill.level);
              const IconComponent = getIconComponent(skill.icon);

              return (
                <div
                  key={index}
                  className={`relative group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${power.glow} hover:shadow-2xl`}
                  onMouseEnter={() => setHoveredSkill(skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  {/* Devil Fruit Card */}
                  <div className="bg-gradient-to-br from-one-piece-deep-blue/80 to-one-piece-ocean/60 rounded-xl p-6 border-2 border-one-piece-gold/30 h-full relative overflow-hidden">
                    
                    {/* Power Aura Effect */}
                    <div 
                      className="absolute inset-0 opacity-20 rounded-xl animate-pulse"
                      style={{ 
                        background: `radial-gradient(circle at center, ${power.color}40 0%, transparent 70%)` 
                      }}
                    ></div>
                    
                    {/* Technology Icon */}
                    <div className="relative z-10 text-center mb-4">
                      <div className="flex justify-center items-center mb-2">
                        <div className="relative">
                          {/* Technology Icon - Always visible */}
                          <IconComponent 
                            className="text-5xl animate-bounce transition-all duration-300 group-hover:scale-90 group-hover:opacity-70" 
                            style={{ 
                              color: power.color,
                              animationDuration: '2s',
                              filter: `drop-shadow(0 0 10px ${power.color}40)`
                            }}
                          />
                          {/* Power Type Badge - Only visible on hover */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-125">
                            <span className="text-4xl animate-pulse">{power.powerType}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-one-piece-treasure font-bold mb-2">
                        {power.rank}
                      </div>
                    </div>
                    
                    {/* Skill Name */}
                    <div className="relative z-10 text-center mb-4">
                      <h4 className="font-bold text-one-piece-gold text-lg mb-1">
                        {skill.name}
                      </h4>
                      <p className="text-xs text-one-piece-treasure">
                        {getSkillDescription(skill.level)}
                      </p>
                    </div>
                    
                    {/* Power Level Indicator */}
                    <div className="relative z-10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-300">Power Level</span>
                        <span className="text-sm font-bold text-one-piece-gold">{skill.level}%</span>
                      </div>
                      <div className="w-full h-3 bg-one-piece-deep-blue rounded-full overflow-hidden relative">
                        <div 
                          className="h-full transition-all duration-1000 rounded-full relative"
                          style={{ 
                            width: `${skill.level}%`,
                            background: `linear-gradient(90deg, ${power.color}80, ${power.color})`
                          }}
                        >
                          {/* Power sparkles */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                        </div>
                      </div>
                    </div>

                    {/* Hover Details */}
                    {hoveredSkill === skill.name && (
                      <div className="absolute inset-0 bg-one-piece-deep-blue/95 rounded-xl p-4 flex flex-col justify-center items-center text-center z-20 animate-fade-in">
                        <div className="flex items-center justify-center mb-3">
                          <IconComponent 
                            className="text-3xl mr-3" 
                            style={{ color: power.color }}
                          />
                          <span className="text-3xl animate-pulse">{power.powerType}</span>
                        </div>
                        <h4 className="font-bold text-one-piece-gold text-lg mb-2">{skill.name}</h4>
                        <p className="text-sm text-one-piece-treasure mb-3">{power.rank}</p>
                        <div className="w-full max-w-xs">
                          <div className="text-xs text-gray-300 mb-1">Mastery Level</div>
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-20 h-2 bg-one-piece-deep-blue rounded-full overflow-hidden">
                              <div 
                                className="h-full transition-all duration-1000"
                                style={{ 
                                  width: `${skill.level}%`,
                                  background: `linear-gradient(90deg, ${power.color}, ${power.color}80)`
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-bold text-one-piece-gold">{skill.level}%</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Floating Power Particles */}
                    <div className="absolute top-2 right-2 text-xs opacity-60 animate-float">✨</div>
                    <div className="absolute bottom-2 left-2 text-xs opacity-60 animate-float" style={{ animationDelay: '1s' }}>⭐</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Category Power Summary */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <div className="bg-one-piece-deep-blue/30 rounded-lg p-4 border border-one-piece-gold/30 text-center">
              <div className="text-2xl mb-2">🏴‍☠️</div>
              <h5 className="font-bold text-one-piece-gold text-sm mb-1">Total Powers</h5>
              <span className="text-one-piece-treasure text-lg font-bold">
                {TechnicalSkills[selectedCategory as keyof typeof TechnicalSkills]?.length || 0}
              </span>
            </div>
            <div className="bg-one-piece-deep-blue/30 rounded-lg p-4 border border-one-piece-gold/30 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <h5 className="font-bold text-one-piece-gold text-sm mb-1">Average Power</h5>
              <span className="text-one-piece-treasure text-lg font-bold">
                {Math.round(
                  (TechnicalSkills[selectedCategory as keyof typeof TechnicalSkills]?.reduce((sum, skill) => sum + skill.level, 0) || 0) /
                  (TechnicalSkills[selectedCategory as keyof typeof TechnicalSkills]?.length || 1)
                )}%
              </span>
            </div>
            <div className="bg-one-piece-deep-blue/30 rounded-lg p-4 border border-one-piece-gold/30 text-center">
              <div className="text-2xl mb-2">🐉</div>
              <h5 className="font-bold text-one-piece-gold text-sm mb-1">Legendary Powers</h5>
              <span className="text-one-piece-treasure text-lg font-bold">
                {TechnicalSkills[selectedCategory as keyof typeof TechnicalSkills]?.filter(skill => skill.level >= 90).length || 0}
              </span>
            </div>
          </div>

          {/* Power Level Guide */}
          <div className="mt-8 bg-one-piece-deep-blue/20 rounded-xl p-6 border border-one-piece-gold/30">
            <h4 className="text-xl font-pirate font-bold text-one-piece-gold mb-6 text-center">
              🍎 Devil Fruit Power Classification Guide
            </h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Mythical Zoan */}
              <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg p-4 border border-red-500/30">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">🐉</span>
                  <div>
                    <h5 className="font-bold text-red-400">Mythical Zoan</h5>
                    <p className="text-xs text-gray-300">95-100%</p>
                  </div>
                </div>
                <p className="text-sm text-gray-300">
                  Legendary mastery level. Complete expertise with ability to teach and architect complex systems.
                </p>
              </div>

              {/* Ancient Zoan */}
              <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-lg p-4 border border-yellow-500/30">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">🦖</span>
                  <div>
                    <h5 className="font-bold text-yellow-400">Ancient Zoan</h5>
                    <p className="text-xs text-gray-300">90-94%</p>
                  </div>
                </div>
                <p className="text-sm text-gray-300">
                  Expert level with deep understanding. Can lead projects and mentor others effectively.
                </p>
              </div>

              {/* Logia */}
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg p-4 border border-blue-500/30">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <h5 className="font-bold text-blue-400">Logia</h5>
                    <p className="text-xs text-gray-300">85-89%</p>
                  </div>
                </div>
                <p className="text-sm text-gray-300">
                  Advanced proficiency. Can handle complex implementations and troubleshoot difficult issues.
                </p>
              </div>

              {/* Special Paramecia */}
              <div className="bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-lg p-4 border border-purple-500/30">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">💎</span>
                  <div>
                    <h5 className="font-bold text-purple-400">Special Paramecia</h5>
                    <p className="text-xs text-gray-300">80-84%</p>
                  </div>
                </div>
                <p className="text-sm text-gray-300">
                  Proficient level. Strong understanding with ability to work independently on most tasks.
                </p>
              </div>

              {/* Paramecia */}
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-4 border border-green-500/30">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">🌟</span>
                  <div>
                    <h5 className="font-bold text-green-400">Paramecia</h5>
                    <p className="text-xs text-gray-300">75-79%</p>
                  </div>
                </div>
                <p className="text-sm text-gray-300">
                  Good working knowledge. Can implement features and solutions with some guidance.
                </p>
              </div>

              {/* Basic Zoan */}
              <div className="bg-gradient-to-r from-orange-500/20 to-amber-700/20 rounded-lg p-4 border border-orange-500/30">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">🐺</span>
                  <div>
                    <h5 className="font-bold text-orange-400">Basic Zoan</h5>
                    <p className="text-xs text-gray-300">65-74%</p>
                  </div>
                </div>
                <p className="text-sm text-gray-300">
                  Foundational understanding. Can work on basic implementations and learning actively.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Special Abilities */}
        <div className="mt-16 text-center">
          <div className="pirate-card p-8 bg-gradient-to-r from-one-piece-sunset/20 to-one-piece-treasure/20">
            <h3 className="text-2xl font-pirate font-bold text-one-piece-gold mb-4">
              Special Captain Abilities 🌟
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center group">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🏴‍☠️</div>
                <h4 className="font-bold text-one-piece-treasure">Leadership</h4>
                <p className="text-sm text-gray-300">Team guidance & mentoring</p>
              </div>
              <div className="text-center group">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🗺️</div>
                <h4 className="font-bold text-one-piece-treasure">Problem Solving</h4>
                <p className="text-sm text-gray-300">Creative solutions & debugging</p>
              </div>
              <div className="text-center group">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">⚓</div>
                <h4 className="font-bold text-one-piece-treasure">Architecture</h4>
                <p className="text-sm text-gray-300">System design & scalability</p>
              </div>
              <div className="text-center group">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">💎</div>
                <h4 className="font-bold text-one-piece-treasure">Optimization</h4>
                <p className="text-sm text-gray-300">Performance & efficiency</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
