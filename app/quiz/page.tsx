"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { toast } from 'sonner';

interface Question {
  id: number;
  question: string;
  answer: number;
}

const generateQuestions = (): Question[] => {
  const questions: Question[] = [];
  for (let i = 0; i < 10; i++) {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    questions.push({
      id: i,
      question: `What is ${num1} plus ${num2}?`,
      answer: num1 + num2,
    });
  }
  return questions;
};

export default function QuizPage() {
  const [questions] = useState(generateQuestions);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useLocalStorage('quiz-high-score', 0);
  const [isComplete, setIsComplete] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleResult = (transcript: string) => {
    const userAnswer = parseInt(transcript.replace(/\D/g, ''));
    const isCorrect = userAnswer === questions[currentQuestion].answer;

    if (isCorrect) {
      toast.success('Correct answer!', {
        style: { background: '#10B981', color: 'white' }
      });
      setScore(score + 1);
    } else {
      toast.error(`Incorrect. The answer was ${questions[currentQuestion].answer}`, {
        style: { background: '#EF4444', color: 'white' }
      });
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsComplete(true);
      if (score > highScore) {
        setHighScore(score);
      }
    }
  };

  const { isListening, error, startListening, stopListening } = useSpeechRecognition({
    onResult: handleResult,
  });

  useEffect(() => {
    if (currentQuestion > 0) {
      stopListening();  // Ensure stop before moving to the next question
    }
  }, [currentQuestion, stopListening]);

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setIsComplete(false);
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error("Speech synthesis not supported in your browser.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto relative"
      >
        <div className="mb-8">
          <motion.h1 
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Math Quiz
          </motion.h1>
          <Progress 
            value={(currentQuestion / questions.length) * 100} 
            className="mb-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500" 
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span className="font-semibold text-primary">Score: {score}</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isComplete ? (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card className="p-6 relative overflow-hidden">
                {isAnimating && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10"
                    animate={{
                      opacity: [0.5, 1, 0.5],
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  />
                )}
                <h2 className="text-2xl font-semibold mb-4 text-primary">
                  {questions[currentQuestion].question}
                </h2>
                <div className="flex gap-4">
                  <Button
                    onClick={() => speak(questions[currentQuestion].question)}
                    variant="outline"
                    size="icon"
                    className="bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
                  >
                    <Volume2 className="h-4 w-4 text-blue-500" />
                  </Button>
                  <Button
                    onClick={isListening ? stopListening : startListening}
                    variant={isListening ? "destructive" : "default"}
                    className={`${
                      isListening 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-gradient-to-r from-primary to-purple-600 hover:opacity-90'
                    } transition-all duration-300`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="mr-2 h-4 w-4 animate-pulse" /> Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="mr-2 h-4 w-4" /> Start Recording
                      </>
                    )}
                  </Button>
                </div>
                {error && (
                  <p className="text-destructive mt-2 text-sm">{error}</p>
                )}
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <Card className="p-6 bg-gradient-to-br from-background to-primary/5">
                <motion.h2 
                  className="text-3xl font-bold mb-4 text-primary"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Quiz Complete! 🎉
                </motion.h2>
                <p className="text-xl mb-2">Your Score: {score} / {questions.length}</p>
                <p className="text-muted-foreground mb-6">
                  High Score: {highScore}
                </p>
                <Button 
                  onClick={resetQuiz}
                  className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
                >
                  Try Again
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
