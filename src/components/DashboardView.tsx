import React, { useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  Play, 
  Bot, 
  Plus, 
  ChevronRight, 
  FlaskConical, 
  FileText, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Task, TimetableSlot, LabRecord, Assignment, TabType, DayOfWeek } from '../types';

interface DashboardViewProps {
  tasks: Task[];
  timetable: TimetableSlot[];
  labs: LabRecord[];
  assignments: Assignment[];
  onToggleTask: (taskId: string) => void;
  onNavigateTab: (tab: TabType) => void;
  onOpenAddTask: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  timetable,
  labs,
  assignments,
  onToggleTask,
  onNavigateTab,
  onOpenAddTask,
}) => {
  // Current date formatting
  const today = new Date();
  const dateFormatted = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const dayNames: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDayIndex = today.getDay(); // 0 is Sunday, 1 is Monday ...
  const currentDayName: DayOfWeek = (currentDayIndex >= 1 && currentDayIndex <= 6)
    ? dayNames[currentDayIndex - 1]
    : 'Monday'; // Default to Monday if Sunday

  // Find classes today
  const todayClasses = useMemo(() => {
    return timetable
      .filter((slot) => slot.day === currentDayName)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [timetable, currentDayName]);

  // Current or upcoming class
  const activeClass = useMemo(() => {
    const nowTimeStr = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;
    
    // Check if in class right now
    const current = todayClasses.find(c => c.startTime <= nowTimeStr && c.endTime >= nowTimeStr);
    if (current) return { slot: current, status: 'in-progress' as const };

    // Else find next upcoming class today
    const upcoming = todayClasses.find(c => c.startTime > nowTimeStr);
    if (upcoming) return { slot: upcoming, status: 'upcoming' as const };

    // If none left today, take first of tomorrow
    return { slot: todayClasses[0] || null, status: 'first' as const };
  }, [todayClasses, today]);

  // Pending tasks
  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  // Urgent deadlines: Assignments & Labs with deadlines within next 5 days or overdue
  const urgentDeadlines = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      subject: string;
      type: 'assignment' | 'lab';
      deadline: string;
      daysRemaining: number;
      status: string;
    }> = [];

    const now = new Date().getTime();

    assignments.forEach((asg) => {
      if (asg.status !== 'submitted' && asg.status !== 'evaluated') {
        const d = new Date(asg.deadline).getTime();
        const diffDays = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
        list.push({
          id: asg.id,
          title: asg.title,
          subject: asg.subject,
          type: 'assignment',
          deadline: asg.deadline,
          daysRemaining: diffDays,
          status: asg.status,
        });
      }
    });

    labs.forEach((lab) => {
      if (lab.status === 'pending' || lab.status === 'written') {
        const d = new Date(lab.submissionDeadline).getTime();
        const diffDays = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
        list.push({
          id: lab.id,
          title: `Exp #${lab.experimentNumber}: ${lab.title}`,
          subject: lab.subject,
          type: 'lab',
          deadline: lab.submissionDeadline,
          daysRemaining: diffDays,
          status: lab.status,
        });
      }
    });

    return list.sort((a, b) => a.daysRemaining - b.daysRemaining).slice(0, 4);
  }, [assignments, labs]);

  // Engineering Quotes of the Day
  const quotes = [
    { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
    { text: "Premature optimization is the root of all evil in programming.", author: "Donald Knuth" },
    { text: "Consistency in daily lab prep beats 12 hours of pre-exam panic.", author: "B.Tech Golden Rule" },
    { text: "First solve the problem. Then write the code.", author: "John Johnson" },
  ];
  const dailyQuote = quotes[today.getDate() % quotes.length];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Top Welcome & Date Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/70 to-indigo-950/80 p-6 md:p-8 border border-blue-900/40 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{dateFormatted} • Semester Week 8</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Good day, Engineer! ⚡
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              You have <span className="text-blue-400 font-semibold">{pendingTasks.length} pending tasks</span> and{' '}
              <span className="text-amber-400 font-semibold">{urgentDeadlines.length} upcoming submissions</span>.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigateTab('timer')}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Focus Timer</span>
            </button>
            <button
              onClick={() => onNavigateTab('ai-mentor')}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 font-medium text-xs sm:text-sm transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>AI Doubt Solver</span>
            </button>
            <button
              onClick={onOpenAddTask}
              className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs sm:text-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Classes Today */}
        <div 
          onClick={() => onNavigateTab('timetable')}
          className="p-4 rounded-xl bg-[#0f172a]/70 border border-slate-800 hover:border-blue-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Classes Today</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{todayClasses.length}</span>
            <span className="text-xs text-slate-400">slots scheduled</span>
          </div>
          <p className="text-[11px] text-blue-400 mt-2 flex items-center">
            <span>View {currentDayName} schedule</span>
            <ChevronRight className="w-3 h-3 ml-0.5" />
          </p>
        </div>

        {/* Tasks Due */}
        <div 
          onClick={() => onNavigateTab('tasks')}
          className="p-4 rounded-xl bg-[#0f172a]/70 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Tasks Pending</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{pendingTasks.length}</span>
            <span className="text-xs text-slate-400">/ {tasks.length} total</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-2 flex items-center">
            <span>{completedTasks.length} completed</span>
            <ChevronRight className="w-3 h-3 ml-0.5" />
          </p>
        </div>

        {/* Lab Submissions */}
        <div 
          onClick={() => onNavigateTab('labs')}
          className="p-4 rounded-xl bg-[#0f172a]/70 border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Lab Records Due</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <FlaskConical className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">
              {labs.filter(l => l.status === 'pending' || l.status === 'written').length}
            </span>
            <span className="text-xs text-slate-400">pending sign</span>
          </div>
          <p className="text-[11px] text-amber-400 mt-2 flex items-center">
            <span>Viva check ready</span>
            <ChevronRight className="w-3 h-3 ml-0.5" />
          </p>
        </div>

        {/* B.Tech 75% Rule Alert */}
        <div 
          onClick={() => onNavigateTab('progress')}
          className="p-4 rounded-xl bg-[#0f172a]/70 border border-slate-800 hover:border-purple-500/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Attendance Safety</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">78.4%</span>
            <span className="text-xs text-emerald-400 font-medium">Safe (&gt;75%)</span>
          </div>
          <p className="text-[11px] text-purple-400 mt-2 flex items-center">
            <span>1 subject needs caution</span>
            <ChevronRight className="w-3 h-3 ml-0.5" />
          </p>
        </div>
      </div>

      {/* Main Grid: Left (Class Status & Tasks) | Right (Deadlines & Motivational Quote) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols wide on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active / Next Class Spotlight */}
          {activeClass.slot && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950/40 border border-blue-900/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    {activeClass.status === 'in-progress' ? 'Class Now in Progress' : 'Next Up On Timetable'}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md">
                  {activeClass.slot.startTime} - {activeClass.slot.endTime}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {activeClass.slot.subject}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {activeClass.slot.room} • {activeClass.slot.faculty}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg capitalize ${
                    activeClass.slot.type === 'lab' 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : activeClass.slot.type === 'tutorial'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {activeClass.slot.type}
                  </span>
                  <button
                    onClick={() => onNavigateTab('timetable')}
                    className="text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg border border-slate-700 transition-colors"
                  >
                    Full Schedule
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Today's Tasks Checklist */}
          <div className="p-5 rounded-2xl bg-[#0f172a]/70 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <span>Priority Checklist</span>
                  <span className="text-xs font-normal text-slate-400">({pendingTasks.length} left)</span>
                </h2>
                <p className="text-xs text-slate-400">Engineering deliverables and daily practice</p>
              </div>
              <button
                onClick={onOpenAddTask}
                className="flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Task</span>
              </button>
            </div>

            {tasks.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                No tasks logged yet. Click "New Task" to add your first engineering goal!
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-start justify-between p-3 rounded-xl border transition-all ${
                      task.completed
                        ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <button
                        onClick={() => onToggleTask(task.id)}
                        className="mt-0.5 text-slate-400 hover:text-blue-400 transition-colors focus:outline-none"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-500" />
                        )}
                      </button>
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            task.completed ? 'line-through text-slate-400' : 'text-slate-100'
                          }`}
                        >
                          {task.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-[11px] text-slate-400">
                            {task.subject}
                          </span>
                          <span className="text-[10px] text-slate-500">•</span>
                          <span className="text-[11px] text-slate-400 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {task.dueDate}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 text-[10px] font-semibold rounded capitalize ${
                              task.priority === 'high'
                                ? 'bg-red-500/20 text-red-300'
                                : task.priority === 'medium'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-green-500/20 text-green-300'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tasks.length > 5 && (
              <button
                onClick={() => onNavigateTab('tasks')}
                className="w-full mt-3 py-2 text-center text-xs text-blue-400 hover:text-blue-300 font-medium"
              >
                View all {tasks.length} tasks →
              </button>
            )}
          </div>
        </div>

        {/* Right Column (Upcoming Deadlines & Quote) */}
        <div className="space-y-6">
          
          {/* Upcoming Deadlines Widget */}
          <div className="p-5 rounded-2xl bg-[#0f172a]/70 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Upcoming Deadlines</span>
              </h3>
              <button
                onClick={() => onNavigateTab('labs')}
                className="text-xs text-blue-400 hover:underline"
              >
                View all
              </button>
            </div>

            {urgentDeadlines.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                All assignments and lab reports are up to date! 🎉
              </p>
            ) : (
              <div className="space-y-2.5">
                {urgentDeadlines.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="pr-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                          {item.type === 'lab' ? (
                            <FlaskConical className="w-3 h-3 text-cyan-400 inline" />
                          ) : (
                            <FileText className="w-3 h-3 text-blue-400 inline" />
                          )}
                          <span>{item.subject}</span>
                        </span>
                        <h4 className="text-xs font-semibold text-slate-200 mt-0.5 line-clamp-1">
                          {item.title}
                        </h4>
                      </div>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full whitespace-nowrap ${
                          item.daysRemaining <= 2
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : item.daysRemaining <= 5
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {item.daysRemaining <= 0
                          ? 'DUE TODAY'
                          : `${item.daysRemaining}d left`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Doubt Solver Teaser Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-800/40 relative overflow-hidden">
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Gemini 3.1 AI Copilot</span>
            </div>
            <h3 className="text-sm font-bold text-white">Stuck on a DSA Bug or Lab Viva?</h3>
            <p className="text-xs text-slate-300 mt-1">
              Ask our multi-turn Gemini tutor or snap a photo of your circuit/code with High Thinking reasoning.
            </p>
            <button
              onClick={() => onNavigateTab('ai-mentor')}
              className="mt-3.5 w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Launch AI Doubt Solver</span>
            </button>
          </div>

          {/* Motivational Engineer Quote */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
            <div className="flex items-center space-x-2 text-blue-400 font-semibold mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Engineering Maxim</span>
            </div>
            <blockquote className="italic text-slate-300">
              "{dailyQuote.text}"
            </blockquote>
            <p className="mt-1 text-right text-[11px] text-slate-400 font-medium">
              — {dailyQuote.author}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
