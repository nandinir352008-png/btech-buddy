import React, { useState } from 'react';
import { 
  User, 
  X, 
  Camera, 
  Check, 
  ShieldCheck, 
  Globe, 
  Lock, 
  Users, 
  BookOpen, 
  Award, 
  Flame, 
  Tag, 
  Plus, 
  Trash2, 
  LogOut,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { UserAccount, StudentProfile } from '../types';

export type ProfileModalMode = 'view_public' | 'edit_profile' | 'followers' | 'following';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  allProfiles: StudentProfile[];
  initialMode?: ProfileModalMode;
  onUpdateUser: (updatedUser: UserAccount) => void;
  onSignOut: () => void;
  onToggleFollow: (studentId: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  allProfiles,
  initialMode = 'view_public',
  onUpdateUser,
  onSignOut,
  onToggleFollow,
  onNavigateTab,
}) => {
  const [mode, setMode] = useState<ProfileModalMode>(initialMode);

  // Edit Profile States
  const [displayName, setDisplayName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [branch, setBranch] = useState(currentUser.branch);
  const [semester, setSemester] = useState<number | string>(currentUser.semester);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || '');
  const [isPublic, setIsPublic] = useState(currentUser.isPublicProfile);
  const [interests, setInterests] = useState<string[]>(currentUser.interests || ['Operating Systems', 'Algorithms']);
  const [newInterestInput, setNewInterestInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  if (!isOpen) return null;

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    const updated: UserAccount = {
      ...currentUser,
      name: displayName.trim(),
      bio: bio.trim() || undefined,
      branch,
      semester,
      avatarUrl: avatarUrl.trim() || currentUser.avatarUrl,
      isPublicProfile: isPublic,
      interests,
    };
    onUpdateUser(updated);
    setSaveSuccess('Profile successfully updated!');
    setTimeout(() => {
      setSaveSuccess('');
      setMode('view_public');
    }, 1200);
  };

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newInterestInput.trim();
    if (trimmed && !interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
      setNewInterestInput('');
    }
  };

  const handleRemoveInterest = (tag: string) => {
    setInterests(interests.filter((t) => t !== tag));
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert('Avatar image exceeds 3MB limit.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Resolve list of following profiles
  const followingProfiles = allProfiles.filter((p) => currentUser.following?.includes(p.id));
  // Resolve list of followers (students who have currentUser.id in their following array)
  const followerProfiles = allProfiles.filter((p) => p.following?.includes(currentUser.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl animate-scaleIn max-h-[90vh] overflow-y-auto space-y-5">
        
        {/* Header Tabs */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-1 text-xs font-semibold">
            <button
              onClick={() => setMode('view_public')}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                mode === 'view_public' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              My Profile
            </button>
            <button
              onClick={() => setMode('edit_profile')}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                mode === 'edit_profile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Edit Profile
            </button>
            <button
              onClick={() => setMode('followers')}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                mode === 'followers' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Followers ({currentUser.followersCount || followerProfiles.length})
            </button>
            <button
              onClick={() => setMode('following')}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                mode === 'following' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Following ({currentUser.following?.length || 0})
            </button>
          </div>

          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {saveSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {/* ================= MODE: VIEW PUBLIC PROFILE ================= */}
        {mode === 'view_public' && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="relative inline-block">
                <img
                  src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.name}`}
                  alt={currentUser.name}
                  className="w-20 h-20 rounded-full mx-auto border-2 border-blue-500 object-cover shadow-lg"
                />
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 absolute bottom-1 right-1 ring-2 ring-[#0f172a]" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{currentUser.name}</h3>
                <p className="text-xs text-blue-400 font-medium">
                  {currentUser.branch} Engineering • Semester {currentUser.semester}
                </p>
                <span className="text-[11px] text-slate-500">
                  Account: {currentUser.email || currentUser.phone || 'Local Student'}
                </span>
              </div>
            </div>

            {/* Public/Private Status Badge */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                {currentUser.isPublicProfile ? (
                  <Globe className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Lock className="w-4 h-4 text-amber-400" />
                )}
                <span className="text-slate-300 font-medium">
                  Profile Status: <strong className="text-white">{currentUser.isPublicProfile ? 'Public to Classmates' : 'Private (Only You)'}</strong>
                </span>
              </div>
              <button
                onClick={() => setMode('edit_profile')}
                className="text-xs text-blue-400 hover:underline"
              >
                Change
              </button>
            </div>

            {/* Bio */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">About Me:</span>
              <p>{currentUser.bio || 'Dedicated B.Tech engineer building scalable systems and mastering data structures.'}</p>
            </div>

            {/* Interests */}
            {currentUser.interests && currentUser.interests.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-400 block">Areas of Specialization:</span>
                <div className="flex flex-wrap gap-1.5">
                  {currentUser.interests.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-cyan-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onNavigateTab('community');
                }}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-xs space-y-1 transition-colors"
              >
                <span className="font-bold text-white flex items-center space-x-1">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                  <span>My Community Doubts</span>
                </span>
                <p className="text-[11px] text-slate-400">View questions posted by you</p>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNavigateTab('students');
                }}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-xs space-y-1 transition-colors"
              >
                <span className="font-bold text-white flex items-center space-x-1">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Peer Messages</span>
                </span>
                <p className="text-[11px] text-slate-400">Direct classmate chat</p>
              </button>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => setMode('edit_profile')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Edit My Profile
              </button>
              <button
                onClick={onSignOut}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-red-600/15 hover:bg-red-600/25 text-red-300 border border-red-500/30 text-xs font-semibold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= MODE: EDIT PROFILE ================= */}
        {mode === 'edit_profile' && (
          <form onSubmit={handleSaveEdit} className="space-y-4">
            {/* Avatar upload */}
            <div className="flex items-center space-x-4">
              <img
                src={avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${displayName}`}
                alt="Avatar"
                className="w-16 h-16 rounded-full border-2 border-blue-500 object-cover"
              />
              <div className="space-y-1 flex-1">
                <label className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold cursor-pointer w-fit transition-colors">
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Upload Profile Photo</span>
                  <input type="file" accept="image/*" onChange={handleAvatarFileUpload} className="hidden" />
                </label>
                <p className="text-[10px] text-slate-500">JPG, PNG, or GIF up to 3MB</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Display Name *</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-blue-500 focus:outline-none"
                >
                  <option value="CSE">CSE</option>
                  <option value="CSD">CSD</option>
                  <option value="AI & ML">AI & ML</option>
                  <option value="Data Science">Data Science</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-blue-500 focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Bio (About You)</label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your academic interests, projects, or goals..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Public profile switch */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Public Profile Visibility</span>
                <span className="text-[11px] text-slate-400">Allow other students in B.Tech Buddy to view your public profile and connect</span>
              </div>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 accent-blue-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setMode('view_public')}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}

        {/* ================= MODE: FOLLOWERS ================= */}
        {mode === 'followers' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Students Following You ({followerProfiles.length})
            </h4>

            {followerProfiles.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-500">
                No followers yet. Post helpful explanations in the Ask Students community to gain followers!
              </div>
            ) : (
              <div className="space-y-2">
                {followerProfiles.map((p) => (
                  <div key={p.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2.5">
                      <img src={p.avatarUrl} alt={p.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <span className="font-bold text-white block">{p.name}</span>
                        <span className="text-[10px] text-slate-500">{p.branch} • Sem {p.semester}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onToggleFollow(p.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        currentUser.following?.includes(p.id)
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {currentUser.following?.includes(p.id) ? 'Following' : '+ Follow Back'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= MODE: FOLLOWING ================= */}
        {mode === 'following' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Students You Follow ({followingProfiles.length})
            </h4>

            {followingProfiles.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-500">
                You are not following any classmates yet. Open the Student Community to connect!
              </div>
            ) : (
              <div className="space-y-2">
                {followingProfiles.map((p) => (
                  <div key={p.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2.5">
                      <img src={p.avatarUrl} alt={p.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <span className="font-bold text-white block">{p.name}</span>
                        <span className="text-[10px] text-slate-500">{p.branch} • Sem {p.semester}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onToggleFollow(p.id)}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-red-500/10 text-slate-300 hover:text-red-400 text-xs font-semibold transition-colors"
                    >
                      Unfollow
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
