// components/TextHighlighter.js
import React from "react";

function TextHighlighter({ sampleText, userText }) {
  // Count the number of spaces in userText to determine the current word index
  const currentWordIndex = userText.split(" ").length - 1;
  const sampleWords = sampleText.split(/\s+/);

  return (
    <div className="bg-white border border-gray-300 rounded p-4 mb-4 h-60 overflow-y-auto">
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
