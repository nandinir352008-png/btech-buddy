import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  Timer, 
  FlaskConical, 
  BarChart3, 
  Bot, 
  BookOpen, 
  Flame, 
  Menu, 
  X,
  GraduationCap,
  Bell,
  HelpCircle,
  Users,
  User,
  LogOut,
  Settings,
  ChevronDown,
  UserCheck,
  Sparkles,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { TabType, UserAccount } from '../types';
import { ProfileModalMode } from './ProfileModal';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  taskCount: number;
  urgentDeadlinesCount: number;
  currentUser: UserAccount;
  unreadNotificationsCount: number;
  onOpenProfileModal: (mode: ProfileModalMode) => void;
  onSignOut: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  taskCount,
  urgentDeadlinesCount,
  currentUser,
  unreadNotificationsCount,
  onOpenProfileModal,
  onSignOut,
  onOpenAuth,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'timetable', label: 'Timetable', icon: <Calendar className="w-4 h-4" /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-4 h-4" />, badge: taskCount },
    { id: 'timer', label: 'Focus Timer', icon: <Timer className="w-4 h-4" /> },
    { id: 'labs', label: 'Labs & Asgns', icon: <FlaskConical className="w-4 h-4" />, badge: urgentDeadlinesCount },
    { id: 'community', label: 'Ask Students', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'students', label: 'Peer Chat', icon: <Users className="w-4 h-4" /> },
    { id: 'progress', label: 'Analytics & 75%', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'ai-mentor', label: 'AI Doubt Solver', icon: <Bot className="w-4 h-4" /> },
    { id: 'docs', label: 'Docs & Backup', icon: <BookOpen className="w-4 h-4" /> },
  ];

  const isGuest = currentUser.provider === 'guest';

  return (
    <header className="sticky top-0 z-40 bg-[#090d16]/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer flex-shrink-0" onClick={() => onSelectTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-blue-400 bg-clip-text text-transparent">
                  B.Tech Buddy
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full">
                  CSE v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden xl:block">Student Productivity & Community Platform</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 overflow-x-auto scrollbar-none py-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm shadow-blue-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header: Inbox, Streak, Profile Avatar & Menu */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {/* Real Inbox Button */}
            <button
              onClick={() => onSelectTab('inbox')}
              className={`relative p-2 rounded-xl border transition-all ${
                currentTab === 'inbox'
                  ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800'
              }`}
              title="Notifications Inbox"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white font-black text-[9px] flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Streak Counter */}
            <div className="hidden xl:flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
              <span>4d Streak</span>
            </div>

            {/* Clock */}
            <div className="hidden sm:block text-xs font-mono font-medium text-slate-400 bg-slate-900/60 px-2.5 py-1 rounded-xl border border-slate-800">
              {currentTime}
            </div>

            {/* Profile Avatar & Interactive Menu */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 p-1 pl-1.5 pr-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-all hover:scale-[1.02] focus:outline-none"
              >
                <div className="relative">
                  <img
                    src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.name}`}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-700"
                  />
                  <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 ring-1 ring-[#090d16]" />
                </div>
                <div className="hidden sm:block text-left text-xs max-w-[90px] truncate leading-tight">
                  <span className="font-bold text-white block truncate">{currentUser.name}</span>
                  <span className="text-[10px] text-emerald-400 font-medium">Online</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-scaleIn space-y-1">
                  {/* User Info Header */}
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 mb-1">
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.name}`}
                        alt={currentUser.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-700"
                      />
                      <div className="truncate">
                        <span className="text-xs font-bold text-white block truncate">{currentUser.name}</span>
                        <span className="text-[11px] text-cyan-400 block truncate">
                          {currentUser.branch} • Sem {currentUser.semester}
                        </span>
                        <span className="text-[10px] text-slate-500 block truncate">
                          {currentUser.email || currentUser.phone || 'Offline Student'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onOpenProfileModal('view_public');
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                  >
                    <User className="w-4 h-4 text-cyan-400" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onOpenProfileModal('edit_profile');
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-blue-400" />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onSelectTab('community');
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 text-indigo-400" />
                    <span>My Questions</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onSelectTab('students');
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                    <span>Peer Messages</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onOpenProfileModal('followers');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Users className="w-4 h-4 text-emerald-400" />
                      <span>Followers</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {currentUser.followersCount || 0}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onOpenProfileModal('following');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <UserCheck className="w-4 h-4 text-cyan-400" />
                      <span>Following</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {currentUser.following?.length || 0}
                    </span>
                  </button>

                  <div className="pt-1 border-t border-slate-800">
                    {isGuest ? (
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenAuth();
                        }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-blue-400 hover:bg-blue-600/10 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Sign In / Create Account</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onSignOut();
                        }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c1220] border-b border-slate-800 px-4 pt-2 pb-4 space-y-1 animate-fadeIn">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <button
            onClick={() => {
              onSelectTab('inbox');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              currentTab === 'inbox'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Bell className="w-4 h-4 text-blue-400" />
              <span>Inbox Notifications</span>
            </div>
            {unreadNotificationsCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded-full">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>
      )}
    </header>
  );
};
