'use client';

import { getInterviewQuestion, type InterviewQuestion } from '@/data/interviews';
import { Job } from '@/types/game';
import { useState } from 'react';

interface InterviewModalProps {
  targetJob: Job;
  onAnswer: (correct: boolean) => void;
  onCancel: () => void;
}

export default function InterviewModal({ targetJob, onAnswer, onCancel }: InterviewModalProps) {
  const [question] = useState<InterviewQuestion>(() => getInterviewQuestion(targetJob));
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (selectedOption === null) return;

    const correct = selectedOption === question.correctIndex;
    setIsCorrect(correct);
    setShowResult(true);
  };

  const handleClose = () => {
    onAnswer(isCorrect);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-2xl rounded border-2 border-emerald-500 bg-black p-6 shadow-xl shadow-emerald-500/20">
        {/* Header */}
        <div className="mb-6 border-b-2 border-emerald-500/30 pb-4">
          <h2 className="mb-2 font-mono text-2xl font-bold text-emerald-500">// JOB INTERVIEW</h2>
          <p className="font-mono text-sm text-emerald-500/70">
            Position: <span className="text-white">{targetJob.title}</span>
          </p>
          <p className="mt-1 font-mono text-xs text-emerald-500/50">Answer correctly to unlock this role</p>
        </div>

        {!showResult ? (
          <>
            {/* Question */}
            <div className="mb-6">
              <p className="mb-4 font-mono text-lg text-white">{question.question}</p>

              {/* Options */}
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedOption(index);
                    }}
                    className={`w-full rounded border-2 p-3 text-left font-mono transition-all ${
                      selectedOption === index
                        ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400'
                        : 'border-emerald-500/30 text-emerald-500/70 hover:border-emerald-500 hover:bg-emerald-500/5 hover:text-emerald-500'
                    }`}
                  >
                    <span className="mr-3 text-xs">[{String.fromCharCode(65 + index)}]</span>
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={selectedOption === null}
                className="flex-1 rounded border-2 border-emerald-500 bg-emerald-500/10 px-4 py-2 font-mono text-sm font-bold text-emerald-500 transition-all hover:bg-emerald-500 hover:text-black disabled:cursor-not-allowed disabled:border-emerald-500/30 disabled:bg-transparent disabled:text-emerald-500/30"
              >
                {selectedOption === null ? '// SELECT AN ANSWER' : '&gt;&gt; SUBMIT ANSWER'}
              </button>
              <button
                onClick={onCancel}
                className="rounded border-2 border-red-500/50 px-4 py-2 font-mono text-sm text-red-500/70 transition-all hover:border-red-500 hover:bg-red-500/10 hover:text-red-500"
              >
                CANCEL
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Result */}
            <div
              className={`mb-6 rounded border-2 p-4 ${
                isCorrect ? 'border-emerald-500 bg-emerald-500/10' : 'border-red-500 bg-red-500/10'
              }`}
            >
              <p className={`mb-2 font-mono text-xl font-bold ${isCorrect ? 'text-emerald-500' : 'text-red-500'}`}>
                {isCorrect ? '✓ CORRECT!' : '✗ INCORRECT'}
              </p>
              <p className="mb-3 font-mono text-sm text-white">{question.explanation}</p>
              {isCorrect ? (
                <p className="font-mono text-xs text-emerald-500/70">
                  Congratulations! You've unlocked {targetJob.title}.
                </p>
              ) : (
                <p className="font-mono text-xs text-red-500/70">
                  Better luck next time. Keep studying and try again next year.
                </p>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="w-full rounded border-2 border-cyan-400 bg-cyan-400/10 px-4 py-2 font-mono text-sm font-bold text-cyan-400 transition-all hover:bg-cyan-400 hover:text-black"
            >
              &gt;&gt; CONTINUE
            </button>
          </>
        )}
      </div>
    </div>
  );
}
