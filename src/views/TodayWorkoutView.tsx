import React from 'react';
import { Play, Plus, Calendar, Flame, CheckCircle2, Trophy, Clock, ArrowRight, Dumbbell, Sparkles } from 'lucide-react';
import { UserSettings, WeekSchedule, WorkoutSession, WorkoutTemplate } from '../types/gym';
import { DAYS_ZH, SHORT_DAYS_ZH } from '../utils/translations';
import { formatDurationHuman, formatVolume } from '../utils/calculations';

interface TodayWorkoutViewProps {
  schedule: WeekSchedule;
  templates: WorkoutTemplate[];
  sessions: WorkoutSession[];
  onStartTemplateWorkout: (template: WorkoutTemplate) => void;
  onStartEmptyWorkout: () => void;
  onNavigateToTab: (tab: 'plan' | 'history' | 'stats' | 'library') => void;
  onSelectTemplate: (template: WorkoutTemplate) => void;
  onOpenSessionDetail: (session: WorkoutSession) => void;
}

export const TodayWorkoutView: React.FC<TodayWorkoutViewProps> = ({
  schedule,
  templates,
  sessions,
  onStartTemplateWorkout,
  onStartEmptyWorkout,
  onNavigateToTab,
  onSelectTemplate,
  onOpenSessionDetail,
}) => {
  const today = new Date();
  const currentDayIndex = today.getDay(); // 0 = Sun, 1 = Mon ...
  const scheduledTemplateId = schedule[currentDayIndex];
  const scheduledTemplate = templates.find((t) => t.id === scheduledTemplateId);

  // Compute week statistics (Monday to Sunday)
  const startOfWeek = new Date(today);
  const dayOffset = (today.getDay() + 6) % 7; // Monday as 0
  startOfWeek.setDate(today.getDate() - dayOffset);
  startOfWeek.setHours(0, 0, 0, 0);

  const thisWeekSessions = sessions.filter(
    (s) => new Date(s.date).getTime() >= startOfWeek.getTime()
  );

  const weekVolume = thisWeekSessions.reduce((sum, s) => sum + (s.totalVolume || 0), 0);
  const weekSets = thisWeekSessions.reduce((sum, s) => sum + (s.completedSets || 0), 0);
  const weekSessionsCount = thisWeekSessions.length;

  // Most recent past session
  const lastSession = sessions.length > 0
    ? [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24 md:pb-12">
      {/* Hero: Today's Assignment Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#131b2e] via-[#0f172a] to-[#0a0f1d] border border-slate-800/90 p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Calendar className="w-4 h-4" />
              <span>
                {DAYS_ZH[currentDayIndex]} · {today.getMonth() + 1}月{today.getDate()}日
              </span>
            </div>

            <button
              onClick={() => onNavigateToTab('plan')}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 group"
            >
              <span>调整计划</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {scheduledTemplate ? (
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {scheduledTemplate.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                  {scheduledTemplate.description || '按计划执行今日专项力量刺激与肌群轰炸'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={() => onStartTemplateWorkout(scheduledTemplate)}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 active:scale-[0.98] transition-all"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>开始今天的训练</span>
                </button>

                <button
                  onClick={onStartEmptyWorkout}
                  className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-200 hover:text-white font-medium text-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>开一场自由训练</span>
                </button>
              </div>

              {/* Preview of Exercises in Template */}
              <div className="pt-2">
                <span className="text-[11px] text-slate-500 block mb-1.5">包含动作 ({scheduledTemplate.exercises.length})</span>
                <div className="flex flex-wrap gap-1.5">
                  {scheduledTemplate.exercises.map((ex, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/50 text-xs text-slate-300"
                    >
                      {ex.exerciseZh || ex.exerciseName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  今日计划休息
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                  肌肉在超量恢复中增长。如果你精力充沛，也可以随时开启一场自定义自由训练！
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={onStartEmptyWorkout}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 active:scale-[0.98] transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>开一场自由训练</span>
                </button>
                <button
                  onClick={() => onNavigateToTab('plan')}
                  className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-200 hover:text-white font-medium text-xs transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span>选择已有模板</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Progress KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0f172a] border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>本周训练容量</span>
            <Flame className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight tabular-nums">
            {formatVolume(weekVolume)} <span className="text-xs font-normal text-slate-400 font-sans">kg</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">周一至今日累计负荷</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#0f172a] border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>本周出勤</span>
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight tabular-nums">
            {weekSessionsCount} <span className="text-xs font-normal text-slate-400 font-sans">次</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">本周共完成 {weekSets} 组</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#0f172a] border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>总记录次数</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight tabular-nums">
            {sessions.length} <span className="text-xs font-normal text-slate-400 font-sans">次</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">历史持续沉淀</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#0f172a] border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>可用训练动作</span>
            <Dumbbell className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight tabular-nums">
            1,300+
          </div>
          <div className="text-[11px] text-slate-500 mt-1">完整离线动作库</div>
        </div>
      </div>

      {/* Week Schedule Overview Quick Bar */}
      <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span>本周日程</span>
          </h2>
          <button
            onClick={() => onNavigateToTab('plan')}
            className="text-xs text-emerald-400 hover:underline"
          >
            编辑排期
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
          {[1, 2, 3, 4, 5, 6, 0].map((dayIdx) => {
            const isCurrent = dayIdx === currentDayIndex;
            const tplId = schedule[dayIdx];
            const tpl = templates.find((t) => t.id === tplId);

            return (
              <div
                key={dayIdx}
                className={`p-2 sm:p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-sm'
                    : 'bg-slate-900/50 border-slate-800/80 text-slate-400'
                }`}
              >
                <div className={`text-[11px] font-semibold ${isCurrent ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {SHORT_DAYS_ZH[dayIdx]}
                </div>
                <div className="text-xs font-medium truncate mt-1 text-slate-200">
                  {tpl ? tpl.name.split(' ')[0] : '休息'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Start from Templates */}
      <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white">快速开练 / 经典模板</h2>
          <button
            onClick={() => onNavigateToTab('plan')}
            className="text-xs text-slate-400 hover:text-white"
          >
            查看全部 ({templates.length})
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {templates.slice(0, 3).map((tpl) => (
            <div
              key={tpl.id}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <h3 className="font-bold text-sm text-white">{tpl.name}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                  {tpl.description || `${tpl.exercises.length} 个训练动作`}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2">
                  <span>{tpl.exercises.length} 动作</span>
                  <span>·</span>
                  <span className="truncate">
                    {tpl.exercises.slice(0, 2).map((e) => e.exerciseZh || e.exerciseName).join(', ')}...
                  </span>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => onSelectTemplate(tpl)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  查看动作
                </button>
                <button
                  onClick={() => onStartTemplateWorkout(tpl)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs shadow-sm transition-colors"
                >
                  <Play className="w-3 h-3 fill-slate-950" />
                  <span>开练</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Last Session Recap */}
      {lastSession && (
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400">上次训练回顾</span>
            <button
              onClick={() => onNavigateToTab('history')}
              className="text-xs text-emerald-400 hover:underline"
            >
              全部历史
            </button>
          </div>

          <div
            onClick={() => onOpenSessionDetail(lastSession)}
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800 cursor-pointer transition-colors"
          >
            <div>
              <div className="font-bold text-sm text-white">{lastSession.title}</div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <span>{new Date(lastSession.date).toLocaleDateString()}</span>
                <span>·</span>
                <span>{formatDurationHuman(lastSession.duration)}</span>
                <span>·</span>
                <span className="text-emerald-400 font-mono font-medium">
                  {formatVolume(lastSession.totalVolume)} kg
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500" />
          </div>
        </div>
      )}
    </div>
  );
};
