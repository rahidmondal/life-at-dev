'use client';

import { useGame } from '@/context/GameContext';
import { getNextJobSuggestion } from '@/logic/yearEnd';
import { useState } from 'react';

export function StatsPanel() {
  const { state, saveGameManually, isStorageReady } = useGame();
  const { stats } = state;
  const [isSaving, setIsSaving] = useState(false);

  const nextJob = getNextJobSuggestion(stats.currentJob);

  const handleSave = async () => {
    setIsSaving(true);
    await saveGameManually();
    setTimeout(() => {
      setIsSaving(false);
    }, 300);
  };

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto border-r border-gray-800 bg-black p-3 sm:gap-6 sm:p-4 lg:p-6">
      {/* Save Button - Desktop Only */}
      {isStorageReady && (
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`hidden w-full rounded-lg border-2 px-4 py-3 font-mono text-sm font-bold transition-all lg:block ${
            isSaving
              ? 'animate-pulse border-emerald-400 bg-emerald-500 text-black'
              : 'border-emerald-500 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black'
          }`}
        >
          {isSaving ? '💾 Saving...' : '💾 Save Game'}
        </button>
      )}

      {/* Header */}
      <div className="space-y-2 border-b border-emerald-500/20 pb-3">
        <p className="font-mono text-xs text-gray-500">📅 Age: {stats.age}</p>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-gray-400">💼</span>
          <p className="font-mono text-xs font-bold text-emerald-400 sm:text-sm">{stats.currentJob.title}</p>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-gray-500">💵 Salary:</span>
          <span className="font-mono font-bold text-emerald-400">
            ${stats.currentJob.yearlyPay.toLocaleString()}/yr
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-gray-500">🏠 Rent:</span>
          <span className="font-mono font-bold text-red-400">-${stats.currentJob.rentPerYear.toLocaleString()}/yr</span>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs font-bold text-gray-400">📅 YEARLY SCHEDULE</p>
          <p className="font-mono text-xs text-cyan-400">Week {52 - stats.weeks} / 52</p>
        </div>

        {/* Progress bar */}
        <div className="relative h-3 overflow-hidden rounded-full bg-gray-800">
          <div
            className="h-full bg-linear-to-r from-cyan-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${String(((52 - stats.weeks) / 52) * 100)}%` }}
          />
        </div>

        <p className="text-center font-mono text-xl font-bold text-cyan-400 sm:text-2xl">{stats.weeks}</p>
        <p className="text-center font-mono text-xs text-gray-500">weeks remaining</p>
      </div>

      {/* Energy */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs font-bold text-gray-400">⚡ Energy</p>
          <p className="font-mono text-xs text-cyan-400">{stats.energy}/100</p>
        </div>
        <div className="relative h-3 overflow-hidden rounded-full bg-gray-800">
          <div
            className="h-full bg-linear-to-r from-cyan-600 to-cyan-400 transition-all duration-300"
            style={{ width: `${String(stats.energy)}%` }}
          />
        </div>
      </div>

      {/* Stress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs font-bold text-gray-400">😰 Stress</p>
          <p className="font-mono text-xs text-red-400">{stats.stress}/100</p>
        </div>
        <div className="relative h-3 overflow-hidden rounded-full bg-gray-800">
          <div
            className={`h-full transition-all duration-300 ${
              stats.stress >= 80
                ? 'bg-linear-to-r from-red-600 to-red-500'
                : stats.stress >= 50
                  ? 'bg-linear-to-r from-orange-600 to-orange-500'
                  : 'bg-linear-to-r from-yellow-600 to-yellow-500'
            }`}
            style={{ width: `${String(stats.stress)}%` }}
          />
        </div>
        {stats.stress >= 90 && <p className="font-mono text-xs text-red-400">⚠️ Critical! Near burnout!</p>}
      </div>

      {/* Money */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs font-bold text-gray-400">💰 Money</p>
          <p
            className={`font-mono text-xs ${stats.money < 0 ? 'text-red-400' : stats.money < 500 ? 'text-yellow-400' : 'text-green-400'}`}
          >
            ${stats.money.toLocaleString()}
          </p>
        </div>
        <div className="rounded bg-gray-900 p-2 sm:p-3">
          <p className="text-center font-mono text-xl font-bold text-green-400 sm:text-2xl">
            ${stats.money < 0 ? '-' : ''}
            {Math.abs(stats.money).toLocaleString()}
          </p>
        </div>
        {stats.money < 100 && <p className="font-mono text-xs text-red-400">⚠️ Low funds! Watch out!</p>}
      </div>

      {/* Skills  */}
      <div className="space-y-2">
        <p className="font-mono text-xs font-bold text-gray-400">💻 Coding Skill</p>
        <div className="relative h-3 overflow-hidden rounded-full bg-gray-800">
          <div
            className="h-full bg-linear-to-r from-emerald-600 to-emerald-400 transition-all duration-300"
            style={{ width: `${String((stats.coding / 1000) * 100)}%` }}
          />
        </div>
        <p className="font-mono text-xs text-emerald-400">{stats.coding}/1000</p>
      </div>

      <div className="space-y-2">
        <p className="font-mono text-xs font-bold text-gray-400">⭐ Reputation</p>
        <div className="relative h-3 overflow-hidden rounded-full bg-gray-800">
          <div
            className="h-full bg-linear-to-r from-yellow-600 to-yellow-400 transition-all duration-300"
            style={{ width: `${String((stats.reputation / 1000) * 100)}%` }}
          />
        </div>
        <p className="font-mono text-xs text-yellow-400">{stats.reputation}/1000</p>
      </div>

      {/* Next Unlock */}
      <div className="mt-auto space-y-2 border-t border-gray-800 pt-3 sm:pt-4">
        <p className="font-mono text-xs font-bold text-gray-500">🔓 NEXT UNLOCK</p>
        {nextJob ? (
          <div className="space-y-1 rounded bg-gray-900 p-2 sm:p-3">
            <p className="font-mono text-xs font-bold text-purple-400 sm:text-sm">{nextJob.title}</p>
            <p className="font-mono text-xs text-gray-400">
              Requires: {nextJob.requirements.coding} skill, {nextJob.requirements.reputation} reputation
            </p>
            <p className="font-mono text-xs font-bold text-green-400">
              Salary: ${nextJob.yearlyPay.toLocaleString()}/year
            </p>
          </div>
        ) : (
          <p className="font-mono text-xs text-gray-500">Max level reached!</p>
        )}
      </div>

      {/* Career Stats */}
      <div className="space-y-2 border-t border-gray-800 pt-3 sm:pt-4">
        <p className="font-mono text-xs font-bold text-gray-500">📊 CAREER STATS</p>
        <div className="space-y-1">
          <p className="font-mono text-xs text-gray-400">Years Worked: {stats.yearsWorked}</p>
          <p className="font-mono text-xs text-gray-400">Total Earned: ${stats.totalEarned.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
