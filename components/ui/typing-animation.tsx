"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface TypingAnimationProps {
  words: string[];
  className?: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseDelay?: number;
}

export function TypingAnimation({
  words,
  className,
  typeSpeed = 50,
  deleteSpeed = 30,
  pauseDelay = 1500,
}: TypingAnimationProps) {
  const [currentWordIndex, setCurrentWordIndex] = React.useState(0);
  const [displayedText, setDisplayedText] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Find the longest word to maintain consistent width
  const longestWord = React.useMemo(
    () => words.reduce((a, b) => (a.length > b.length ? a : b), ""),
    [words]
  );

  React.useEffect(() => {
    const currentWord = words[currentWordIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          // Typing
          if (displayedText.length < currentWord.length) {
            setDisplayedText(currentWord.slice(0, displayedText.length + 1));
          } else {
            // Finished typing, wait then start deleting
            setTimeout(() => setIsDeleting(true), pauseDelay);
          }
        } else {
          // Deleting
          if (displayedText.length > 0) {
            setDisplayedText(currentWord.slice(0, displayedText.length - 1));
          } else {
            // Finished deleting, move to next word
            setIsDeleting(false);
            setCurrentWordIndex((prev) => (prev + 1) % words.length);
          }
        }
      },
      isDeleting ? deleteSpeed : typeSpeed
    );

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentWordIndex, words, typeSpeed, deleteSpeed, pauseDelay]);

  return (
    <span className={cn("inline-flex items-center", className)}>
      {/* Invisible text to maintain consistent width */}
      <span className="invisible absolute" aria-hidden="true">
        {longestWord}
      </span>
      {/* Visible typing text */}
      <span className="inline-block">
        {displayedText}
      </span>
      {/* Blinking cursor */}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.4, repeat: Infinity, repeatType: "reverse" }}
        className="ml-0.5 inline-block w-0.5 h-4 bg-current"
      />
    </span>
  );
}
