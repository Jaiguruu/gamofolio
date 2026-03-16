'use client';

import { useGameStore } from '@/store/gameStore';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  description: string;
  yearsOfExp?: number;
}

const categoryColors: Record<string, string> = {
  Frontend: 'from-blue-500 to-cyan-400',
  Backend: 'from-green-500 to-emerald-400',
  Framework: 'from-purple-500 to-pink-400',
  Language: 'from-yellow-500 to-orange-400',
  Database: 'from-red-500 to-rose-400',
  Tools: 'from-slate-500 to-zinc-400',
};

export function SkillsModal() {
  const { isModalOpen, modalType, closeModal } = useGameStore();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (isModalOpen && modalType === 'skill') {
      fetch('/api/skills')
        .then(res => res.json())
        .then(data => {
          setSkills(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isModalOpen, modalType]);
  
  if (!isModalOpen || modalType !== 'skill') return null;
  
  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={closeModal}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl max-h-[80vh] overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border-2 border-purple-500/50 shadow-2xl shadow-purple-500/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-purple-500/30">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
              <h2 className="text-2xl font-bold text-white font-mono">Skills & Expertise</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeModal}
              className="text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="text-4xl"
                >
                  ⚡
                </motion.div>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                  <div key={category} className="space-y-3">
                    <h3 className={`text-lg font-bold font-mono bg-gradient-to-r ${categoryColors[category] || 'from-gray-500 to-gray-400'} text-transparent bg-clip-text`}>
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {categorySkills.map((skill) => (
                        <motion.div
                          key={skill.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-4 bg-slate-700/50 rounded-lg border border-slate-600/50"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-white font-mono">{skill.name}</span>
                            <Badge variant="outline" className="text-xs">
                              Level {skill.level}/5
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-400 mb-2">{skill.description}</p>
                          {/* Skill level bar */}
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <div
                                key={level}
                                className={`h-2 flex-1 rounded-full ${
                                  level <= skill.level
                                    ? `bg-gradient-to-r ${categoryColors[category] || 'from-gray-500 to-gray-400'}`
                                    : 'bg-slate-600'
                                }`}
                              />
                            ))}
                          </div>
                          {skill.yearsOfExp && (
                            <p className="text-xs text-slate-500 mt-2">
                              {skill.yearsOfExp}+ years experience
                            </p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer hint */}
          <div className="px-6 py-3 bg-slate-800/50 border-t border-slate-700 text-center">
            <span className="text-xs text-slate-500 font-mono">
              Press ESC or click outside to close
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
