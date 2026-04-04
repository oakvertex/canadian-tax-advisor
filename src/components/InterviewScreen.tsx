"use client";

import type { InterviewScreen } from "@/types";

interface Props {
  screen: InterviewScreen;
  onAnswer: (value: any) => void;
  currentAnswers: Record<string, any>;
}

export default function InterviewScreenComponent({ screen, onAnswer, currentAnswers }: Props) {
  const { screen_type, title, instruction, options, question_id } = screen;
  const currentValue = currentAnswers[question_id];

  if (screen_type === "single_select") {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {instruction && <p className="text-gray-600">{instruction}</p>}
        <div className="flex flex-col gap-3 mt-2">
          {options.map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => onAnswer(opt.value)}
              className="w-full text-left px-5 py-4 rounded-lg border border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors text-base font-medium text-gray-800"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // multi_select
  const selected: any[] = Array.isArray(currentValue) ? currentValue : [];
  const exclusiveValues = options.filter((o) => o.exclusive).map((o) => o.value);

  const toggleOption = (value: any, exclusive?: boolean) => {
    if (exclusive) {
      onAnswer([value]);
      return;
    }
    const cleaned = selected.filter((v) => !exclusiveValues.includes(v));
    if (cleaned.includes(value)) {
      onAnswer(cleaned.filter((v) => v !== value));
    } else {
      onAnswer([...cleaned, value]);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {instruction && <p className="text-gray-600">{instruction}</p>}
      <p className="text-sm text-gray-500">Select all that apply.</p>
      <div className="flex flex-col gap-3 mt-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.value);
          return (
            <button
              key={String(opt.value)}
              onClick={() => toggleOption(opt.value, opt.exclusive)}
              className={`w-full text-left px-5 py-4 rounded-lg border transition-colors text-base font-medium flex items-center gap-3 ${
                isSelected
                  ? "border-blue-500 bg-blue-50 text-gray-800"
                  : "border-gray-300 hover:border-blue-400 hover:bg-gray-50 text-gray-800"
              }`}
            >
              <span
                className={`w-5 h-5 flex-shrink-0 rounded border-2 flex items-center justify-center ${
                  isSelected ? "border-blue-500 bg-blue-500" : "border-gray-400 bg-white"
                }`}
              >
                {isSelected && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              {opt.label}
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <button
          onClick={() => onAnswer(selected)}
          className="mt-2 self-start px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Continue
        </button>
      )}
    </div>
  );
}
