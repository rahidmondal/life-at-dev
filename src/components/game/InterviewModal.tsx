'use client';

import type { InterviewQuestion } from '../../data/interviews';
import { JOB_REGISTRY } from '../../data/tracks';
import { useGameStore } from '../../store/useGameStore';
import { XIcon } from '../ui/icons';

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const PASSING_SCORE = 2;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function InterviewModal() {
  const {
    isInterviewOpen,
    currentInterviewJobId,
    interviewQuestions,
    currentQuestionIndex,
    correctAnswersCount,
    interviewAnswers,
    showInterviewFeedback,
    interviewPhase,
    submitInterviewAnswer,
    advanceInterviewQuestion,
    completeInterview,
    closeInterview,
  } = useGameStore();

  if (!isInterviewOpen || !currentInterviewJobId) return null;

  const questions = interviewQuestions;
  const answers = interviewAnswers;
  const qIndex = currentQuestionIndex;
  const score = correctAnswersCount;
  const phase = interviewPhase;
  const showFeedback = showInterviewFeedback;
  const onSubmit = submitInterviewAnswer;
  const onAdvance = advanceInterviewQuestion;
  const onComplete = completeInterview;
  const onClose = closeInterview;

  const jobId = currentInterviewJobId;
  const targetJob = JOB_REGISTRY[jobId];
  const jobTitle = targetJob.title;
  const currentQuestion: InterviewQuestion | undefined = questions[qIndex];
  const passed = score >= PASSING_SCORE;
  const lastAnswer: { selectedOption: number; correct: boolean } | undefined = answers[answers.length - 1];

  // ─── Option styling ──────────────────────────────────────────────────────
  function getOptionStyle(index: number) {
    if (!showFeedback) {
      return 'border-[#39D353]/30 text-[#39D353]/70 hover:border-[#39D353] hover:bg-[#39D353]/5 hover:text-[#39D353] cursor-pointer';
    }

    const isCorrect = index === currentQuestion?.correctIndex;
    const wasSelected = lastAnswer?.selectedOption === index;

    if (isCorrect) {
      return 'border-[#39D353] bg-[#39D353]/20 text-[#39D353]';
    }
    if (wasSelected) {
      return 'border-[#FF7B72] bg-[#FF7B72]/20 text-[#FF7B72]';
    }
    return 'border-[#30363D] text-[#484F58] opacity-50';
  }

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border-2 border-[#39D353] bg-[#0D1117] shadow-[0_0_40px_rgba(57,211,83,0.2)]">
        {/* ── Header ── */}
        <div className="border-b-2 border-[#39D353]/30 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-lg font-bold text-[#39D353] sm:text-xl">{'// JOB INTERVIEW'}</h2>
            <div className="flex items-center gap-3">
              {/* Progress dots */}
              {phase === 'question' && (
                <div className="flex gap-1.5">
                  {[0, 1, 2].map(step => (
                    <div
                      key={step}
                      className={`h-2.5 w-2.5 rounded-full border-2 sm:h-3 sm:w-3 ${
                        step < qIndex
                          ? answers[step]?.correct
                            ? 'border-[#39D353] bg-[#39D353]'
                            : 'border-[#FF7B72] bg-[#FF7B72]'
                          : step === qIndex
                            ? 'border-[#58A6FF] bg-[#58A6FF]'
                            : 'border-[#484F58] bg-transparent'
                      }`}
                    />
                  ))}
                </div>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#161B22] flex items-center justify-center text-[#8B949E] hover:text-[#C9D1D9] hover:bg-[#30363D] transition-colors"
              >
                <XIcon size={16} />
              </button>
            </div>
          </div>
          <p className="font-mono text-xs text-[#39D353]/70 mt-1">
            Position: <span className="text-[#C9D1D9]">{jobTitle}</span>
          </p>
          {phase === 'question' && (
            <p className="font-mono text-[10px] text-[#8B949E] mt-1">
              Question {qIndex + 1} of 3 &bull; Pass: {PASSING_SCORE}/3 correct
            </p>
          )}
        </div>

        {/* ── Question Phase ── */}
        {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime guard for question phase */}
        {phase === 'question' && currentQuestion && !showFeedback && (
          <div className="px-4 py-4 sm:px-6 sm:py-6">
            <p className="font-mono text-base text-[#C9D1D9] mb-5 sm:text-lg">{currentQuestion.question}</p>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onSubmit(index);
                  }}
                  className={`w-full rounded-lg border-2 p-3 text-left font-mono text-sm transition-all ${getOptionStyle(index)}`}
                >
                  <span className="mr-3 text-xs opacity-70">[{String.fromCharCode(65 + index)}]</span>
                  {option}
                </button>
              ))}
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={onClose}
                className="rounded-lg border-2 border-[#FF7B72]/50 px-4 py-2 font-mono text-xs text-[#FF7B72]/70 transition-all hover:border-[#FF7B72] hover:bg-[#FF7B72]/10 hover:text-[#FF7B72]"
              >
                CANCEL
              </button>
            </div>
          </div>
        )}

        {/* ── Feedback After Answer ── */}
        {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime guard for feedback phase */}
        {phase === 'question' && currentQuestion && showFeedback && (
          <div className="px-4 py-4 sm:px-6 sm:py-6">
            <p className="font-mono text-base text-[#C9D1D9] mb-5 sm:text-lg">{currentQuestion.question}</p>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`w-full rounded-lg border-2 p-3 text-left font-mono text-sm ${getOptionStyle(index)}`}
                >
                  <span className="mr-3 text-xs opacity-70">[{String.fromCharCode(65 + index)}]</span>
                  {option}
                  {index === currentQuestion.correctIndex && <span className="ml-2 text-[#39D353]">&#10003;</span>}
                  {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- runtime guard */}
                  {lastAnswer?.selectedOption === index && index !== currentQuestion.correctIndex && (
                    <span className="ml-2 text-[#FF7B72]">&#10007;</span>
                  )}
                </div>
              ))}
            </div>

            {/* Explanation */}
            {/* eslint-disable @typescript-eslint/no-unnecessary-condition -- runtime guards for lastAnswer */}
            <div
              className={`mt-5 rounded-lg border-2 p-4 ${
                lastAnswer?.correct ? 'border-[#39D353] bg-[#39D353]/10' : 'border-[#FF7B72] bg-[#FF7B72]/10'
              }`}
            >
              <p
                className={`mb-1 font-mono text-sm font-bold ${
                  lastAnswer?.correct ? 'text-[#39D353]' : 'text-[#FF7B72]'
                }`}
              >
                {lastAnswer?.correct ? '✓ CORRECT!' : '✗ INCORRECT'}
              </p>
              {/* eslint-enable @typescript-eslint/no-unnecessary-condition */}
              <p className="font-mono text-xs text-[#8B949E]">{currentQuestion.explanation}</p>
            </div>

            {/* Next button */}
            <button
              onClick={onAdvance}
              className="mt-4 w-full rounded-lg border-2 border-[#58A6FF] bg-[#58A6FF]/10 px-4 py-2.5 font-mono text-sm font-bold text-[#58A6FF] transition-all hover:bg-[#58A6FF]/20"
            >
              {qIndex < 2 ? '>> NEXT QUESTION' : '>> VIEW RESULTS'}
            </button>
          </div>
        )}

        {/* ── Results Phase ── */}
        {phase === 'results' && (
          <div className="px-4 py-4 sm:px-6 sm:py-6">
            {/* Score Banner */}
            <div
              className={`mb-5 rounded-lg border-2 p-6 text-center ${
                passed ? 'border-[#39D353] bg-[#39D353]/10' : 'border-[#FF7B72] bg-[#FF7B72]/10'
              }`}
            >
              <div className="mb-3 text-5xl">{passed ? '🎉' : '😔'}</div>
              <p className={`mb-1 font-mono text-2xl font-bold ${passed ? 'text-[#39D353]' : 'text-[#FF7B72]'}`}>
                {passed ? 'INTERVIEW PASSED!' : 'INTERVIEW FAILED'}
              </p>
              <p className="font-mono text-lg text-[#C9D1D9]">
                Score: <span className={passed ? 'text-[#39D353]' : 'text-[#FF7B72]'}>{score}</span>
                /3
              </p>
            </div>

            {/* Answer Summary */}
            <div className="mb-5 space-y-2">
              <p className="font-mono text-[10px] text-[#8B949E] uppercase tracking-wider">Answer Breakdown</p>
              {answers.map((answer, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between rounded-lg border p-2.5 ${
                    answer.correct ? 'border-[#39D353]/50 bg-[#39D353]/5' : 'border-[#FF7B72]/50 bg-[#FF7B72]/5'
                  }`}
                >
                  <span className="font-mono text-xs text-[#8B949E] truncate mr-2">
                    Q{index + 1}: {questions[index]?.question.slice(0, 40)}...
                  </span>
                  <span
                    className={`font-mono text-xs font-bold shrink-0 ${
                      answer.correct ? 'text-[#39D353]' : 'text-[#FF7B72]'
                    }`}
                  >
                    {answer.correct ? '✓ Correct' : '✗ Wrong'}
                  </span>
                </div>
              ))}
            </div>

            {/* Result Message */}
            <div className="mb-5 rounded-lg border border-[#30363D] bg-[#161B22] p-4">
              <p className="font-mono text-sm text-[#8B949E]">
                {passed ? (
                  <>
                    Congratulations! You&apos;ve demonstrated the skills needed for{' '}
                    <span className="text-[#39D353]">{jobTitle}</span>. Welcome to the team!
                  </>
                ) : (
                  <>
                    Unfortunately, you didn&apos;t meet the requirements for{' '}
                    <span className="text-[#FF7B72]">{jobTitle}</span>. Keep studying and try again next time.
                  </>
                )}
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={onComplete}
              className={`w-full rounded-lg border-2 px-4 py-3 font-mono text-sm font-bold transition-all ${
                passed
                  ? 'border-[#39D353] bg-[#39D353]/10 text-[#39D353] hover:bg-[#39D353]/20 hover:shadow-[0_0_15px_rgba(57,211,83,0.2)]'
                  : 'border-[#484F58] bg-[#30363D]/30 text-[#8B949E] hover:bg-[#30363D]/50'
              }`}
            >
              {passed ? '>> ACCEPT JOB' : '>> CONTINUE'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
