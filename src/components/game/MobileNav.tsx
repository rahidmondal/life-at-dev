'use client';

import type { ActionCategory } from '../../types/actions';
import { BookOpenIcon, BriefcaseIcon, CoffeeIcon, PiggyBankIcon, UsersIcon } from '../ui/icons';

const CATEGORIES: { id: ActionCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'SKILL', label: 'Skill', icon: <BookOpenIcon size={20} /> },
  { id: 'WORK', label: 'Work', icon: <BriefcaseIcon size={20} /> },
  { id: 'NETWORK', label: 'Network', icon: <UsersIcon size={20} /> },
  { id: 'RECOVER', label: 'Recover', icon: <CoffeeIcon size={20} /> },
  { id: 'INVEST', label: 'Invest', icon: <PiggyBankIcon size={20} /> },
];

interface MobileNavProps {
  activeCategory: string | null;
  onCategorySelect: (category: string) => void;
}

/**
 * MobileNav: Bottom navigation bar for mobile.
 * Tapping a category opens the action sheet.
 */
export function MobileNav({ activeCategory, onCategorySelect }: MobileNavProps) {
  return (
    <nav className="shrink-0 sticky bottom-0 z-30 bg-[#161B22] border-t border-[#30363D] safe-area-inset-bottom">
      <div className="flex items-center justify-around py-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              onCategorySelect(cat.id);
            }}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all active:scale-95 ${
              activeCategory === cat.id ? 'text-[#39D353] bg-[#39D353]/10' : 'text-[#8B949E] hover:text-[#C9D1D9]'
            }`}
          >
            {cat.icon}
            <span className="text-[10px] font-medium">{cat.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
