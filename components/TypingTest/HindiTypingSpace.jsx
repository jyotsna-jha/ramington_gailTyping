// use client
"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaHourglassStart } from "react-icons/fa";
import characterMapping from "./characterMapping";
import TextHighlighter from "./TextHighlighter";
import useDebounce from "@/utils/useDebounce";

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

  function convert(inputValue) {
    inputValue = inputValue.replace(/w/g, "ू").replace(/a/g, "ं");

    // Handle "[A" and "[k" mappings

    inputValue = inputValue.replace(
      /\[A/g,
      (match) => characterMapping[match] || match
    );
    inputValue = inputValue.replace(
      /\[k/g,
      (match) => characterMapping[match] || match
    );

    inputValue = inputValue.replace(
      /\.A/g,
      (match) => characterMapping[match] || match
    );
    inputValue = inputValue.replace(
      /\.k/g,
      (match) => characterMapping[match] || match
    );
    inputValue = inputValue.replace(
      /\/A/g,
      (match) => characterMapping[match] || match
    );
    inputValue = inputValue.replace(
      /\/k/g,
      (match) => characterMapping[match] || match
    );
    inputValue = inputValue.replace(
      /\?A/g,
      (match) => characterMapping[match] || match
    );
    inputValue = inputValue.replace(
      /\/k/g,
      (match) => characterMapping[match] || match
    );
    inputValue = inputValue.replace(
      /\'A/g,
      (match) => characterMapping[match] || match
    );
    inputValue = inputValue.replace(
      /\'k/g,
      (match) => characterMapping[match] || match
    );
    inputValue = inputValue.replace(
      /\HA/g,
      (match) => characterMapping[match] || match
    );
    inputValue = inputValue.replace(
      /\Hk/g,
      (match) => characterMapping[match] || match
    );
    inputValue = inputValue.replace(
      /\FA/g,
      (match) => characterMapping[match] || match
    );
    inputValue = inputValue.replace(
      /\Fk/g,
      (match) => characterMapping[match] || match
    );
    inputValue = inputValue.replace(
      /\{A/g,
      (match) => characterMapping[match] || match
    );
    inputValue = inputValue.replace(
      /\{k/g,
      (match) => characterMapping[match] || match
    );

    inputValue = inputValue.replace(
      /\[/g,
      (match) => characterMapping[match] || match
    );

    let newInput = "";

    for (let i = 0; i < inputValue.length; i++) {
      const char = inputValue[i];

      if (char === "[") {
        const nextChar = inputValue[i + 1];
        if (nextChar === "A" || nextChar === "k") {
          newInput += characterMapping[char + nextChar] || char + nextChar;
          i += 1; // Skip the next character ("A" or "k")
        } else {
          newInput += char;
        }
      } else if (char === ".") {
        const nextChar = inputValue[i + 1];
        if (nextChar === "A" || nextChar === "k") {
          newInput += characterMapping[char + nextChar] || char + nextChar;
          i += 1; // Skip the next character ("A" or "k")
        } else {
          newInput += char;
        }
      } else if (char === "?") {
        const nextChar = inputValue[i + 1];
        if (nextChar === "A" || nextChar === "k") {
          newInput += characterMapping[char + nextChar] || char + nextChar;
          i += 1; // Skip the next character ("A" or "k")
        } else {
          newInput += char;
        }
      } else if (char === "{") {
        const nextChar = inputValue[i + 1];
        if (nextChar === "A" || nextChar === "k") {
          newInput += characterMapping[char + nextChar] || char + nextChar;
          i += 1; // Skip the next character ("A" or "k")
        } else {
          newInput += char;
        }
      } else if (char === "H") {
        const nextChar = inputValue[i + 1];
        if (nextChar === "A" || nextChar === "k") {
          newInput += characterMapping[char + nextChar] || char + nextChar;
          i += 1; // Skip the next character ("A" or "k")
        } else {
          newInput += char;
        }
      } else if (char === "F") {
        const nextChar = inputValue[i + 1];
        if (nextChar === "A" || nextChar === "k") {
          newInput += characterMapping[char + nextChar] || char + nextChar;
          i += 1; // Skip the next character ("A" or "k")
        } else {
          newInput += char;
        }
      } else if (char === "'") {
        const nextChar = inputValue[i + 1];
        if (nextChar === "A" || nextChar === "k") {
          newInput += characterMapping[char + nextChar] || char + nextChar;
          i += 1; // Skip the next character ("A" or "k")
        } else {
          newInput += char;
        }
      } else if (char === "/") {
        const nextChar = inputValue[i + 1];
        if (nextChar === "A" || nextChar === "k") {
          newInput += characterMapping[char + nextChar] || char + nextChar;
          i += 1; // Skip the next character ("A" or "k")
        } else {
          newInput += char;
        }
      } else if (
        (char === "A" || char === "k") &&
        newInput[newInput.length - 1] === "अ"
      ) {
        newInput = newInput.slice(0, -1) + "आ";
      } else if (char === "W" && newInput[newInput.length - 1] === "आ") {
        newInput = newInput.slice(0, -1) + "ऑ";
      } else if (char === "W" && newInput[newInput.length - 1] === "आ") {
        newInput = newInput.slice(0, -1) + "ऑ";
      } else if (char === "s" && newInput[newInput.length - 1] === "अ") {
        newInput = newInput.slice(0, -1) + "ओ";
      } else if (char === "Q" && newInput[newInput.length - 1] === "उ") {
        newInput = newInput.slice(0, -1) + "ऊ";
      } else if (char === "ॅ" && inputValue[i + 1] === "ं") {
        newInput += "ँ";
        i++;
      } else {
        newInput += characterMapping[char] || char;
      }
    }

    setUserInput(newInput);
  }

  useDebounce(
    () => {
      convert(userInput);
    },
    [userInput],
    500
  );

  const handleKeyDown = (e) => {
    if (e.key === "Backspace") {
      setBackspaceCount((prevCount) => prevCount + 1);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes >= 1) {
      return `${minutes} min`;
    } else {
      return `${remainingSeconds} sec`;
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

  const handleInputChange = (e) => {
    if (timeLeft > 0) {
      console.log("Original inputValue:", e.target.value);
      let inputValue = e.target.value;

      setUserInput(inputValue);

      if (!hasStarted) {
        setHasStarted(true);
      }

      if (
        inputValue.endsWith(" ") ||
        highlightedWordIndex === words.length - 1
      ) {
        setHighlightedWordIndex((prevIndex) => prevIndex + 1);
      } else if (!inputValue.trim()) {
        setHighlightedWordIndex(0);
      }

      const currentWord = words[highlightedWordIndex];
      const typedWord = inputValue.split(" ")[highlightedWordIndex];

      if (
        currentWord === typedWord &&
        highlightedWordIndex < words.length - 1
      ) {
        // Move to the next word
        setHighlightedWordIndex((prevIndex) => prevIndex + 1);
      } else if (
        highlightedWordIndex === words.length - 1 &&
        currentWord === typedWord
      ) {
        // End of the test
        setEndTime(Date.now());
      }
      console.log("Transformed inputValue:", inputValue);
    }
  };

  // ... (rest of the code remains unchanged)

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
      <div className="flex items-center text-[#e74c3c] font-semibold text-lg mb-4">
        <FaHourglassStart className="mr-2 text-xl" />
        Timer: {formatTime(timeLeft)}
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
        />
      </div>
    </div>
  );
};

export default HindiTypingSpace;
