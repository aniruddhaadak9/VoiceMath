"use client";

import { useState, useEffect, useCallback } from 'react';

interface UseSpeechRecognitionProps {
  onResult?: (transcript: string) => void;
  language?: string;
}

export function useSpeechRecognition({ onResult, language = 'en-US' }: UseSpeechRecognitionProps = {}) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (onResult) {
        onResult(transcript);
      }
    };

    recognition.onerror = (event: any) => {
      setError(`Error occurred in recognition: ${event.error}`);
    };

    recognition.start();

    // Automatically stop after 5 seconds
    setTimeout(() => {
      recognition.stop();
    }, 5000);

    return () => {
      recognition.stop();
    };
  }, [language, onResult]);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  return {
    isListening,
    error,
    startListening,
    stopListening,
  };
}