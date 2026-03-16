'use client';

import { useGameStore } from '@/store/gameStore';
import { X, ExternalLink, Github, Mail, Linkedin, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '@/types/game';

export function ProjectModal() {
  const { isModalOpen, modalType, currentProject, closeModal } = useGameStore();
  
  if (!isModalOpen || modalType !== 'project' || !currentProject) return null;
  
  const project = currentProject as Project;
  
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
          className="relative w-full max-w-2xl bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border-2 border-emerald-500/50 shadow-2xl shadow-emerald-500/20 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Pixel art corner decorations */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400" />
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-emerald-500/30">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
              <h2 className="text-2xl font-bold text-white font-mono">{project.title}</h2>
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
          <div className="p-6 space-y-6">
            {/* Description */}
            <p className="text-slate-300 leading-relaxed font-mono text-sm">
              {project.description}
            </p>
            
            {/* Tech Stack */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="px-3 py-1 text-xs font-mono bg-slate-700/50 border-emerald-500/30 text-emerald-300"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Links */}
            <div className="flex gap-3 pt-4 border-t border-slate-700">
              {project.githubUrl && (
                <Button
                  asChild
                  className="bg-slate-700 hover:bg-slate-600 text-white gap-2"
                >
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4" />
                    View Code
                  </a>
                </Button>
              )}
              {project.liveUrl && (
                <Button
                  asChild
                  className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2"
                >
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </a>
                </Button>
              )}
            </div>
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

export function AboutModal() {
  const { isModalOpen, modalType, currentNPC, closeModal, currentDialogue, dialogueIndex, advanceDialogue } = useGameStore();
  
  if (!isModalOpen || modalType !== 'about' || !currentNPC) return null;
  
  const dialogues = currentNPC.dialogues || [];
  const currentText = dialogues[dialogueIndex]?.text || '';
  const isLastDialogue = dialogueIndex >= dialogues.length - 1;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center p-4 pb-24 bg-black/40 backdrop-blur-sm"
        onClick={isLastDialogue ? closeModal : advanceDialogue}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="relative w-full max-w-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Dialogue box */}
          <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg border-2 border-amber-500/50 shadow-xl p-6">
            {/* 9-slice border simulation */}
            <div className="absolute inset-0 rounded-lg pointer-events-none">
              <div className="absolute top-0 left-4 right-4 h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 rounded-full" />
              <div className="absolute bottom-0 left-4 right-4 h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 rounded-full" />
            </div>
            
            {/* NPC Name */}
            <div className="absolute -top-3 left-6 px-3 py-1 bg-amber-600 rounded text-sm font-bold text-white font-mono">
              {currentNPC.name}
            </div>
            
            {/* Dialogue text */}
            <div className="pt-4 pb-2">
              <p className="text-white font-mono text-lg leading-relaxed">
                {currentText}
              </p>
            </div>
            
            {/* Continue indicator */}
            <div className="flex justify-end pt-2">
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-amber-400 text-sm font-mono"
              >
                {isLastDialogue ? '▼ Close' : '▼ Continue'}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function ContactModal() {
  const { isModalOpen, modalType, closeModal } = useGameStore();
  
  if (!isModalOpen || modalType !== 'contact') return null;
  
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
          className="relative w-full max-w-md bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border-2 border-blue-500/50 shadow-2xl shadow-blue-500/20 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-blue-500/30">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold text-white font-mono">Get In Touch</h2>
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
          <div className="p-6 space-y-4">
            <p className="text-slate-300 font-mono text-sm text-center">
              I&apos;m always open to new opportunities and collaborations. Feel free to reach out!
            </p>
            
            {/* Contact Links */}
            <div className="space-y-3">
              <Button
                asChild
                className="w-full bg-slate-700 hover:bg-slate-600 text-white gap-3 justify-start"
              >
                <a href="mailto:developer@example.com">
                  <Mail className="w-5 h-5 text-blue-400" />
                  developer@example.com
                </a>
              </Button>
              
              <Button
                asChild
                className="w-full bg-slate-700 hover:bg-slate-600 text-white gap-3 justify-start"
              >
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="w-5 h-5 text-purple-400" />
                  github.com/developer
                </a>
              </Button>
              
              <Button
                asChild
                className="w-full bg-slate-700 hover:bg-slate-600 text-white gap-3 justify-start"
              >
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-5 h-5 text-blue-500" />
                  linkedin.com/in/developer
                </a>
              </Button>
              
              <Button
                asChild
                className="w-full bg-slate-700 hover:bg-slate-600 text-white gap-3 justify-start"
              >
                <a href="https://portfolio.dev" target="_blank" rel="noopener noreferrer">
                  <Globe className="w-5 h-5 text-emerald-400" />
                  portfolio.dev
                </a>
              </Button>
            </div>
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
