import React, { useRef, useEffect } from "react";

function TextHighlighter({ sampleText, userText }) {
  const containerRef = useRef(null);
  const currentWordIndex = userText.split(" ").length - 1;
  const sampleWords = sampleText.split(/\s+/);

  useEffect(() => {
    const container = containerRef.current;
    const lineHeight = 5; // Adjust the multiplier based on your font size and desired speed
    const wordsPerLine = 10; // Adjust based on your layout

    // Calculate the line number and word index within that line
    const lineIndex = Math.floor(currentWordIndex / wordsPerLine);
    const wordIndexInLine = currentWordIndex % wordsPerLine;

    // Set the scroll position to move to the current line
    container.scrollTop = lineIndex * lineHeight;

    // Check if the current word index is within the visible range
    const isCurrentWordVisible =
      lineIndex * wordsPerLine <= currentWordIndex &&
      currentWordIndex < (lineIndex + 1) * wordsPerLine;

    // If the current word is not visible, scroll to make it visible
    if (!isCurrentWordVisible) {
      container.scrollTop = (lineIndex + 1) * lineHeight;
    }
  }, [sampleText, userText]);

  return (
    <div
      ref={containerRef}
      className="bg-white border border-gray-300 rounded p-4 mb-4 h-60 overflow-y-auto"
      style={{fontSize: '20px' }} 
    >
      {sampleWords.map((word, idx) => {
        let isCurrentWord = idx === currentWordIndex;

        return (
          <React.Fragment key={idx}>
            <span
              className={`
                ${isCurrentWord ? "bg-yellow-200" : ""}
              `}
            >
              {word}
            </span>
            {idx !== sampleWords.length - 1 && " "}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default TextHighlighter;
