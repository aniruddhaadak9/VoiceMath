"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Mic, MicOff, Volume2, ChevronLeft, ChevronRight } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { toast } from "sonner";

interface SequenceQuestion {
  id: number;
  sequence: string;
  answer: number;
}

const generateRandomQuestions = (): SequenceQuestion[] => {
  const questions: SequenceQuestion[] = [];
  for (let i = 0; i < 10; i++) {
    const length = Math.floor(Math.random() * 3) + 4; // Random sequence length (4-6 numbers)
    const step = Math.floor(Math.random() * 5) + 1; // Random step (1-5)
    const start = Math.floor(Math.random() * 10) + 1; // Random start number (1-10)
    const missingIndex = Math.floor(Math.random() * length); // Random missing index

    const sequence = Array.from({ length }, (_, idx) =>
      idx === missingIndex ? "?" : start + idx * step
    );
    const answer = start + missingIndex * step;

    questions.push({
      id: i,
      sequence: sequence.join(", "),
      answer,
    });
  }
  return questions;
};

export default function LogicalReasoningQuiz() {
  const [questions] = useState(generateRandomQuestions);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [highScore, setHighScore] = useLocalStorage("logical-high-score", 0);
  const [isComplete, setIsComplete] = useState(false);
  const [userAnswer, setUserAnswer] = useState(""); // Stores the transcript of the user's answer
  const [waitingForAnswer, setWaitingForAnswer] = useState(true); // Tracks if the answer is being waited on

  const handleResult = (transcript: string) => {
    setUserAnswer(transcript); // Update the displayed answer
    const userAnswer = parseInt(transcript.replace(/\D/g, ""));
    const isCorrect = userAnswer === questions[currentQuestion].answer;

    if (isCorrect) {
      toast.success("Correct answer!", {
        style: { background: "#10B981", color: "white" },
      });
      setScore(score + 1);
    } else {
      toast.error(`Incorrect. The answer was ${questions[currentQuestion].answer}`, {
        style: { background: "#EF4444", color: "white" },
      });
      setWrongAnswers(wrongAnswers + 1);
    }

    // Wait 2 seconds before proceeding to the next question
    setWaitingForAnswer(false);
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setIsComplete(true);
        if (score > highScore) {
          setHighScore(score);
        }
      }
      setWaitingForAnswer(true); // Reset waiting status
    }, 2000); // 2-second delay
  };

  const { isListening, error, startListening, stopListening } = useSpeechRecognition({
    onResult: handleResult,
  });

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setWrongAnswers(0);
    setIsComplete(false);
    setUserAnswer("");
    setWaitingForAnswer(true); // Reset waiting status
  };

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error("Speech synthesis not supported in your browser.");
    }
  };

  const navigateQuestion = (direction: "prev" | "next") => {
    if (direction === "next" && currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (direction === "prev" && currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-indigo-100 to-purple-200 dark:bg-gradient-to-br dark:from-indigo-900 dark:to-purple-800 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto relative bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg"
      >
        {/* Scorecard Section */}
        <div className="mb-8 flex justify-between items-center">
          <motion.h1
            className="text-4xl font-bold mb-4 text-transparent bg-gradient-to-r from-primary to-purple-600 bg-clip-text dark:text-white"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Logical Reasoning Quiz
          </motion.h1>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-md shadow-lg text-sm text-white animate-pulse">
            <p>Correct: <span className="font-bold">{score}</span></p>
            <p>Wrong: <span className="font-bold">{wrongAnswers}</span></p>
          </div>
        </div>

        <Progress
          value={(currentQuestion / questions.length) * 100}
          className="mb-4 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-md"
        />
        <div className="flex justify-between text-sm text-muted-foreground dark:text-white">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span className="font-semibold text-primary dark:text-primary">Score: {score}</span>
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
              <Card className="p-8 relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200 ease-in-out dark:bg-gray-700 dark:text-white">
                <h2 className="text-2xl font-semibold mb-4 text-primary dark:text-white">
                  Guess the missing number in the sequence: 
                  <span className="font-bold text-purple-600 dark:text-purple-300"> {questions[currentQuestion].sequence}</span>
                </h2>
                <div className="flex gap-4 items-center">
                  <Button
                    onClick={() => speak(`Guess the missing number in the sequence: ${questions[currentQuestion].sequence}`)}
                    variant="outline"
                    size="icon"
                    className="bg-blue-500/10 hover:bg-blue-500/20 transition-colors rounded-full dark:bg-blue-500/10 dark:hover:bg-blue-500/20"
                  >
                    <Volume2 className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                  </Button>
                  <Button
                    onClick={isListening ? stopListening : startListening}
                    variant={isListening ? "destructive" : "default"}
                    className={`${
                      isListening 
                        ? "bg-red-500 hover:bg-red-600" 
                        : "bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
                    } transition-all duration-300 rounded-full`}
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
                  <div className="ml-4 text-lg bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-lg text-white mt-4 animate-pulse">
                    {userAnswer && !waitingForAnswer 
                      ? `Your Answer: ${userAnswer}` 
                      : "Waiting for your answer..."}
                  </div>
                </div>
              </Card>
              <div className="flex justify-end space-x-4 mt-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateQuestion("prev")}
                  disabled={currentQuestion === 0}
                  className="bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-full dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateQuestion("next")}
                  disabled={currentQuestion === questions.length - 1}
                  className="bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-full dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <Card className="p-6 bg-gradient-to-br from-background to-primary/5 shadow-xl dark:bg-gradient-to-br dark:from-background dark:to-primary/5">
                <motion.h2
                  className="text-3xl font-bold mb-4 text-primary dark:text-white"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Quiz Complete! 🎉
                </motion.h2>
                <p className="text-xl mb-2 text-black dark:text-white">Your Score: {score} / {questions.length}</p>
                <p className="text-muted-foreground mb-6 dark:text-gray-400">
                  High Score: {highScore}
                </p>
                <Button
                  onClick={resetQuiz}
                  className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 dark:bg-gradient-to-r dark:from-purple-500 dark:to-purple-700"
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
