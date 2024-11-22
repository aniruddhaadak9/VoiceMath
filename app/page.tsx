"use client";

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Mic, Brain, Languages, Share2 } from 'lucide-react';
import Link from 'next/link';
import { FeatureCard } from '@/components/feature-card';

export default function Home() {
  const features = [
    {
      icon: <Mic className="w-8 h-8" />,
      title: "Voice Recognition",
      description: "Answer math questions using your voice"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Smart Learning",
      description: "Adaptive questions based on your performance"
    },
    {
      icon: <Languages className="w-8 h-8" />,
      title: "Multi-language",
      description: "Learn in your preferred language"
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: "Social Features",
      description: "Share progress and interact with others"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            VoiceMath
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12">
            Learn mathematics through interactive voice-based exercises
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/quiz">
              <Button size="lg" className="w-full md:w-auto">
                Start Quiz
              </Button>
            </Link>
            <Link href="/practice">
              <Button size="lg" variant="outline" className="w-full md:w-auto">
                Practice Mode
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}