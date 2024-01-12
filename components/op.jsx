"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaHourglassStart } from "react-icons/fa";
import characterMapping from "./characterMapping";
import TextHighlighter from "./TextHighlighter";

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
  const [outputValue, setOutputValue] = useState(""); // New state for the output
  const words = sampleText.split(" ");
  const [backspaceCount, setBackspaceCount] = useState(0);
  const textAreaRef = useRef(null);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const lastKeyPressed = useRef(null);
  const [zModifierIndex, setZModifierIndex] = useState(null);
  const [isIApplied, setIsIApplied] = useState(false);



  const charactersMapping = {
    d: "क",
    f: "ि",
    g: "ह",
    G: "ळ",
    j: "र",
    J: "श्र",
    K: "ज्ञ",
    l: "स",
    Q: "फ",
    e: "म",
    r: "त",
    t: "ज",
    y: "ल",
    u: "न",
    i: "प",
    o: "व",
    p: "च",
    Z: "र्र् ",
    /*  "]": "द्व", */
    "~": "द्य",
    x: "ग",
    c: "ब",
    v: "अ",
    V: "ट",
    b: "इ",
    B: "ठ",
    n: "द",
    N: "छ",
    m: "उ",
    M: "ड",
    ",": "ए",
    "<": "ढ",
    ">": "झ",
    "(": "त्र",
    ")": "ऋ",
    "'": "श्",
    '"': "ष्",
    "{": "क्ष्‍",
    "?": "घ्",
    ".": "ण्",
    F: "थ्",
    H: "भ्",
   /*   "[": "ख्", */
      /* "[A": "ख",
    "[k": "ख",  */ 
    ".A": "ण",
    ".k": "ण",
    "/A": "ध",
    "/k": "ध",
    "?A": "घ",
    "?k": "घ",
    "'A": "श",
    "'k": "श",
    '"A': "ष",
    '"k': "ष",
    HA: "भ",
    Hk: "भ",
    FA: "थ",
    Fk: "थ",
    "{A": "क्ष",
    "{k": "क्ष",
    "/": "ध्",
    f: "ि",
    "f[": "खि्",
   "f[k":"खि",
   "f[A":"खि", 
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace") {
      setBackspaceCount((prevCount) => prevCount + 1);
    }

    lastKeyPressed.current = e.key;

    // Custom logic to prevent certain keys
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      if (remainingSeconds === 0) {
        return `${minutes} min`;
      } else {
        return `${minutes} min ${remainingSeconds} sec`;
      }
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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      let output = "";

      // Check for complete sequences in the user input
      for (let key in characterMapping) {
        if (userInput.endsWith(key)) {
          output = characterMapping[key];
        }
      }
      setOutputValue(output);
    }, 300); // Adjust the debounce delay as needed

    return () => clearTimeout(timeoutId);
  }, [userInput]);

  const handleInputChange = (e) => {
    if (timeLeft > 0) {
      let inputValue = e.target.value;
      inputValue = inputValue.replace(/w/g, "ू").replace(/a/g, "ं");
      let newInput = "";

      for (let i = 0; i < inputValue.length; i++) {
        const char = inputValue[i];

         if (char in charactersMapping) {
          const mappedCharacter = charactersMapping[char];

          if (isIApplied) {
            setIsIApplied(false);
            newInput = newInput.slice(0, -1) + mappedCharacter + "ि";
          } else if (char === "Q" && newInput[newInput.length - 1] === "उ") {
            newInput = newInput.slice(0, -1) + "ऊ";
          } else {
            setIsIApplied(char === "f");
            newInput += mappedCharacter;
          }
        }   



       else if (
          newInput.endsWith(characterMapping["fd"])
        ) {
          // Append the mapping of the current character to newInput
          newInput += characterMapping[char] || char;
        } else if (
          (char === "d") &&
          newInput.endsWith(characterMapping["f"])
        ) {
          newInput = newInput.slice(0, -characterMapping["f"].length);
          newInput += characterMapping["fd"];
        } 
 
         /* else if (
          newInput.endsWith(charactersMapping["f[k"])||newInput.endsWith(charactersMapping["f[A"])
        ) {
          // Append the mapping of the current character to newInput
          newInput += charactersMapping[char] || char;
        } 
          */
         else if (
          (char === "[") &&
          newInput.endsWith(characterMapping["f"])
        ) {
          // Handle 'A' and 'k' after '['
          newInput = newInput.slice(0, -characterMapping["f"].length);
          newInput += characterMapping[`f${char}`] || char;
        } else if (
          (char === "A" || char === "k") &&
          newInput.endsWith(characterMapping["f["])
        ) {
          // Handle 'A' and 'k' after 'f['
          newInput = newInput.slice(0, -characterMapping["f["].length);
          newInput += characterMapping[`f[${char}`] || char;
        } 
       
      else if (char === "[") {
          // Handle '[' character separately
          newInput += characterMapping[char];
        } else if (
          (char === "A" || char === "k") &&
          newInput.endsWith(characterMapping["["])
        ) {
          // Handle 'A' and 'k' after '['
          newInput = newInput.slice(0, -characterMapping["["].length);
          newInput += characterMapping[`[${char}`] || char;
        } else if (
          (char === "A" || char === "k") &&
          newInput.endsWith(characterMapping["[A"])
        ) {
          // Handle 'A' and 'k' after '[A'
          newInput = newInput.slice(0, -characterMapping["[A"].length);
          newInput += characterMapping[`[${char}`] || char;

          // If the current character is 'A', append 'ा' to newInput
          if (char === "A" || char === "k") {
            newInput += "ा";
          }
        } else if (
          (char === "A" || char === "k") &&
          newInput.endsWith(characterMapping["[k"])
        ) {
          // Handle 'A' and 'k' after '[k'
          newInput = newInput.slice(0, -characterMapping["[k"].length);
          newInput += characterMapping[`[${char}`] || char;

          // If the current character is 'A', append 'ा' to newInput

          if (char === "A" || char === "k") {
            newInput += "ा";
          }
        } else if (
          (char === "A" || char === "k") &&
          newInput.endsWith(characterMapping["[A"])
        ) {
          // Handle 'A' and 'k' after '[A'
          newInput = newInput.slice(0, -characterMapping["[A"].length);
          newInput += characterMapping[`[${char}`] || char;

          // If the current character is 'A', append 'ा' to newInput
          if (char === "A" || char === "k") {
            newInput += "ा";
          }
        } else if (
          (char === "A" || char === "k") &&
          newInput.endsWith(characterMapping["[kA"])
        ) {
          // Handle 'A' and 'k' after '[kA'
          newInput = newInput.slice(0, -characterMapping["[kA"].length);
          newInput += characterMapping[`[k${char}`] || char;

          if (char === "A" || char === "k") {
            newInput += "ा";
          }
        } /* else {
          newInput += characterMapping[char] !== undefined ? characterMapping[char] : char;   
             } */
             else {
              newInput += characterMapping[char] || char;
            }
      }

      setUserInput(newInput);

      if (!hasStarted) {
        setHasStarted(true);
      }

      if (newInput.endsWith(" ") || highlightedWordIndex === words.length - 1) {
        setHighlightedWordIndex((prevIndex) => prevIndex + 1);
      } else if (!newInput.trim()) {
        setHighlightedWordIndex(0);
      }

      // Clear previous debounce timeout
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }

      // Set a new debounce timeout
      const newTimeout = setTimeout(() => {
        // Process the input after the debounce period
        processUserInput(newInput);

      }, 200);

      setDebounceTimeout(newTimeout);
    }
  };

  const processUserInput = (inputValue) => {
    console.log("Input Value:", inputValue);
    const userWords = inputValue.trim().split(/\s+/);
/*     console.log("User Words:", userWords);
 */    const currentWord = words[highlightedWordIndex]?.trim();
    const typedWord = userWords[highlightedWordIndex]?.trim();

   /*  console.log("Current Word:", currentWord);
    console.log("Typed Word:", typedWord);

    console.log("Words Length:", words.length);
    console.log("User Words Length:", userWords.length);
 */
    if (currentWord !== typedWord) {
      // Handle wrong word logic here
/*       console.log("Wrong word:", typedWord);
 */    }

    if (currentWord === typedWord && highlightedWordIndex < words.length - 1) {
      // Move to the next word
      setHighlightedWordIndex((prevIndex) => prevIndex + 1);
    } else if (
      highlightedWordIndex === words.length - 1 &&
      currentWord === typedWord
    ) {
      // End of the test
      setEndTime(Date.now());
    }
  };

  useEffect(() => {
    if (!userInput) {
      setHighlightedWordIndex(0);
    }
  }, [userInput]);

  useEffect(() => {
    /*  if (timeLeft === 0) {
      const userWords = userInput.trim().split(/\s+/);
      let correctWords = [];
      userWords.forEach((word, idx) => {
        if (word === words[idx]) {
          correctWords.push(word);
        }
      }); */

    if (timeLeft === 0) {
      const userWords = userInput.trim().split(/\s+/);
      let correctWords = [];
      let wrongWords = [];
      userWords.forEach((word, idx) => {
        if (word === words[idx]) {
          correctWords.push(word);
        } else {
          wrongWords.push(word);
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
        wrongWords,
        backspaceCount,

        []
      );
    }
  }, [timeLeft, userInput, onTestComplete, words, timeLimit]);

  return (
    <div className="w-full max-w-screen-lg mx-auto p-4 relative">
      <div className="text-center py-4">
        <h1 className="text-3xl md:text-4xl  font-semibold text-[#e74c3c]">
          Hindi Typing Mangal
        </h1>
        <p className="text-base md:text-lg py-2 font-semibold text-gray-600">
          Practice Hindi typing Mangal to enhance your proficiency...
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
