import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Search, 
  Send, 
  Paperclip, 
  Check, 
  CheckCheck, 
  ShieldAlert, 
  ShieldCheck, 
  UserPlus, 
  UserCheck, 
  Clock, 
  X, 
  AlertTriangle,
  Award,
  BookOpen,
  Flame,
  HelpCircle,
  Eye,
  FileText
} from 'lucide-react';
import { StudentProfile, DirectMessage, UserAccount, AttachedFile } from '../types';

interface StudentChatViewProps {
  currentUser: UserAccount;
  profiles: StudentProfile[];
  messages: DirectMessage[];
  onSendMessage: (recipientId: string, content: string, attachment?: AttachedFile) => void;
  onToggleFollow: (targetStudentId: string) => void;
  initialSelectedStudentId?: string;
}

export const StudentChatView: React.FC<StudentChatViewProps> = ({
  currentUser,
  profiles,
  messages,
  onSendMessage,
  onToggleFollow,
  initialSelectedStudentId,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialSelectedStudentId || profiles.find((p) => p.id !== currentUser.id)?.id || 'usr-priya'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [selectedProfileModal, setSelectedProfileModal] = useState<StudentProfile | null>(null);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [reportSuccess, setReportSuccess] = useState('');

  // Selected student
  const activeStudent = profiles.find((p) => p.id === selectedStudentId);

  // Filtered profiles (excluding current user)
  const otherStudents = profiles.filter((p) => p.id !== currentUser.id);
  const filteredStudents = otherStudents.filter((p) => {
    return (
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bio.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Conversation messages between currentUser and selectedStudent
  const conversationMessages = messages.filter(
    (m) =>
      (m.senderId === currentUser.id && m.recipientId === selectedStudentId) ||
      (m.senderId === selectedStudentId && m.recipientId === currentUser.id)
  );

  const isFollowing = (studentId: string) => {
    return currentUser.following && currentUser.following.includes(studentId);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedStudentId) return;
    if (blockedUsers.includes(selectedStudentId)) {
      alert('You have blocked this student. Unblock to send messages.');
      return;
    }

    onSendMessage(selectedStudentId, messageInput.trim());
    setMessageInput('');
  };

  const handleBlockStudent = (studentId: string) => {
    if (window.confirm('Block this student? You will no longer receive direct messages from them.')) {
      setBlockedUsers((prev) => [...prev, studentId]);
    }
  };

  const handleReportStudent = (studentName: string) => {
    setReportSuccess(`Report submitted for review against ${studentName}. Our engineering safety team will audit.`);
    setTimeout(() => setReportSuccess(''), 4000);
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn max-w-6xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2.5">
            <Users className="w-6 h-6 text-cyan-400" />
            <span>Student Community & Peer Chat</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Connect with B.Tech classmates, collaborate on engineering labs, follow top peer solvers, and message securely
          </p>
        </div>
      </div>

      {reportSuccess && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{reportSuccess}</span>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[560px]">
        {/* Left Column: Student Directory & Search */}
        <div className="md:col-span-5 lg:col-span-4 bg-[#0f172a] border border-slate-800 rounded-3xl p-4 flex flex-col space-y-4 shadow-xl">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search classmates by name, branch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[520px]">
            {filteredStudents.map((student) => {
              const isSelected = student.id === selectedStudentId;
              const following = isFollowing(student.id);

              return (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudentId(student.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#132238] border-cyan-500/50 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <div className="relative flex-shrink-0">
                      <img
                        src={student.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${student.name}`}
                        alt={student.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                      />
                      {student.isOnline && (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 ring-2 ring-[#0f172a]" />
                      )}
                    </div>

                    <div className="truncate">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-white truncate">{student.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {student.branch} • Sem {student.semester}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFollow(student.id);
                      }}
                      className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        following
                          ? 'text-cyan-400 hover:bg-cyan-500/10'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                      title={following ? 'Following (Click to unfollow)' : 'Follow student'}
                    >
                      {following ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProfileModal(student);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                      title="View public profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Direct Messaging Conversation */}
        <div className="md:col-span-7 lg:col-span-8 bg-[#0f172a] border border-slate-800 rounded-3xl flex flex-col shadow-xl overflow-hidden">
          {activeStudent ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                <div
                  className="flex items-center space-x-3 cursor-pointer"
                  onClick={() => setSelectedProfileModal(activeStudent)}
                >
                  <img
                    src={activeStudent.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${activeStudent.name}`}
                    alt={activeStudent.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-white hover:text-cyan-400">{activeStudent.name}</span>
                      <span className="text-[10px] text-slate-400 px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800">
                        {activeStudent.branch}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {activeStudent.isOnline ? 'Online now' : 'Active today'} • {activeStudent.college || 'Engineering Institute'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onToggleFollow(activeStudent.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                      isFollowing(activeStudent.id)
                        ? 'bg-cyan-600/20 text-cyan-300 border-cyan-500/40'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
                    }`}
                  >
                    {isFollowing(activeStudent.id) ? 'Following ✓' : '+ Follow'}
                  </button>
                  <button
                    onClick={() => handleBlockStudent(activeStudent.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-900"
                    title="Block Student"
                  >
                    <ShieldAlert className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message History */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[360px] max-h-[440px] bg-[#0a0f1d]/50">
                {conversationMessages.length === 0 ? (
                  <div className="text-center py-16 space-y-2 text-slate-500 text-xs">
                    <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
                    <p>No messages yet with {activeStudent.name}.</p>
                    <p className="text-[11px] text-slate-600">Send a greeting to start collaborating on engineering projects!</p>
                  </div>
                ) : (
                  conversationMessages.map((m) => {
                    const isMe = m.senderId === currentUser.id;

                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[78%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-600/20'
                              : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none'
                          }`}
                        >
                          <p>{m.content}</p>
                          {m.attachment && (
                            <div className="mt-2 pt-2 border-t border-white/20 flex items-center space-x-2">
                              <FileText className="w-3.5 h-3.5" />
                              <span className="truncate max-w-[140px]">{m.attachment.name}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-[9px] text-slate-500 mt-1 px-1">
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center space-x-2">
                <input
                  type="text"
                  placeholder={`Message ${activeStudent.name}...`}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-cyan-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center space-x-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-slate-500 text-xs">
              Select a student from the directory to start chatting.
            </div>
          )}
        </div>
      </div>

      {/* ==================== PUBLIC STUDENT PROFILE MODAL ==================== */}
      {selectedProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-scaleIn space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Student Public Profile</span>
              <button onClick={() => setSelectedProfileModal(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Header */}
            <div className="text-center space-y-2">
              <img
                src={selectedProfileModal.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${selectedProfileModal.name}`}
                alt={selectedProfileModal.name}
                className="w-20 h-20 rounded-full mx-auto border-2 border-cyan-500/50 object-cover"
              />
              <h3 className="text-lg font-bold text-white">{selectedProfileModal.name}</h3>
              <p className="text-xs text-cyan-400 font-medium">
                {selectedProfileModal.branch} Engineering • Semester {selectedProfileModal.semester}
              </p>
              <p className="text-[11px] text-slate-400">{selectedProfileModal.college || 'National Engineering Institute'}</p>
            </div>

            {/* Bio */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              {selectedProfileModal.bio || 'Engineering student working hard on data structures, algorithms, and university exams.'}
            </div>

            {/* Interests Chips */}
            {selectedProfileModal.interests && selectedProfileModal.interests.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 block">Areas of Interest:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProfileModal.interests.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Public Stats */}
            <div className="grid grid-cols-3 gap-2 text-center pt-2">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Answers</span>
                <span className="text-sm font-bold text-white">{selectedProfileModal.questionsAnsweredCount}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Helpful Votes</span>
                <span className="text-sm font-bold text-emerald-400">{selectedProfileModal.helpfulVotesCount}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Focus Hours</span>
                <span className="text-sm font-bold text-blue-400">{selectedProfileModal.focusHours}h</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  onToggleFollow(selectedProfileModal.id);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                  isFollowing(selectedProfileModal.id)
                    ? 'bg-cyan-600/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white border-transparent'
                }`}
              >
                {isFollowing(selectedProfileModal.id) ? 'Following ✓' : '+ Follow Student'}
              </button>
              <button
                onClick={() => {
                  setSelectedStudentId(selectedProfileModal.id);
                  setSelectedProfileModal(null);
                }}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
              >
                Open Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
