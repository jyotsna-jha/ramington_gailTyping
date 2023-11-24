// use client
"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaHourglassStart } from "react-icons/fa";
import characterMapping from "./characterMapping"; // Import the Alt codes mapping
import TextHighlighter from "./TextHighlighter"; // Import the TextHighlighter component

const HindiTypingSpace = ({
  sampleText,
  timeLimit,
  onTestComplete,
  userName,
  enableHighlight,
}) => {
  const [userInput, setUserInput] = useState("");
  const [highlightedWordIndex, setHighlightedWordIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [hasStarted, setHasStarted] = useState(false);
  const words = sampleText.split(" ");
  const [backspaceCount, setBackspaceCount] = useState(0);
  const textAreaRef = useRef(null);

 
  const handleKeyDown = (e) => {
    if (e.key === "Backspace") {
      setBackspaceCount((prevCount) => prevCount + 1);
    }

    if (e.altKey) {
      e.preventDefault();
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === "Alt") {
      textAreaRef.current.value += " ";
      setUserInput(textAreaRef.current.value);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  

   /*   const handleInputChange = (e) => {
    if (timeLeft > 0) {
      let inputValue = e.target.value;
      inputValue = inputValue.replace(/w/g, "ू").replace(/a/g, "ं");

      let newInput = "";

      for (let i = 0; i < inputValue.length; i++) {
        if (
          (inputValue[i] === "A" || inputValue[i] === "k") &&
          newInput[newInput.length - 1] === "अ"
        ) {
          newInput = newInput.slice(0, -1) + "आ";
        } else if (inputValue[i] === "ॅ" && inputValue[i + 1] === "ं") {
          newInput += "ँ";
          i++;
        } else {
          const char = inputValue[i];
          if (characterMapping[char]) {
            newInput += characterMapping[char];
          } else {
            newInput += char;
          }
        }
      }

      setUserInput(newInput);

      if (!hasStarted) {
        setHasStarted(true);
      }

      if (
        newInput.endsWith(" ") ||
        highlightedWordIndex === words.length - 1
      ) {
        setHighlightedWordIndex((prevIndex) => prevIndex + 1);
      } else if (!newInput.trim()) {
        setHighlightedWordIndex(0);
      }

      const currentWord = words[highlightedWordIndex];
      const typedWord = newInput.split(" ")[highlightedWordIndex];

      if (currentWord === typedWord && highlightedWordIndex < words.length - 1) {
        // Move to the next word
        setHighlightedWordIndex((prevIndex) => prevIndex + 1);
      } else if (highlightedWordIndex === words.length - 1 && currentWord === typedWord) {
        // End of the test
        setEndTime(Date.now());
      }
    }
  };     
 */
  const handleInputChange = (e) => {
    if (timeLeft > 0) {
      let inputValue = e.target.value;
      inputValue = inputValue.replace(/w/g, "ू").replace(/a/g, "ं");

      let newInput = "";

      for (let i = 0; i < inputValue.length; i++) {
        if (
          (inputValue[i] === "A" || inputValue[i] === "k") &&
          newInput[newInput.length - 1] === "अ"
        ) {
          newInput = newInput.slice(0, -1) + "आ";
        }else if (
          (inputValue[i] === "q") &&
          newInput[newInput.length - 1] === "उ"
        ) {
          newInput = newInput.slice(0, -1) + "ऊ";
        }
        
         else if (inputValue[i] === "ॅ" && inputValue[i + 1] === "ं") {
          newInput += "ँ";
          i++;
        } else {
          const char = inputValue[i];
          if (characterMapping[char]) {
            newInput += characterMapping[char];
          } else {
            newInput += char;
          }
        }
      }

      setUserInput(newInput);

      if (!hasStarted) {
        setHasStarted(true);
      }

      if (
        newInput.endsWith(" ") ||
        highlightedWordIndex === words.length - 1
      ) {
        setHighlightedWordIndex((prevIndex) => prevIndex + 1);
      } else if (!newInput.trim()) {
        setHighlightedWordIndex(0);
      }

      const currentWord = words[highlightedWordIndex];
      const typedWord = newInput.split(" ")[highlightedWordIndex];

      if (currentWord === typedWord && highlightedWordIndex < words.length - 1) {
        // Move to the next word
        setHighlightedWordIndex((prevIndex) => prevIndex + 1);
      } else if (highlightedWordIndex === words.length - 1 && currentWord === typedWord) {
        // End of the test
        setEndTime(Date.now());
      }
    }
  };     

  useEffect(() => {
    let timerInterval;
    if (hasStarted && timeLeft > 0) {
      timerInterval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [hasStarted]);

  useEffect(() => {
    if (!userInput) {
      setHighlightedWordIndex(0);
    }
  }, [userInput]);

  useEffect(() => {
    if (timeLeft === 0) {
      const userWords = userInput.trim().split(/\s+/);
      let correctWords = [];
      userWords.forEach((word, idx) => {
        if (word === words[idx]) {
          correctWords.push(word);
        }
      });
      const totalWords = userWords.length;
      const correctWordsCount = correctWords.length;
      const wrongWordsCount = totalWords - correctWordsCount;
      const accuracy = Math.floor((correctWordsCount / totalWords) * 100);
      const timeTakenInMinutes = (timeLimit - timeLeft) / 60;
      const grossSpeed = Math.floor(totalWords / timeTakenInMinutes);
      const errorsPerMinute =
        (totalWords - correctWordsCount) / timeTakenInMinutes;
      const netSpeed = Math.floor(grossSpeed - errorsPerMinute);
      onTestComplete(
        totalWords,
        correctWordsCount,
        wrongWordsCount,
        accuracy,
        grossSpeed,
        netSpeed,
        correctWords,
        [],
        backspaceCount
      );
    }
  }, [timeLeft, userInput, onTestComplete, words, timeLimit]);

  return (
    <div className="w-full max-w-screen-lg mx-auto p-4 relative">
      <div className="text-center py-4">
        <h1 className="text-3xl md:text-4xl  font-semibold text-[#e74c3c]">
          Hindi Typing
        </h1>
        <p className="text-base md:text-lg py-2 font-semibold text-gray-600">
          Practice Hindi typing to enhance your proficiency...
        </p>
      </div>
      <h1 className="text-base md:text-lg py-2 font-semibold text-gray-600">
        Hi {userName}
      </h1>
      <div className="flex items-center  text-[#e74c3c] font-semibold text-lg mb-4">
        <FaHourglassStart className="mr-2 text-xl" />
        Timer: {timeLeft} seconds
      </div>
      {enableHighlight ? (
        <TextHighlighter sampleText={sampleText} userText={userInput} />
      ) : (
        <div className="bg-white border border-gray-300 rounded p-4 mb-4 h-60 overflow-y-auto">
          {sampleText}
        </div>
      )}
      <div>
        <textarea
          ref={textAreaRef}
          className="w-full p-4 border-2 border-gray-300 rounded focus:outline-none focus:border-red-300 focus:border-4 transition"
          rows="10"
          placeholder="Time will start once you start typing"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
        
        />
      </div>
    </div>
  );
};

export default HindiTypingSpace;
