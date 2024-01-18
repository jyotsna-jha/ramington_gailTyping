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
  const [isIApplied, setIsIApplied] = useState(false);
  const [isFPressed, setIsFPressed] = useState(false);
  const lastKeyPressed = useRef(null);
  const [zModifierIndex, setZModifierIndex] = useState(null);

  const charactersMapping = {
    d: "क",
    D: "क्",
    f: "ि",
    g: "ह",
    G: "ळ",
    j: "र",
    J: "श्र",
    L: "स्",
    E: "म्",
    R: "त्",
    T: "ज्",
    Y: "ल्",
    K: "ज्ञ",
    I: "प्",
    l: "स",
    Q: "फ",
    O: "व्",
    P: "च्",
    e: "म",
    r: "त",
    t: "ज",
    y: "ल",
    u: "न",
    U: "न्",
    i: "प",
    o: "व",
    p: "च",
    Z: "र्",
    /*  "]": "द्व", */
    "~": "द्य",
    x: "ग",
    C: "ब्",
    c: "ब",
    X: "ग्",
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
    /*     "\u003F": "?",
     */ ".": "ण्",
    F: "थ्",
    H: "भ्",
    "[": "ख्",
    "[A": "ख",
    "[k": "ख",
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
    "}": "द्व",
    HA: "भ",
    Hk: "भ",
    FA: "थ",
    Fk: "थ",
    "*": "द्ध",

    "f?": "घि्",
    "f?k": "घि",
    "f?A": "घि",

    ";": "य",
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace") {
      setBackspaceCount((prevCount) => prevCount + 1);
    }
    
    lastKeyPressed.current = e.key;

    // Custom logic to prevent certain keys
    if (["?"].includes(e.key)) {
      e.preventDefault();
    }
    if (e.key === "?") {
      setUserInput((prev) => prev + "घ्");
      lastKeyPressed.current = "?";
    }
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

      const specialCharacterMapping = {
        "\u003F": "?", 

      };

      inputValue = inputValue.replace(/w/g, "ू").replace(/a/g, "ं");
      let newInput = "";
      let mappedValue = "";
      let isFPressedLocal = isFPressed;

      for (let i = 0; i < inputValue.length; i++) {
        const char = inputValue[i];

        if (specialCharacterMapping.hasOwnProperty(char)) {
          // If the current character is one of the special characters, add it without further conversion
          newInput += char;
        } else if (char in charactersMapping) {
          const mappedCharacter = charactersMapping[char];
        
          console.log("char:", char);
          console.log("newInput:", newInput);
          console.log("charactersMapping['f']:", charactersMapping["f"]);
        
          if (char === "Q" && newInput[newInput.length - 1] === "उ") {
            newInput = newInput.slice(0, -1) + "ऊ";
          } else if (isIApplied) {
            setIsIApplied(false);
        
            if (char === "?" && newInput.includes(charactersMapping["f"])) {

              console.log("Condition matched: char === '?' && newInput.endsWith(charactersMapping['f'])");
              newInput = newInput.slice(0, -charactersMapping["f"].length);
              newInput += charactersMapping[`f${char}`] || char;
            } else {
              newInput = newInput.slice(0, -1) + mappedCharacter + "ि";
            }
          } else {
            setIsIApplied(char === "f");
            newInput += mappedCharacter;
          }
        }
        else if (
          (char === "A" || char === "k") &&
          newInput.endsWith(characterMapping["f?"])
        ) {
          // Handle 'A' and 'k' after 'f['
          newInput = newInput.slice(0, -characterMapping["f?"].length);
          newInput += characterMapping[`f?${char}`] || char;
        } else {
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
    const userWords = inputValue.trim().split(/\s+/);
    const currentWord = words[highlightedWordIndex]?.trim();
    const typedWord = userWords[highlightedWordIndex]?.trim();

    if (currentWord !== typedWord) {
      // Handle wrong word logic here
    }
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
        <FaHourglassStart className="mr-2 text-2xl" />
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
          placeholder="समय शुरू होगा जब आप टाइपिंग करना शुरू करेंगे।"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          style={{ fontSize: "20px" }}
        />
      </div>
    </div>
  );
};

export default HindiTypingSpace;
