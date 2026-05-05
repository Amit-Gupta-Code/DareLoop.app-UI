import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Rocket, Zap, Users, ChevronRight, ChevronLeft } from "lucide-react";

/**
 * TutorialOverlay Component
 * A dismissible, multi-step tutorial explaining Loopify's recursive growth concept.
 */

const TUTORIAL_STEPS = [
  {
    title: "The Growth Loop",
    description: "Loopify isn't just a sharing tool. It's a recursive engine where every new joiner becomes a node that spawns its own growth tree.",
    icon: Zap,
    color: "text-yellow-400"
  },
  {
    title: "Recursive Nodes",
    description: "When someone joins your loop, they don't just 'follow'. They create a new branch, connecting their network to yours automatically.",
    icon: Users,
    color: "text-accent"
  },
  {
    title: "Viral Momentum",
    description: "Track your 'Reach Velocity' in real-time. Watch as your single share turns into thousands of connections through geometric progression.",
    icon: Rocket,
    color: "text-blue-400"
  }
];

const TutorialOverlay: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Show tutorial only if it hasn't been dismissed before
    const hasSeenTutorial = localStorage.getItem("loopify_tutorial_seen");
    if (!hasSeenTutorial) {
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem("loopify_tutorial_seen", "true");
  };

  const nextStep = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleDismiss();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const ActiveIcon = TUTORIAL_STEPS[currentStep].icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="card-main max-w-md w-full p-8 bg-card-bg border-border-sleek shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16" />
            
            <button 
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-main hover:bg-surface rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6 relative z-10">
              <div className="flex justify-center">
                <motion.div 
                  key={currentStep}
                  initial={{ rotate: -10, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  className={`p-4 rounded-2xl bg-surface border border-border-sleek ${TUTORIAL_STEPS[currentStep].color}`}
                >
                  <ActiveIcon className="w-10 h-10" />
                </motion.div>
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black text-text-main tracking-tight uppercase italic italic">
                  {TUTORIAL_STEPS[currentStep].title}
                </h3>
                <p className="text-text-muted font-medium leading-relaxed">
                  {TUTORIAL_STEPS[currentStep].description}
                </p>
              </div>

              {/* Progress Dots */}
              <div className="flex justify-center gap-2">
                {TUTORIAL_STEPS.map((_, i) => (
                  <div 
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentStep ? "w-8 bg-accent" : "w-1.5 bg-border-sleek"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border-sleek">
                <button 
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`flex items-center gap-1 text-xs font-black uppercase tracking-widest ${
                    currentStep === 0 ? "text-text-muted opacity-30" : "text-text-main hover:text-accent"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                
                <button 
                  onClick={nextStep}
                  className="btn-viral px-8 py-3 text-sm flex items-center gap-2"
                >
                  {currentStep === TUTORIAL_STEPS.length - 1 ? "Start Looping" : "Next Step"}
                  {currentStep !== TUTORIAL_STEPS.length - 1 && <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TutorialOverlay;
