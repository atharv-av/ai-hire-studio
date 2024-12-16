"use client"

import React, { useState, useEffect } from 'react';

interface DescriptionTextProps {
  prefix?: string;
  words?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenWords?: number;
  className?: string;
}

export const DescriptionText: React.FC<DescriptionTextProps> = ({
  prefix = "I am",
  words = ["Atharv", "Creative", "Passionate"],
  typingSpeed = 150,
  deletingSpeed = 100,
  delayBetweenWords = 1000,
  className = ""
}) => {
  const [currentWord, setCurrentWord] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (words.length === 0) return;

    const handleTyping = () => {
      const currentFullWord = words[currentIndex];
      
      if (isDeleting) {
        // Deleting text
        setCurrentWord((prev) => prev.slice(0, -1));
        
        if (currentWord === '') {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % words.length);
        }
      } else {
        // Typing text
        if (currentWord.length < currentFullWord.length) {
          setCurrentWord(currentFullWord.slice(0, currentWord.length + 1));
        } else {
          // Delay before starting to delete
          setTimeout(() => setIsDeleting(true), delayBetweenWords);
        }
      }
    };

    const timeout = setTimeout(
      handleTyping,
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [currentWord, currentIndex, isDeleting, words, typingSpeed, deletingSpeed, delayBetweenWords]);

  return (
    <div className={`text-3xl font-bold p-4 ${className}`}>
      <span>{prefix} </span>
      <span className="text-yellow-500">
        {currentWord}
        <span className="animate-pulse">|</span>
      </span>
    </div>
  );
};

