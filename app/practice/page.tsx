"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mic, MicOff, Volume2, RefreshCw } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { toast } from 'sonner';

export default function PracticePage() {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [question, setQuestion] = useState(() => generateQuestion(difficulty));
  const [answer, setAnswer] = useState('');

  const handleResult = (transcript: string) => {
    const userAnswer = parseInt(transcript.replace(/\D/g, ''));
    checkAnswer(userAnswer);
  };

  const { isListening, error, startListening, stopListening } = useSpeechRecognition({
    onResult: handleResult,
  });

  function generateQuestion(diff: 'easy' | 'medium' | 'hard') {
    const ranges = {
      easy: { min: 1, max: 10 },
      medium: { min: 1, max: 50 },
      hard: { min: 1, max: 100 }
    };
    
    const range = ranges[diff];
    const num1 = Math.floor(Math.random() * (range.max - range.min)) + range.min;
    const num2 = Math.floor(Math.random() * (range.max - range.min)) + range.min;
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * (diff === 'easy' ? 1 : operations.length))];
    
    let result;
    switch (operation) {
      case '+': result = num1 + num2; break;
      case '-': result = num1 - num2; break;
      case '*': result = num1 * num2; break;
      default: result = num1 + num2;
    }
    
    return {
      text: `What is ${num1} ${operation} ${num2}?`,
      answer: result
    };
  }

  function checkAnswer(userAnswer: number) {
    if (userAnswer === question.answer) {
      toast.success('Correct! Well done!');
      setQuestion(generateQuestion(difficulty));
      setAnswer('');
    } else {
      toast.error('Try again!');
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    checkAnswer(Number(answer));
  }

  function speak(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Practice Mode</h1>
          <p className="text-muted-foreground">
            Practice your math skills at your own pace. Use voice or type your answers!
          </p>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex gap-2 mb-6">
            {(['easy', 'medium', 'hard'] as const).map((level) => (
              <Button
                key={level}
                variant={difficulty === level ? 'default' : 'outline'}
                onClick={() => {
                  setDifficulty(level);
                  setQuestion(generateQuestion(level));
                  setAnswer('');
                }}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Button>
            ))}
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">{question.text}</h2>
              <div className="flex gap-2">
                <Button
                  onClick={() => speak(question.text)}
                  variant="outline"
                  size="icon"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => {
                    setQuestion(generateQuestion(difficulty));
                    setAnswer('');
                  }}
                  variant="outline"
                  size="icon"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="answer">Your Answer</Label>
                <Input
                  id="answer"
                  type="number"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer..."
                  className="mt-1"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Submit Answer</Button>
                <Button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  variant={isListening ? "destructive" : "outline"}
                >
                  {isListening ? (
                    <>
                      <MicOff className="mr-2 h-4 w-4" /> Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-4 w-4" /> Answer with Voice
                    </>
                  )}
                </Button>
              </div>
            </form>

            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}
          </div>
        </Card>

        <div className="text-sm text-muted-foreground">
          <h3 className="font-semibold mb-2">Tips:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Use the microphone button to answer with your voice</li>
            <li>Click the speaker icon to hear the question</li>
            <li>Try different difficulty levels as you improve</li>
            <li>Use the refresh button to get a new question</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}