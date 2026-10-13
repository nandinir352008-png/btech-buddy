import React, { useState } from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  Plus, 
  Minus, 
  Sparkles, 
  FlaskConical, 
  FileText,
  Clock,
  TrendingUp
} from 'lucide-react';
import { Task, LabRecord, Assignment, TimerSession, SubjectAttendance } from '../types';

interface ProgressDashboardViewProps {
  tasks: Task[];
  labs: LabRecord[];
  assignments: Assignment[];
  timerLogs: TimerSession[];
  attendance: SubjectAttendance[];
  onUpdateAttendance: (id: string, attended: number, total: number) => void;
}

export const ProgressDashboardView: React.FC<ProgressDashboardViewProps> = ({
  tasks,
  labs,
  assignments,
  timerLogs,
  attendance,
  onUpdateAttendance,
}) => {
  // Task Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const taskPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Lab Stats
  const signedLabs = labs.filter((l) => l.status === 'signed').length;
  const labPercent = labs.length > 0 ? Math.round((signedLabs / labs.length) * 100) : 0;

  // Assignment Stats
  const submittedAsgs = assignments.filter((a) => a.status === 'submitted' || a.status === 'evaluated').length;
  const asgPercent = assignments.length > 0 ? Math.round((submittedAsgs / assignments.length) * 100) : 0;

  // Total Study Minutes
  const totalStudyMinutes = timerLogs.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const totalHours = (totalStudyMinutes / 60).toFixed(1);

  // 75% Attendance Helper calculation
  const getAttendanceAdvice = (attended: number, total: number) => {
    if (total === 0) return { percent: 100, isSafe: true, message: 'No classes held yet' };
    const pct = (attended / total) * 100;

    if (pct >= 75) {
      // Calculate how many classes student can miss (bunk) before dropping below 75%
      // (attended) / (total + x) >= 0.75  =>  attended / 0.75 >= total + x  =>  x = floor(attended / 0.75 - total)
      const canBunk = Math.floor(attended / 0.75 - total);
      return {
        percent: Math.round(pct * 10) / 10,
        isSafe: true,
        message: canBunk > 0 ? `Safe! You can miss next ${canBunk} class${canBunk > 1 ? 'es' : ''} and maintain 75%` : 'On the borderline! Attend your next class to stay safe.',
      };
    } else {
      // Calculate how many consecutive classes student must attend to reach 75%
      // (attended + y) / (total + y) >= 0.75  =>  attended + y >= 0.75*total + 0.75*y  =>  0.25*y >= 0.75*total - attended  =>  y = ceil((0.75*total - attended) / 0.25)
      const needToAttend = Math.ceil((0.75 * total - attended) / 0.25);
      return {
        percent: Math.round(pct * 10) / 10,
        isSafe: false,
        message: `Shortage Alert! Must attend next ${needToAttend} consecutive classes to reach 75%!`,
      };
    }
  };

  // Grade point mapping
  const gradePoints: Record<string, number> = {
    'O': 10,
    'A+': 9,
    'A': 8,
    'B+': 7,
    'B': 6,
    'C': 5,
  };

  // SGPA Calculation
  const totalCredits = attendance.reduce((acc, curr) => acc + curr.credits, 0);
  const totalWeightedPoints = attendance.reduce((acc, curr) => {
    const pts = gradePoints[curr.targetGrade || 'A'] || 8;
    return acc + pts * curr.credits;
  }, 0);
  const projectedSGPA = totalCredits > 0 ? (totalWeightedPoints / totalCredits).toFixed(2) : '8.50';

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-purple-400" />
          <span>Semester Analytics & 75% Attendance Tracker</span>
        </h1>
        <p className="text-slate-400 text-sm">
          Real-time metrics, deliverables completion rates, and university attendance margin calculations
        </p>
      </div>

      {/* Progress Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Task Completion */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Tasks Completed</span>
            <span className="font-bold text-emerald-400">{taskPercent}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${taskPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-baseline text-xs text-slate-400">
            <span className="text-lg font-bold text-white">{completedTasks} / {totalTasks}</span>
            <span>{totalTasks - completedTasks} pending</span>
          </div>
        </div>

        {/* Lab Records Signed */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Lab Records Signed</span>
            <span className="font-bold text-cyan-400">{labPercent}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-cyan-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${labPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-baseline text-xs text-slate-400">
            <span className="text-lg font-bold text-white">{signedLabs} / {labs.length}</span>
            <span>{labs.length - signedLabs} to sign</span>
          </div>
        </div>

        {/* Theory Assignments Submitted */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Assignments Turned In</span>
            <span className="font-bold text-blue-400">{asgPercent}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${asgPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-baseline text-xs text-slate-400">
            <span className="text-lg font-bold text-white">{submittedAsgs} / {assignments.length}</span>
            <span>{assignments.length - submittedAsgs} remaining</span>
          </div>
        </div>

        {/* Projected SGPA */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-800/40 space-y-2">
          <div className="flex items-center justify-between text-xs text-indigo-300">
            <span>Projected SGPA</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{projectedSGPA}</span>
            <span className="text-xs text-slate-400">/ 10.0</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Based on {totalCredits} course credits
          </p>
        </div>
      </div>

      {/* B.Tech 75% Attendance Rule Tracker Section */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>University 75% Attendance Monitor</span>
            </h2>
            <p className="text-xs text-slate-400">
              Never get debarred from semester examinations. Accurately calculate safe bunk margins and shortage recovery.
            </p>
          </div>
          <span className="text-xs text-emerald-400 font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 self-start sm:self-auto">
            Threshold: 75.0%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attendance.map((att) => {
            const adv = getAttendanceAdvice(att.attended, att.total);

            return (
              <div
                key={att.id}
                className={`p-4 rounded-xl border transition-all ${
                  adv.isSafe
                    ? 'bg-slate-900/60 border-slate-800'
                    : 'bg-red-950/20 border-red-500/40 shadow-lg shadow-red-500/5'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      {att.code}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1">
                      {att.subject}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xl font-extrabold ${
                        adv.isSafe ? 'text-emerald-400' : 'text-red-400 animate-pulse'
                      }`}
                    >
                      {adv.percent}%
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      {att.attended} / {att.total} attended
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 my-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      adv.isSafe ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, adv.percent)}%` }}
                  />
                </div>

                {/* Advice & Quick +/- Controls */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <p
                    className={`text-[11px] font-medium ${
                      adv.isSafe ? 'text-emerald-300' : 'text-red-300 font-bold'
                    }`}
                  >
                    {adv.message}
                  </p>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onUpdateAttendance(att.id, att.attended + 1, att.total + 1)}
                      className="p-1 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold"
                      title="Mark Present (+1 Attended)"
                    >
                      +1 Present
                    </button>
                    <button
                      onClick={() => onUpdateAttendance(att.id, att.attended, att.total + 1)}
                      className="p-1 rounded-md bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[10px] font-bold"
                      title="Mark Absent (+1 Total, missed)"
                    >
                      +1 Missed
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Study Habit Overview */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <span>Focused Study Time Logged</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Total accumulated deep work across all tracked engineering subjects
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-2xl font-bold text-white">{totalHours}h</span>
            <span className="block text-[11px] text-slate-400 mt-1">Total Focus</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-2xl font-bold text-blue-400">{timerLogs.length}</span>
            <span className="block text-[11px] text-slate-400 mt-1">Sessions Completed</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-2xl font-bold text-emerald-400">
              {timerLogs.length > 0 ? Math.round(totalStudyMinutes / timerLogs.length) : 0}m
            </span>
            <span className="block text-[11px] text-slate-400 mt-1">Avg Session Length</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-2xl font-bold text-purple-400">4 Days</span>
            <span className="block text-[11px] text-slate-400 mt-1">Current Streak 🔥</span>
          </div>
        </div>
      </div>

    </div>
  );
};
