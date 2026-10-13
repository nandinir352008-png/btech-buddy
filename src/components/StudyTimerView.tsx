import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Flame, 
  CheckCircle2, 
  Sparkles,
  CloudRain,
  Radio,
  Sliders,
  History,
  Tag,
  BookOpen,
  Clock,
  Plus
} from 'lucide-react';
import { TimerSession } from '../types';
import { playChimeSound, startAmbientNoise, stopAmbientNoise, setAmbientVolume } from '../utils/audio';
import { loadCustomTaxonomies, addCustomSubject } from '../utils/storage';

interface StudyTimerViewProps {
  timerLogs: TimerSession[];
  onLogSession: (session: TimerSession) => void;
  availableSubjects?: string[];
}

export const StudyTimerView: React.FC<StudyTimerViewProps> = ({
  timerLogs,
  onLogSession,
  availableSubjects,
}) => {
  // Modes: pomodoro (25m), deep-work (50m), break (5m), custom
  const [mode, setMode] = useState<'pomodoro' | 'deep-work' | 'break' | 'custom'>('pomodoro');
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  // Custom Topic & Subject
  const taxonomies = loadCustomTaxonomies();
  const subjectsList = availableSubjects || taxonomies.subjects;
  const [subjectTag, setSubjectTag] = useState(subjectsList[0] || 'Data Structures & Algorithms');
  const [customTopic, setCustomTopic] = useState('');
  const [isTypingCustomTopic, setIsTypingCustomTopic] = useState(false);

  // Custom Duration in Hours and Minutes
  const [customHours, setCustomHours] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(35);

  // Ambient sound
  const [ambientType, setAmbientType] = useState<'none' | 'whitenoise' | 'rain' | 'alphaWave'>('none');
  const [ambientVol, setAmbientVol] = useState(0.2);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Switch timer presets
  const switchMode = (newMode: 'pomodoro' | 'deep-work' | 'break' | 'custom') => {
    setIsActive(false);
    setMode(newMode);
    let secs = 25 * 60;
    if (newMode === 'pomodoro') secs = 25 * 60;
    else if (newMode === 'deep-work') secs = 50 * 60;
    else if (newMode === 'break') secs = 5 * 60;
    else if (newMode === 'custom') secs = Math.max(60, (customHours * 3600) + (customMinutes * 60));
    setTotalSeconds(secs);
    setSecondsLeft(secs);
  };

  // Set explicit custom duration
  const applyCustomDuration = (hours: number, minutes: number) => {
    const totalSecs = Math.max(60, (hours * 3600) + (minutes * 60));
    setCustomHours(hours);
    setCustomMinutes(minutes);
    setTotalSeconds(totalSecs);
    setSecondsLeft(totalSecs);
  };

  // Timer Tick
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsActive(false);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  // Ambient sound effect
  useEffect(() => {
    if (ambientType === 'none') {
      stopAmbientNoise();
    } else {
      startAmbientNoise(ambientType, ambientVol);
    }
    return () => {
      stopAmbientNoise();
    };
  }, [ambientType]);

  const handleVolumeChange = (vol: number) => {
    setAmbientVol(vol);
    setAmbientVolume(vol);
  };

  const handleTimerComplete = () => {
    playChimeSound('complete');

    // Only log if it was a study session (not a short break)
    if (mode !== 'break') {
      const durationMins = Math.round(totalSeconds / 60);
      const finalizedSubject = isTypingCustomTopic && customTopic.trim() 
        ? `${subjectTag}: ${customTopic.trim()}`
        : subjectTag;

      const newSession: TimerSession = {
        id: `sess-${Date.now()}`,
        timestamp: new Date().toISOString(),
        durationMinutes: durationMins,
        subject: finalizedSubject,
        mode: mode === 'custom' ? 'custom' : mode,
      };
      onLogSession(newSession);

      // If student typed a brand new subject/topic, ensure it's saved in taxonomies
      if (customTopic.trim()) {
        addCustomSubject(customTopic.trim());
      }
    }
  };

  const handleToggleTimer = () => {
    if (!isActive) {
      playChimeSound('start');
    }
    setIsActive(!isActive);
  };

  const handleResetTimer = () => {
    setIsActive(false);
    setSecondsLeft(totalSeconds);
  };

  const handleAddFiveMinutes = () => {
    setTotalSeconds((prev) => prev + 300);
    setSecondsLeft((prev) => prev + 300);
  };

  // Time calculations
  const displayHours = Math.floor(secondsLeft / 3600);
  const displayMinutes = Math.floor((secondsLeft % 3600) / 60);
  const displaySeconds = secondsLeft % 60;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;

  // Today focus stats
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessions = timerLogs.filter((s) => s.timestamp.startsWith(todayStr));
  const todayFocusMinutes = todaySessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center justify-center space-x-2">
          <Flame className="w-7 h-7 text-blue-500 animate-pulse" />
          <span>Deep Engineering Focus Timer</span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm">
          Science-backed Pomodoro and flexible study cycles with custom topics, duration, and ambient focus audio
        </p>
      </div>

      {/* Main Timer Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0f172a] border border-slate-800 text-center relative overflow-hidden shadow-2xl">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Mode Selector Tabs */}
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800 space-x-1 mb-6 flex-wrap justify-center gap-y-1">
          <button
            onClick={() => switchMode('pomodoro')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              mode === 'pomodoro'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-500'
                : 'bg-transparent text-slate-400 hover:text-white'
            }`}
          >
            Pomodoro (25m)
          </button>
          <button
            onClick={() => switchMode('deep-work')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              mode === 'deep-work'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-500'
                : 'bg-transparent text-slate-400 hover:text-white'
            }`}
          >
            Deep Sprint (50m)
          </button>
          <button
            onClick={() => switchMode('break')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              mode === 'break'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 border border-emerald-500'
                : 'bg-transparent text-slate-400 hover:text-white'
            }`}
          >
            Rest Break (5m)
          </button>
          <button
            onClick={() => switchMode('custom')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              mode === 'custom'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-500'
                : 'bg-transparent text-slate-400 hover:text-white'
            }`}
          >
            Custom Duration
          </button>
        </div>

        {/* Custom Duration Controls (Hours & Minutes) */}
        {mode === 'custom' && (
          <div className="max-w-md mx-auto mb-6 p-4 rounded-2xl bg-slate-950/80 border border-purple-500/30 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between text-xs">
              <span className="text-purple-300 font-semibold flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Set Custom Focus Duration:</span>
              </span>
              <span className="font-mono font-bold text-white bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800">
                {customHours > 0 ? `${customHours}h ` : ''}{customMinutes}m ({Math.round(totalSeconds / 60)} mins total)
              </span>
            </div>

            {/* Hours and Minutes Inputs */}
            <div className="grid grid-cols-2 gap-3 text-left">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Hours (0–8)</label>
                <input
                  type="number"
                  min={0}
                  max={8}
                  value={customHours}
                  onChange={(e) => {
                    const h = parseInt(e.target.value, 10) || 0;
                    applyCustomDuration(h, customMinutes);
                  }}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Minutes (1–59)</label>
                <input
                  type="number"
                  min={1}
                  max={59}
                  value={customMinutes}
                  onChange={(e) => {
                    const m = parseInt(e.target.value, 10) || 1;
                    applyCustomDuration(customHours, m);
                  }}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-xs">
              {[
                { label: '10 min', h: 0, m: 10 },
                { label: '35 min', h: 0, m: 35 },
                { label: '45 min', h: 0, m: 45 },
                { label: '1 Hour', h: 1, m: 0 },
                { label: '1.5 Hours', h: 1, m: 30 },
                { label: '2 Hours', h: 2, m: 0 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyCustomDuration(preset.h, preset.m)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-medium transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Study Topic & Subject Tagging Card */}
        <div className="max-w-lg mx-auto mb-6 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-left space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center space-x-1.5">
              <Tag className="w-3.5 h-3.5 text-cyan-400" />
              <span>Study Topic & Subject Tagging:</span>
            </span>
            <button
              type="button"
              onClick={() => setIsTypingCustomTopic(!isTypingCustomTopic)}
              className="text-cyan-400 hover:text-cyan-300 font-medium text-xs"
            >
              {isTypingCustomTopic ? '← Select Standard Subject' : '+ Type Custom Topic / Task'}
            </button>
          </div>

          {!isTypingCustomTopic ? (
            <div>
              <select
                value={subjectTag}
                onChange={(e) => setSubjectTag(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 font-semibold text-xs sm:text-sm focus:border-cyan-500 focus:outline-none"
              >
                {subjectsList.map((sub) => (
                  <option key={sub} value={sub} className="bg-slate-900 text-white">
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                autoFocus
                placeholder="Type your own study topic e.g. LeetCode Graphs, DSP Filter Design, Python Pandas..."
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-cyan-500/50 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none font-medium"
              />
              <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                <span>Associated Subject:</span>
                <select
                  value={subjectTag}
                  onChange={(e) => setSubjectTag(e.target.value)}
                  className="bg-slate-900 text-slate-200 px-2 py-0.5 rounded border border-slate-800 focus:outline-none text-[11px]"
                >
                  {subjectsList.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Timer Digital & Progress Ring Display */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto flex items-center justify-center my-4">
          {/* Circular SVG Ring */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              className="stroke-slate-800 fill-none"
              strokeWidth="8"
            />
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              className="fill-none transition-all duration-500 ease-linear"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 125}
              strokeDashoffset={2 * Math.PI * 125 * (1 - progressPercent / 100)}
              style={{
                stroke: mode === 'break' ? '#10b981' : mode === 'deep-work' ? '#6366f1' : mode === 'custom' ? '#a855f7' : '#3b82f6',
              }}
            />
          </svg>

          {/* Time digits in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tighter font-mono-code">
              {displayHours > 0 ? `${displayHours}:` : ''}
              {String(displayMinutes).padStart(2, '0')}:
              {String(displaySeconds).padStart(2, '0')}
            </span>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mt-2">
              {isActive ? 'Session Running' : 'Paused / Ready'}
            </span>
            {(customTopic || subjectTag) && (
              <span className="text-[11px] text-cyan-400 font-medium mt-1 truncate max-w-[180px]">
                {customTopic || subjectTag}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center space-x-4 mt-8">
          <button
            onClick={handleResetTimer}
            className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all hover:scale-105"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={handleToggleTimer}
            className={`px-8 py-3.5 rounded-2xl font-bold text-sm sm:text-base flex items-center space-x-2 transition-all shadow-xl hover:scale-105 ${
              isActive
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-5 h-5 fill-white" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" />
                <span>Start Focus</span>
              </>
            )}
          </button>

          <button
            onClick={handleAddFiveMinutes}
            className="px-3.5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all hover:scale-105"
            title="Add +5 minutes"
          >
            +5m
          </button>
        </div>

        {/* Ambient Sound Controller */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2 text-slate-400">
            <span className="font-semibold text-slate-300 flex items-center space-x-1">
              <Sliders className="w-3.5 h-3.5" />
              <span>Ambient Sound:</span>
            </span>
            <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setAmbientType('none')}
                className={`px-2.5 py-1 rounded-lg ${
                  ambientType === 'none' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Mute
              </button>
              <button
                onClick={() => setAmbientType('rain')}
                className={`px-2.5 py-1 rounded-lg flex items-center space-x-1 ${
                  ambientType === 'rain' ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <CloudRain className="w-3 h-3" />
                <span>Rain</span>
              </button>
              <button
                onClick={() => setAmbientType('whitenoise')}
                className={`px-2.5 py-1 rounded-lg flex items-center space-x-1 ${
                  ambientType === 'whitenoise' ? 'bg-purple-600 text-white font-semibold' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Radio className="w-3 h-3" />
                <span>White Noise</span>
              </button>
              <button
                onClick={() => setAmbientType('alphaWave')}
                className={`px-2.5 py-1 rounded-lg flex items-center space-x-1 ${
                  ambientType === 'alphaWave' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Alpha Waves</span>
              </button>
            </div>
          </div>

          {/* Volume Slider */}
          {ambientType !== 'none' && (
            <div className="flex items-center space-x-2 text-slate-400">
              <Volume2 className="w-3.5 h-3.5" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={ambientVol}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-20 accent-blue-500 cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>

      {/* Focus Analytics Mini Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Today's Focus Time</span>
            <span className="text-xl font-bold text-white">
              {Math.floor(todayFocusMinutes / 60)}h {todayFocusMinutes % 60}m
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Sessions Finished</span>
            <span className="text-xl font-bold text-white">
              {todaySessions.length} Completed
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <History className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">All-time Logged</span>
            <span className="text-xl font-bold text-white">
              {timerLogs.reduce((acc, curr) => acc + curr.durationMinutes, 0)} mins
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
