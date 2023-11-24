"use client";
import React, { useState } from "react";
import TestSetupForm from "@/components/TypingTest/TestSetup";
import HindiTypingSpace from "@/components/TypingTest/HindiTypingSpace"; // Update import
import TestResults from "@/components/TypingTest/TestResults";
import texts from "@/data/hindiMangal.js"; // Assuming you have a file for Hindi texts, update import

export default function TypingTest() {
  const [startTest, setStartTest] = useState(false);
  const [timeOver, setTimeOver] = useState(false);
  const [stats, setStats] = useState({});
  const [testText, setTestText] = useState("");
  const [duration, setDuration] = useState(60);
  const [userName, setUserName] = useState("");
  const [enableHighlight, setEnableHighlight] = useState(true);

  const handleStartTest = (duration, difficulty, userName, enableHighlight) => {
    // Assuming you have a file for Hindi texts
    const selectedTexts = texts[difficulty]; 
    if (Array.isArray(selectedTexts)) {
      const randomIndex = Math.floor(Math.random() * selectedTexts.length);
      setTestText(selectedTexts[randomIndex]);
      setDuration(duration);
      setUserName(userName);
      setEnableHighlight(enableHighlight);
      setStartTest(true);
    } else {
      console.error(
        "Selected texts are not available for difficulty:",
        difficulty
      );
    }
  };

  const handleTestComplete = (
    totalWords,
    correctWordsCount,
    wrongWordsCount,
    accuracy,
    grossSpeed,
    netSpeed,
    correctWords,
    wrongWords,
    backspaceCount
  ) => {
    setStats({
      totalWords,
      correctWordsCount,
      wrongWordsCount,
      accuracy,
      grossSpeed,
      netSpeed,
      correctWords,
      wrongWords,
      backspaceCount,
    });
    setTimeOver(true);
    setStartTest(false);
  };

  const retakeTest = () => {
    setTimeOver(false);
    setStats({});
  };

  if (startTest) {
    // Use HindiTypingSpace component instead of EnglishTypingSpace
    return (
      <HindiTypingSpace
        sampleText={testText}
        timeLimit={duration}
        userName={userName}
        onTestComplete={handleTestComplete}
        enableHighlight={enableHighlight}
      />
    );
  }

  return (
    <>
      {timeOver ? (
        <TestResults {...stats} retakeTest={retakeTest} />
      ) : (
        <TestSetupForm onStartTest={handleStartTest} />
      )}
    </>
  );
}
