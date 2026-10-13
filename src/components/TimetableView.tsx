import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Sparkles,
  BookOpen,
  FlaskConical,
  Coffee
} from 'lucide-react';
import { TimetableSlot, DayOfWeek } from '../types';

interface TimetableViewProps {
  timetable: TimetableSlot[];
  onAddSlot: (slot: Omit<TimetableSlot, 'id'>) => void;
  onDeleteSlot: (id: string) => void;
  onResetTimetable: () => void;
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const TimetableView: React.FC<TimetableViewProps> = ({
  timetable,
  onAddSlot,
  onDeleteSlot,
  onResetTimetable,
}) => {
  // Determine current day for default view
  const today = new Date();
  const dayIndex = today.getDay(); // 0 is Sunday, 1 is Monday ...
  const initialDay: DayOfWeek = (dayIndex >= 1 && dayIndex <= 6) ? DAYS[dayIndex - 1] : 'Monday';

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(initialDay);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  // Form state
  const [newSubject, setNewSubject] = useState('');
  const [newDay, setNewDay] = useState<DayOfWeek>(selectedDay);
  const [newStartTime, setNewStartTime] = useState('09:00');
  const [newEndTime, setNewEndTime] = useState('10:00');
  const [newRoom, setNewRoom] = useState('Room 302');
  const [newFaculty, setNewFaculty] = useState('Prof. Sharma');
  const [newType, setNewType] = useState<'theory' | 'lab' | 'tutorial' | 'break'>('theory');
  const [formError, setFormError] = useState('');

  const nowTimeStr = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;

  const filteredSlots = timetable
    .filter((slot) => slot.day === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) {
      setFormError('Please enter a subject name');
      return;
    }
    if (newStartTime >= newEndTime) {
      setFormError('Start time must be before end time');
      return;
    }

    onAddSlot({
      day: newDay,
      subject: newSubject.trim(),
      startTime: newStartTime,
      endTime: newEndTime,
      room: newRoom.trim() || 'TBA',
      faculty: newFaculty.trim() || 'Faculty',
      type: newType,
    });

    setNewSubject('');
    setFormError('');
    setShowAddModal(false);
  };

  const getTypeBadge = (type: TimetableSlot['type']) => {
    switch (type) {
      case 'lab':
        return (
          <span className="flex items-center space-x-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <FlaskConical className="w-3 h-3" />
            <span>Practical Lab</span>
          </span>
        );
      case 'tutorial':
        return (
          <span className="flex items-center space-x-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Sparkles className="w-3 h-3" />
            <span>Tutorial</span>
          </span>
        );
      case 'break':
        return (
          <span className="flex items-center space-x-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Coffee className="w-3 h-3" />
            <span>Break</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center space-x-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <BookOpen className="w-3 h-3" />
            <span>Lecture</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <CalendarIcon className="w-6 h-6 text-blue-400" />
            <span>Daily Engineering Timetable</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Classes, practical labs, and tutorial batches with live lecture detection
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* View mode toggle */}
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center text-xs">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                viewMode === 'day' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Day View
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                viewMode === 'week' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Week Matrix
            </button>
          </div>

          <button
            onClick={() => {
              setNewDay(selectedDay);
              setShowAddModal(true);
            }}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-md shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Slot</span>
          </button>

          <button
            onClick={onResetTimetable}
            title="Reset to default B.Tech schedule"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day Selector Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {DAYS.map((day) => {
          const isSelected = selectedDay === day;
          const isCurrentDay = initialDay === day;
          const count = timetable.filter((t) => t.day === day).length;

          return (
            <button
              key={day}
              onClick={() => {
                setSelectedDay(day);
                setViewMode('day');
              }}
              className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-500'
                  : 'bg-[#0f172a] text-slate-300 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <span>{day}</span>
              {isCurrentDay && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Today" />
              )}
              <span
                className={`text-xs px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-blue-700 text-blue-100' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main View: Day Schedule Timeline */}
      {viewMode === 'day' ? (
        <div className="space-y-3">
          {filteredSlots.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-[#0f172a]/50 border border-slate-800">
              <CalendarIcon className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <h3 className="text-base font-semibold text-white">No classes scheduled for {selectedDay}</h3>
              <p className="text-xs text-slate-400 mt-1">Enjoy your study break or add an extra lab session!</p>
              <button
                onClick={() => {
                  setNewDay(selectedDay);
                  setShowAddModal(true);
                }}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl inline-flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Class to {selectedDay}</span>
              </button>
            </div>
          ) : (
            filteredSlots.map((slot) => {
              const isOngoing =
                selectedDay === initialDay &&
                slot.startTime <= nowTimeStr &&
                slot.endTime >= nowTimeStr;

              return (
                <div
                  key={slot.id}
                  className={`relative p-5 rounded-2xl border transition-all ${
                    isOngoing
                      ? 'bg-gradient-to-r from-blue-950/60 to-slate-900 border-blue-500/60 shadow-lg shadow-blue-500/10'
                      : 'bg-[#0f172a]/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {isOngoing && (
                    <div className="absolute top-3 right-3 flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>LIVE NOW</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1.5 text-xs font-mono font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{slot.startTime} - {slot.endTime}</span>
                        </div>
                        {getTypeBadge(slot.type)}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-white pt-1">
                        {slot.subject}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-0.5">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span>{slot.room}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          <span>{slot.faculty}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-2 sm:pt-0 self-end sm:self-center">
                      <button
                        onClick={() => onDeleteSlot(slot.id)}
                        className="p-2 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                        title="Delete period"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Full Weekly Matrix Overview */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DAYS.map((day) => {
            const daySlots = timetable
              .filter((s) => s.day === day)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));

            return (
              <div key={day} className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <span>{day}</span>
                    {day === initialDay && (
                      <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.2 rounded font-semibold">
                        Today
                      </span>
                    )}
                  </h3>
                  <span className="text-xs text-slate-500">{daySlots.length} periods</span>
                </div>

                {daySlots.length === 0 ? (
                  <p className="text-xs text-slate-600 italic py-2">No slots</p>
                ) : (
                  <div className="space-y-2">
                    {daySlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 text-xs"
                      >
                        <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono">
                          <span>{slot.startTime} - {slot.endTime}</span>
                          <span className="capitalize text-slate-500">{slot.type}</span>
                        </div>
                        <p className="font-semibold text-slate-200 mt-0.5 truncate">{slot.subject}</p>
                        <p className="text-[11px] text-slate-400 truncate">{slot.room}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Slot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scaleIn">
            <h3 className="text-lg font-bold text-white mb-1">Add Timetable Slot</h3>
            <p className="text-xs text-slate-400 mb-4">Add a new lecture, lab experiment, or tutorial slot</p>

            {formError && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateSlot} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Day of Week</label>
                <select
                  value={newDay}
                  onChange={(e) => setNewDay(e.target.value as DayOfWeek)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Operating Systems / DBMS Lab"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Room / Venue</label>
                  <input
                    type="text"
                    placeholder="e.g. Lab 3 / Room 302"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Faculty Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Sharma"
                    value={newFaculty}
                    onChange={(e) => setNewFaculty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Type of Session</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="theory">Theory Lecture</option>
                  <option value="lab">Practical Lab (Hands-on)</option>
                  <option value="tutorial">Tutorial / Problem Solving</option>
                  <option value="break">Lunch / Short Break</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30"
                >
                  Save Timetable Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
