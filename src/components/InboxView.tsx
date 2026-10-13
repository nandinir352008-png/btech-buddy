import React, { useState } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  MessageSquare, 
  ThumbsUp, 
  UserPlus, 
  Mail, 
  HelpCircle, 
  CheckCircle2, 
  Settings, 
  Filter, 
  Clock, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { NotificationItem, NotificationType, TabType } from '../types';

interface InboxViewProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearReadNotifications: () => void;
  onNavigateTab: (tab: TabType, referenceId?: string) => void;
}

type InboxCategory = 
  | 'all' 
  | 'answers' 
  | 'replies' 
  | 'comments' 
  | 'followers' 
  | 'messages' 
  | 'system';

export const InboxView: React.FC<InboxViewProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearReadNotifications,
  onNavigateTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<InboxCategory>('all');
  const [showPreferences, setShowPreferences] = useState(false);

  // Preference toggles (saved locally)
  const [prefAnswers, setPrefAnswers] = useState(true);
  const [prefMessages, setPrefMessages] = useState(true);
  const [prefFollowers, setPrefFollowers] = useState(true);
  const [prefUpvotes, setPrefUpvotes] = useState(true);

  // Filtered Notifications
  const filteredNotifications = notifications.filter((item) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'answers') return item.type === 'new_answer' || item.type === 'answer_accepted';
    if (selectedCategory === 'replies') return item.type === 'question_reply';
    if (selectedCategory === 'comments') return item.type === 'new_comment';
    if (selectedCategory === 'followers') return item.type === 'new_follower';
    if (selectedCategory === 'messages') return item.type === 'direct_message';
    if (selectedCategory === 'system') return item.type === 'system' || item.type === 'question_resolved';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'new_answer':
        return <HelpCircle className="w-4 h-4 text-indigo-400" />;
      case 'answer_accepted':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'new_comment':
      case 'question_reply':
        return <MessageSquare className="w-4 h-4 text-cyan-400" />;
      case 'new_follower':
        return <UserPlus className="w-4 h-4 text-purple-400" />;
      case 'direct_message':
        return <Mail className="w-4 h-4 text-blue-400" />;
      case 'question_upvoted':
        return <ThumbsUp className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  const formatTimestamp = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  const handleItemClick = (item: NotificationItem) => {
    if (!item.read) {
      onMarkAsRead(item.id);
    }
    if (item.linkTab) {
      onNavigateTab(item.linkTab, item.referenceId);
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn max-w-5xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2.5">
            <Bell className="w-6 h-6 text-blue-400" />
            <span>Student Notification Inbox</span>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white">
                {unreadCount} Unread
              </span>
            )}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Real-time alerts for question replies, peer answers, direct messages, and following updates
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors border border-slate-700"
            >
              <CheckCheck className="w-4 h-4 text-blue-400" />
              <span>Mark All Read</span>
            </button>
          )}

          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Preferences</span>
          </button>
        </div>
      </div>

      {/* Preferences Drawer */}
      {showPreferences && (
        <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Notification Preferences
            </h4>
            <span className="text-[11px] text-slate-500">Stored locally in your profile</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <label className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={prefAnswers}
                onChange={(e) => setPrefAnswers(e.target.checked)}
                className="accent-blue-500 rounded"
              />
              <span className="text-slate-300">New Answers</span>
            </label>
            <label className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={prefMessages}
                onChange={(e) => setPrefMessages(e.target.checked)}
                className="accent-blue-500 rounded"
              />
              <span className="text-slate-300">Direct Messages</span>
            </label>
            <label className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={prefFollowers}
                onChange={(e) => setPrefFollowers(e.target.checked)}
                className="accent-blue-500 rounded"
              />
              <span className="text-slate-300">New Followers</span>
            </label>
            <label className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={prefUpvotes}
                onChange={(e) => setPrefUpvotes(e.target.checked)}
                className="accent-blue-500 rounded"
              />
              <span className="text-slate-300">Upvotes</span>
            </label>
          </div>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex items-center space-x-1 overflow-x-auto pb-1 scrollbar-none text-xs">
        {[
          { id: 'all', label: 'All Notifications', count: notifications.length },
          { id: 'answers', label: 'Answers to My Questions', count: notifications.filter((n) => n.type === 'new_answer' || n.type === 'answer_accepted').length },
          { id: 'replies', label: 'Question Replies', count: notifications.filter((n) => n.type === 'question_reply').length },
          { id: 'comments', label: 'Comments & Mentions', count: notifications.filter((n) => n.type === 'new_comment').length },
          { id: 'followers', label: 'New Followers', count: notifications.filter((n) => n.type === 'new_follower').length },
          { id: 'messages', label: 'Direct Messages', count: notifications.filter((n) => n.type === 'direct_message').length },
          { id: 'system', label: 'System Notifications', count: notifications.filter((n) => n.type === 'system' || n.type === 'question_resolved').length },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as InboxCategory)}
            className={`flex-shrink-0 px-3.5 py-2 rounded-xl font-medium transition-colors flex items-center space-x-1.5 ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>{cat.label}</span>
            {cat.count > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {cat.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-2.5">
        {filteredNotifications.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-[#0f172a]/60 border border-slate-800 space-y-2">
            <Bell className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-semibold text-white">No notifications in this category</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You're completely caught up! When a peer answers your question or sends a message, it will appear here.
            </p>
          </div>
        ) : (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 group ${
                !item.read
                  ? 'bg-[#0f1a2e] border-blue-500/40 shadow-sm shadow-blue-950/30'
                  : 'bg-[#0f172a] border-slate-800/80 hover:border-slate-700 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-start space-x-3.5 flex-1">
                {/* Sender Avatar or Icon */}
                <div className="relative mt-0.5">
                  {item.senderAvatar ? (
                    <img
                      src={item.senderAvatar}
                      alt={item.senderName || 'Sender'}
                      className="w-9 h-9 rounded-full object-cover border border-slate-700"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                      {getNotificationIcon(item.type)}
                    </div>
                  )}
                  {!item.read && (
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 absolute -top-0.5 -right-0.5 ring-2 ring-[#0f1a2e]" />
                  )}
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimestamp(item.timestamp)}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.message}
                  </p>
                </div>
              </div>

              {/* Action arrow */}
              <div className="flex items-center space-x-2 self-center">
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Clear read notifications button */}
      {notifications.some((n) => n.read) && (
        <div className="text-center pt-2">
          <button
            onClick={onClearReadNotifications}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            Clear read notification history
          </button>
        </div>
      )}
    </div>
  );
};
