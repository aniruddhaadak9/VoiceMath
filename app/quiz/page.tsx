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
import LogicalReasoningQuiz from "./LogicalReasoningQuiz"; // Import Logical Reasoning Quiz

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
      question: `What is ${num1} + ${num2} ?`,
      answer: num1 + num2,
    });
  }
  return questions;
};

export default function Page() {
  const [questions] = useState(generateQuestions);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [highScore, setHighScore] = useLocalStorage("quiz-high-score", 0);
  const [isComplete, setIsComplete] = useState(false);
  const [userAnswer, setUserAnswer] = useState(""); // Store the user's answer
  const [waitingForAnswer, setWaitingForAnswer] = useState(true); // Track if waiting for answer
  const [activeQuiz, setActiveQuiz] = useState<"math" | "logical">("math"); // Manage active quiz type
  const [answerStatus, setAnswerStatus] = useState<"correct" | "wrong" | null>(null); // Track the answer status

  const handleResult = (transcript: string) => {
    setUserAnswer(transcript); // Update user's answer
    const userAnswer = parseInt(transcript.replace(/\D/g, ""));
    const isCorrect = userAnswer === questions[currentQuestion].answer;

    if (isCorrect) {
      toast.success("Correct answer!", {
        style: { background: "#10B981", color: "white" },
      });
      setScore(score + 1);
      setAnswerStatus("correct");
    } else {
      toast.error(`Incorrect. The answer was ${questions[currentQuestion].answer}`, {
        style: { background: "#EF4444", color: "white" },
      });
      setWrongAnswers(wrongAnswers + 1);
      setAnswerStatus("wrong");
    }

    // Wait before moving to the next question
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
      setAnswerStatus(null); // Reset the answer status for the next question
    }, 2000); // 2-second delay
  };

  const { isListening, error, startListening, stopListening } = useSpeechRecognition({
    onResult: handleResult,
  });

  useEffect(() => {
    if (currentQuestion > 0) {
      stopListening(); // Stop listening before moving to the next question
    }
  }, [currentQuestion, stopListening]);

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setWrongAnswers(0);
    setIsComplete(false);
    setUserAnswer("");
    setWaitingForAnswer(true); // Reset waiting status
    setAnswerStatus(null); // Reset answer status
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
    <div className="container mx-auto px-4 py-8">
      {/* Navigation Buttons */}
      <div className="flex justify-center mb-6 space-x-6">
        <Button
          onClick={() => setActiveQuiz("math")}
          variant={activeQuiz === "math" ? "default" : "outline"}
          className={`${
            activeQuiz === "math"
              ? "bg-gradient-to-r from-primary to-purple-600 text-white"
              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white"
          }`}
        >
          Math Quiz
        </Button>
        <Button
          onClick={() => setActiveQuiz("logical")}
          variant={activeQuiz === "logical" ? "default" : "outline"}
          className={`${
            activeQuiz === "logical"
              ? "bg-gradient-to-r from-primary to-purple-600 text-white"
              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white"
          }`}
        >
          Logical Reasoning Quiz
        </Button>
      </div>

      {activeQuiz === "math" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto relative"
        >
          <div className="mb-12">
            <motion.h1
              className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Math Quiz
            </motion.h1>
            <Progress
              value={(currentQuestion / questions.length) * 100}
              className="mb-4 h-3 bg-gradient-to-r from-blue-500 to-purple-500"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Question {currentQuestion + 1} of {questions.length}
              </span>
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
                className="space-y-8"
              >
                <Card className="p-8 relative overflow-hidden shadow-xl">
                  <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-semibold mb-6 text-primary">
                      {questions[currentQuestion].question}
                    </h2>

                    {/* Navigation buttons next to the question */}
                    <div className="flex gap-4">
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
                  </div>

                  <div className="flex gap-6 items-center">
                    <Button
                      onClick={() =>
                        speak(questions[currentQuestion].question)
                      }
                      variant="outline"
                      size="icon"
                      className="bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
                    >
                      <Volume2 className="h-5 w-5 text-blue-500" />
                    </Button>
                    <Button
                      onClick={isListening ? stopListening : startListening}
                      variant={isListening ? "destructive" : "default"}
                      className={`${
                        isListening
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
                      } transition-all duration-300`}
                    >
                      {isListening ? (
                        <>
                          <MicOff className="mr-2 h-4 w-4 animate-pulse" /> Stop
                          Recording
                        </>
                      ) : (
                        <>
                          <Mic className="mr-2 h-4 w-4" /> Start Recording
                        </>
                      )}
                    </Button>

                    {/* Waiting for Answer Text */}
                    <motion.div
                      className="ml-4 text-lg bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-lg text-white mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1 }}
                    >
                      {userAnswer && !waitingForAnswer
                        ? `Your Answer: ${userAnswer}`
                        : "Waiting for your answer..."}
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <Card className="p-8 bg-gradient-to-br from-background to-primary/5 shadow-xl">
                  <motion.h2
                    className="text-4xl font-bold mb-6 text-primary"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Quiz Complete! 🎉
                  </motion.h2>
                  <p className="text-2xl mb-3">
                    Your Score: {score} / {questions.length}
                  </p>
                  <div className="flex justify-between mb-6">
                    <p className="text-lg text-muted-foreground">Correct Answers: {score}</p>
                    <p className="text-lg text-muted-foreground">Wrong Answers: {wrongAnswers}</p>
                  </div>
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
      )}
      {/* Logical Reasoning Quiz */}
      {activeQuiz === "logical" && <LogicalReasoningQuiz />}
    </div>
  );
}
