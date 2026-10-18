import React from 'react';
import { Dumbbell, Calendar, BookOpen, History, BarChart3, Settings, Play, Calculator } from 'lucide-react';
import { WorkoutSession } from '../types/gym';
import { formatDurationTimer } from '../utils/calculations';

export type NavTab = 'workout' | 'plan' | 'library' | 'history' | 'stats' | 'tools' | 'settings';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeWorkout: WorkoutSession | null;
  activeElapsedSeconds: number;
  onOpenActiveWorkout: () => void;
  onOpenPlateCalc: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  activeWorkout,
  activeElapsedSeconds,
  onOpenActiveWorkout,
  onOpenPlateCalc,
}) => {
  return (
    <>
      {/* Desktop Top Header (Strict 3-zone contract) */}
      <header className="sticky top-0 z-30 w-full bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab('workout')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white font-sans whitespace-nowrap">
                  GymLog
                </span>
                <span className="text-[10px] text-emerald-400 font-medium tracking-wide">
                  专业力量记录
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => onSelectTab('workout')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'workout'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              训练
            </button>
            <button
              onClick={() => onSelectTab('plan')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'plan'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              计划
            </button>
            <button
              onClick={() => onSelectTab('library')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'library'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              动作库
            </button>
            <button
              onClick={() => onSelectTab('history')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'history'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              历史
            </button>
            <button
              onClick={() => onSelectTab('stats')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'stats'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              数据统计
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenPlateCalc}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors whitespace-nowrap shrink-0"
              title="杠铃片计算器"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-400" />
              <span>杠铃配重</span>
            </button>

            {activeWorkout ? (
              <button
                onClick={onOpenActiveWorkout}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all animate-pulse whitespace-nowrap shrink-0"
              >
                <div className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                <span>进行中 {formatDurationTimer(activeElapsedSeconds)}</span>
              </button>
            ) : (
              <button
                onClick={() => onSelectTab('settings')}
                className={`p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${
                  currentTab === 'settings' ? 'text-emerald-400 bg-slate-800' : ''
                }`}
                title="设置"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Tab Bar (thumb-zone ergonomics, minimum 44px hitboxes) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c121f]/95 backdrop-blur-md border-t border-slate-800/90 pb-safe">
        <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-2">
          <button
            onClick={() => onSelectTab('workout')}
            className={`flex flex-col items-center justify-center min-h-[48px] transition-colors ${
              currentTab === 'workout' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Dumbbell className="w-5 h-5 mb-1" />
            <span className="text-[11px] tracking-tight">训练</span>
          </button>

          <button
            onClick={() => onSelectTab('plan')}
            className={`flex flex-col items-center justify-center min-h-[48px] transition-colors ${
              currentTab === 'plan' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-5 h-5 mb-1" />
            <span className="text-[11px] tracking-tight">计划</span>
          </button>

          <button
            onClick={() => onSelectTab('library')}
            className={`flex flex-col items-center justify-center min-h-[48px] transition-colors ${
              currentTab === 'library' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-5 h-5 mb-1" />
            <span className="text-[11px] tracking-tight">动作库</span>
          </button>

          <button
            onClick={() => onSelectTab('history')}
            className={`flex flex-col items-center justify-center min-h-[48px] transition-colors ${
              currentTab === 'history' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-5 h-5 mb-1" />
            <span className="text-[11px] tracking-tight">历史</span>
          </button>

          <button
            onClick={() => onSelectTab('stats')}
            className={`flex flex-col items-center justify-center min-h-[48px] transition-colors ${
              currentTab === 'stats' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-5 h-5 mb-1" />
            <span className="text-[11px] tracking-tight">数据</span>
          </button>
        </div>
      </div>
    </>
  );
};
