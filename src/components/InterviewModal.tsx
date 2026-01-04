'use client';

import { getInterviewSession, type InterviewQuestion } from '@/data/interviews';
import { Job } from '@/types/game';
import { useEffect, useState } from 'react';

interface InterviewModalProps {
  targetJob: Job;
  onComplete: (passed: boolean) => void;
  onCancel: () => void;
}

type InterviewStep = 0 | 1 | 2 | 'results';

interface AnswerRecord {
  questionIndex: number;
  selectedOption: number;
  correct: boolean;
}

const PASSING_SCORE = 2; // Need 2/3 to pass

// Loading messages for the retro aesthetic
const LOADING_MESSAGES = [
  'CONNECTING TO NEURAL NET...',
  'ESTABLISHING UPLINK...',
  'GENERATING INTERVIEW PROTOCOL...',
  'ANALYZING JOB REQUIREMENTS...',
  'COMPILING QUESTIONS...',
];

export default function InterviewModal({ targetJob, onComplete, onCancel }: InterviewModalProps) {
  // Loading and question state
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [questionSource, setQuestionSource] = useState<'gemini' | 'fallback'>('fallback');

  const [currentStep, setCurrentStep] = useState<InterviewStep>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);

  // Fetch questions on mount
  useEffect(() => {
    let messageInterval: NodeJS.Timeout | null = null;
    let isMounted = true;

    const fetchQuestions = async () => {
      setIsLoading(true);

      // Cycle through loading messages for effect
      let messageIndex = 0;
      messageInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
        setLoadingMessage(LOADING_MESSAGES[messageIndex]);
      }, 800);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

        const response = await fetch('/api/interview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ job: targetJob }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (isMounted && data.questions && Array.isArray(data.questions) && data.questions.length === 3) {
          setQuestions(data.questions);
          setQuestionSource('gemini');
        } else if (!isMounted) {
          return; // Component unmounted, don't update state
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.warn('Failed to fetch AI questions, using fallback:', error);
        if (isMounted) {
          // Fallback to hardcoded questions
          const fallbackQuestions = getInterviewSession(targetJob);
          setQuestions(fallbackQuestions);
          setQuestionSource('fallback');
        }
      } finally {
        if (messageInterval) {
          clearInterval(messageInterval);
        }
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchQuestions();

    // Cleanup function
    return () => {
      isMounted = false;
      if (messageInterval) {
        clearInterval(messageInterval);
      }
    };
  }, [targetJob]);

  const currentQuestion = typeof currentStep === 'number' && questions.length > 0 ? questions[currentStep] : null;
  const score = answers.filter(a => a.correct).length;
  const passed = score >= PASSING_SCORE;

  const handleSubmitAnswer = () => {
    if (selectedOption === null || typeof currentStep !== 'number' || !currentQuestion) return;

    const correct = selectedOption === currentQuestion.correctIndex;
    const newAnswer: AnswerRecord = {
      questionIndex: currentStep,
      selectedOption,
      correct,
    };

    setAnswers([...answers, newAnswer]);
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setSelectedOption(null);

    if (typeof currentStep === 'number') {
      if (currentStep < 2) {
        setCurrentStep((currentStep + 1) as 0 | 1 | 2);
      } else {
        setCurrentStep('results');
      }
    }
  };

  const handleClose = () => {
    onComplete(passed);
  };

  const getOptionStyle = (index: number) => {
    if (!showFeedback) {
      // Not submitted yet - show selection state
      return selectedOption === index
        ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400'
        : 'border-emerald-500/30 text-emerald-500/70 hover:border-emerald-500 hover:bg-emerald-500/5 hover:text-emerald-500';
    }

    // After submission - show correct/incorrect
    const isCorrect = index === currentQuestion?.correctIndex;
    const wasSelected = selectedOption === index;

    if (isCorrect) {
      return 'border-emerald-500 bg-emerald-500/20 text-emerald-400';
    }
    if (wasSelected && !isCorrect) {
      return 'border-red-500 bg-red-500/20 text-red-400';
    }
    return 'border-gray-700 text-gray-600 opacity-50';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-2xl rounded border-2 border-emerald-500 bg-black p-6 shadow-xl shadow-emerald-500/20">
        {/* Header */}
        <div className="mb-6 border-b-2 border-emerald-500/30 pb-4">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-2xl font-bold text-emerald-500">// JOB INTERVIEW</h2>
            {!isLoading && typeof currentStep === 'number' && (
              <div className="flex gap-2">
                {[0, 1, 2].map(step => (
                  <div
                    key={step}
                    className={`h-3 w-3 rounded-full border-2 ${
                      step < currentStep
                        ? answers[step]?.correct
                          ? 'border-emerald-500 bg-emerald-500'
                          : 'border-red-500 bg-red-500'
                        : step === currentStep
                          ? 'border-cyan-400 bg-cyan-400'
                          : 'border-gray-600 bg-transparent'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
          <p className="font-mono text-sm text-emerald-500/70">
            Position: <span className="text-white">{targetJob.title}</span>
          </p>
          {!isLoading && (
            <p className="mt-1 font-mono text-xs text-emerald-500/50">
              {currentStep === 'results'
                ? 'Interview Complete'
                : `Question ${typeof currentStep === 'number' ? currentStep + 1 : 0} of 3 • Pass: ${PASSING_SCORE}/${questions.length} correct`}
              {questionSource === 'gemini' && (
                <span className="ml-2 text-cyan-400/60">⚡ AI-Generated</span>
              )}
            </p>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            {/* Terminal-style loading animation */}
            <div className="mb-6 flex items-center gap-2">
              <div className="h-4 w-4 animate-pulse rounded-full bg-emerald-500" />
              <div
                className="h-4 w-4 animate-pulse rounded-full bg-emerald-500"
                style={{ animationDelay: '0.2s' }}
              />
              <div
                className="h-4 w-4 animate-pulse rounded-full bg-emerald-500"
                style={{ animationDelay: '0.4s' }}
              />
            </div>

            {/* Loading message with terminal effect */}
            <div className="mb-4 rounded border border-emerald-500/30 bg-emerald-500/5 px-6 py-3">
              <p className="font-mono text-emerald-500">
                <span className="animate-pulse text-cyan-400">&gt;</span> {loadingMessage}
                <span className="ml-1 inline-block animate-pulse">_</span>
              </p>
            </div>

            {/* Progress bar */}
            <div className="h-1 w-64 overflow-hidden rounded bg-gray-800">
              <div className="h-full w-full origin-left animate-pulse bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-500" />
            </div>

            <p className="mt-4 font-mono text-xs text-gray-500">
              Preparing interview for Level {targetJob.level} {targetJob.path} position...
            </p>

            {/* Cancel button during loading */}
            <button
              onClick={onCancel}
              className="mt-6 rounded border border-red-500/50 px-4 py-2 font-mono text-xs text-red-500/70 transition-all hover:border-red-500 hover:bg-red-500/10 hover:text-red-500"
            >
              CANCEL
            </button>
          </div>
        )}

        {/* Question Phase */}
        {!isLoading && typeof currentStep === 'number' && currentQuestion && (
          <>
            {!showFeedback ? (
              <>
                {/* Question */}
                <div className="mb-6">
                  <p className="mb-4 font-mono text-lg text-white">{currentQuestion.question}</p>

                  {/* Options */}
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedOption(index)}
                        className={`w-full rounded border-2 p-3 text-left font-mono transition-all ${getOptionStyle(index)}`}
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
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    className="flex-1 rounded border-2 border-emerald-500 bg-emerald-500/10 px-4 py-2 font-mono text-sm font-bold text-emerald-500 transition-all hover:bg-emerald-500 hover:text-black disabled:cursor-not-allowed disabled:border-emerald-500/30 disabled:bg-transparent disabled:text-emerald-500/30"
                  >
                    {selectedOption === null ? '// SELECT AN ANSWER' : '>> SUBMIT ANSWER'}
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
                {/* Feedback After Answer */}
                <div className="mb-6">
                  <p className="mb-4 font-mono text-lg text-white">{currentQuestion.question}</p>

                  {/* Options with feedback */}
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <div
                        key={index}
                        className={`w-full rounded border-2 p-3 text-left font-mono ${getOptionStyle(index)}`}
                      >
                        <span className="mr-3 text-xs">[{String.fromCharCode(65 + index)}]</span>
                        {option}
                        {index === currentQuestion.correctIndex && (
                          <span className="ml-2 text-emerald-400">✓</span>
                        )}
                        {selectedOption === index && index !== currentQuestion.correctIndex && (
                          <span className="ml-2 text-red-400">✗</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explanation */}
                <div
                  className={`mb-6 rounded border-2 p-4 ${
                    answers[answers.length - 1]?.correct
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-red-500 bg-red-500/10'
                  }`}
                >
                  <p
                    className={`mb-2 font-mono text-lg font-bold ${
                      answers[answers.length - 1]?.correct ? 'text-emerald-500' : 'text-red-500'
                    }`}
                  >
                    {answers[answers.length - 1]?.correct ? '✓ CORRECT!' : '✗ INCORRECT'}
                  </p>
                  <p className="font-mono text-sm text-gray-300">{currentQuestion.explanation}</p>
                </div>

                {/* Next button */}
                <button
                  onClick={handleNextQuestion}
                  className="w-full rounded border-2 border-cyan-400 bg-cyan-400/10 px-4 py-2 font-mono text-sm font-bold text-cyan-400 transition-all hover:bg-cyan-400 hover:text-black"
                >
                  {currentStep < 2 ? '>> NEXT QUESTION' : '>> VIEW RESULTS'}
                </button>
              </>
            )}
          </>
        )}

        {/* Results Phase */}
        {!isLoading && currentStep === 'results' && (
          <>
            <div
              className={`mb-6 rounded border-2 p-6 text-center ${
                passed ? 'border-emerald-500 bg-emerald-500/10' : 'border-red-500 bg-red-500/10'
              }`}
            >
              <div className="mb-4 text-6xl">{passed ? '🎉' : '😔'}</div>
              <p className={`mb-2 font-mono text-3xl font-bold ${passed ? 'text-emerald-500' : 'text-red-500'}`}>
                {passed ? 'INTERVIEW PASSED!' : 'INTERVIEW FAILED'}
              </p>
              <p className="font-mono text-xl text-white">
                Score: <span className={passed ? 'text-emerald-400' : 'text-red-400'}>{score}</span>/
                {questions.length}
              </p>
            </div>

            {/* Answer Summary */}
            <div className="mb-6 space-y-2">
              <p className="font-mono text-xs text-gray-500">
                ANSWER BREAKDOWN
                {questionSource === 'gemini' && (
                  <span className="ml-2 text-cyan-400/60">• Questions powered by AI</span>
                )}
              </p>
              {answers.map((answer, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between rounded border p-2 ${
                    answer.correct ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-red-500/50 bg-red-500/5'
                  }`}
                >
                  <span className="font-mono text-sm text-gray-400">
                    Q{index + 1}: {questions[index].question.slice(0, 40)}...
                  </span>
                  <span className={`font-mono text-sm font-bold ${answer.correct ? 'text-emerald-400' : 'text-red-400'}`}>
                    {answer.correct ? '✓ Correct' : '✗ Wrong'}
                  </span>
                </div>
              ))}
            </div>

            {/* Result Message */}
            <div className="mb-6 rounded border border-gray-700 bg-gray-900/50 p-4">
              <p className="font-mono text-sm text-gray-300">
                {passed ? (
                  <>
                    Congratulations! You've demonstrated the skills needed for{' '}
                    <span className="text-emerald-400">{targetJob.title}</span>. Welcome to the team!
                  </>
                ) : (
                  <>
                    Unfortunately, you didn't meet the interview requirements for{' '}
                    <span className="text-red-400">{targetJob.title}</span>. Keep studying and try again next time.
                  </>
                )}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className={`w-full rounded border-2 px-4 py-3 font-mono text-sm font-bold transition-all ${
                passed
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black'
                  : 'border-gray-500 bg-gray-500/10 text-gray-400 hover:bg-gray-500 hover:text-black'
              }`}
            >
              &gt;&gt; CONTINUE
            </button>
          </>
        )}
      </div>
    </div>
  );
}
