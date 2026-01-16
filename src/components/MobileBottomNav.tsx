'use client';

type MobileTab = 'home' | 'work' | 'shop' | 'invest' | 'menu';

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
}

export function MobileBottomNav({ activeTab, onTabChange }: MobileBottomNavProps) {
  const tabs: { id: MobileTab; icon: string; label: string }[] = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'work', icon: '💼', label: 'Work' },
    { id: 'shop', icon: '🛒', label: 'Shop' },
    { id: 'invest', icon: '📈', label: 'Invest' },
    { id: 'menu', icon: '☰', label: 'Menu' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-800 bg-gray-950/95 backdrop-blur-lg safe-area-inset-bottom">
      <div className="flex items-stretch">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              onTabChange(tab.id);
            }}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-950/50 text-emerald-400'
                : 'text-gray-500 hover:text-gray-300 active:bg-gray-900'
            }`}
          >
            <span className={`text-xl ${activeTab === tab.id ? 'scale-110' : ''} transition-transform`}>
              {tab.icon}
            </span>
            <span className="font-mono text-[10px] font-bold">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
