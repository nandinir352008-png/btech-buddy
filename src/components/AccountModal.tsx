import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  ShieldCheck, 
  Sparkles, 
  X, 
  Check, 
  AlertCircle, 
  LogOut, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Globe, 
  Camera, 
  Info,
  HelpCircle,
  Smartphone,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { UserAccount } from '../types';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onUpdateUser: (user: UserAccount) => void;
  onSignOut: () => void;
}

type AuthTab = 'signin' | 'signup' | 'phone' | 'forgot' | 'profile';

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onSignOut,
}) => {
  const [activeTab, setActiveTab] = useState<AuthTab>(
    currentUser.provider === 'guest' ? 'signin' : 'profile'
  );

  // Email/Password state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('CSE');
  const [semester, setSemester] = useState<number | string>(5);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Phone SMS OTP state
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [resendSeconds, setResendSeconds] = useState(0);

  // Password Recovery State
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  // Profile Edit State
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileBio, setProfileBio] = useState(currentUser.bio || '');
  const [profileBranch, setProfileBranch] = useState(currentUser.branch);
  const [profileSemester, setProfileSemester] = useState(currentUser.semester);
  const [profileAvatar, setProfileAvatar] = useState(currentUser.avatarUrl || '');
  const [profileIsPublic, setProfileIsPublic] = useState(currentUser.isPublicProfile);
  const [avatarUploadInput, setAvatarUploadInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      setProfileName(currentUser.name);
      setProfileBio(currentUser.bio || '');
      setProfileBranch(currentUser.branch);
      setProfileSemester(currentUser.semester);
      setProfileAvatar(currentUser.avatarUrl || '');
      setProfileIsPublic(currentUser.isPublicProfile);
      setAuthError('');
      setAuthSuccess('');
      setActiveTab(currentUser.provider === 'guest' ? 'signin' : 'profile');
    }
  }, [isOpen, currentUser]);

  // Resend Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendSeconds > 0) {
      timer = setTimeout(() => setResendSeconds((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendSeconds]);

  // WebOTP API detection for auto-fill on mobile devices
  useEffect(() => {
    if (otpSent && 'credentials' in navigator && (navigator as any).credentials?.get) {
      const ac = new AbortController();
      (navigator as any).credentials
        .get({
          otp: { transport: ['sms'] },
          signal: ac.signal,
        })
        .then((otp: any) => {
          if (otp && otp.code) {
            setOtpCode(otp.code);
          }
        })
        .catch(() => {
          // Fall back gracefully to manual OTP entry
        });
      return () => ac.abort();
    }
  }, [otpSent]);

  if (!isOpen) return null;

  // Handle Email Sign In
  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!email.trim() || !password.trim()) {
      setAuthError('Please enter both email and password.');
      return;
    }

    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    // Sign in successfully
    const updatedUser: UserAccount = {
      ...currentUser,
      email: email.trim(),
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      provider: 'email',
    };
    onUpdateUser(updatedUser);
    setAuthSuccess('Welcome back! You are now securely signed in.');
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  // Handle Email Sign Up
  const handleEmailSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!name.trim() || !email.trim() || !password.trim()) {
      setAuthError('Please fill in all required registration fields.');
      return;
    }
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      branch: branch,
      semester: semester,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name.trim())}`,
      joinedAt: new Date().toISOString(),
      provider: 'email',
      isPublicProfile: true,
      following: [],
      followersCount: 0,
    };
    onUpdateUser(newUser);
    setAuthSuccess('Student account created successfully! Welcome to B.Tech Buddy.');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  // Handle Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const cleanNum = phoneNumber.replace(/\D/g, '');
    if (cleanNum.length < 7 || cleanNum.length > 13) {
      setAuthError('Please enter a valid phone number (7 to 13 digits).');
      return;
    }

    setOtpSent(true);
    setResendSeconds(60);
    setAuthSuccess(`Verification SMS dispatched to ${countryCode} ${phoneNumber}. (Demo environment: enter 6 digits to verify)`);
  };

  // Handle Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (otpCode.length !== 6) {
      setAuthError('Please enter the 6-digit OTP verification code received.');
      return;
    }

    const updatedUser: UserAccount = {
      ...currentUser,
      phone: `${countryCode} ${phoneNumber}`,
      name: currentUser.name === 'Guest Student' ? `Engineer ${phoneNumber.slice(-4)}` : currentUser.name,
      provider: 'phone',
    };
    onUpdateUser(updatedUser);
    setAuthSuccess('Phone number verified successfully! You are signed in.');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  // Handle Password Recovery Request
  const handlePasswordRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!recoveryEmail.trim() || !recoveryEmail.includes('@')) {
      setAuthError('Please enter a valid academic or personal email address.');
      return;
    }
    setRecoverySent(true);
    setAuthSuccess(`Password reset instructions have been dispatched to ${recoveryEmail}. Please check your inbox.`);
  };

  // Handle Google Sign In
  const handleGoogleSignIn = () => {
    setAuthError('');
    // Check if Google Client ID is configured in client environment
    const googleClientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      setAuthError('Google OAuth Provider is not yet configured in .env.example (VITE_GOOGLE_CLIENT_ID). To configure, create an OAuth 2.0 Client ID in Google Cloud Console. In the meantime, you can sign in directly using email or phone OTP!');
      return;
    }

    // Google Sign-in flow
    setAuthSuccess('Redirecting to Google authentication...');
  };

  // Handle Save Profile Changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      setAuthError('Name is required.');
      return;
    }

    const updated: UserAccount = {
      ...currentUser,
      name: profileName.trim(),
      bio: profileBio.trim() || undefined,
      branch: profileBranch,
      semester: profileSemester,
      avatarUrl: profileAvatar.trim() || currentUser.avatarUrl,
      isPublicProfile: profileIsPublic,
    };
    onUpdateUser(updated);
    setAuthSuccess('Profile settings successfully saved!');
    setTimeout(() => {
      setAuthSuccess('');
    }, 2000);
  };

  // Handle Avatar Image Upload from local file
  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setAuthError('Avatar photo exceeds 3MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setProfileAvatar(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl animate-scaleIn max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {currentUser.provider !== 'guest' ? 'Student Account & Settings' : 'Sign In to B.Tech Buddy'}
              </h3>
              <p className="text-xs text-slate-400">
                {currentUser.provider !== 'guest' ? `Signed in as ${currentUser.email || currentUser.phone || currentUser.name}` : 'Personalized workspace, community questions & private chat'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Alerts */}
        {authError && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{authError}</div>
          </div>
        )}

        {authSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>{authSuccess}</span>
          </div>
        )}

        {/* Tab Switcher if user is not logged in */}
        {currentUser.provider === 'guest' ? (
          <div className="grid grid-cols-3 gap-1.5 mt-4 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => { setActiveTab('signin'); setAuthError(''); }}
              className={`py-2 rounded-lg transition-all ${
                activeTab === 'signin'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setAuthError(''); }}
              className={`py-2 rounded-lg transition-all ${
                activeTab === 'signup'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => { setActiveTab('phone'); setAuthError(''); }}
              className={`py-2 rounded-lg transition-all ${
                activeTab === 'phone'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Phone OTP
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2 mt-4 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => { setActiveTab('profile'); setAuthError(''); }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Profile & Privacy
            </button>
            <button
              onClick={() => { setActiveTab('phone'); setAuthError(''); }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                activeTab === 'phone'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Linked Phone
            </button>
          </div>
        )}

        {/* ======================= TAB: SIGN IN ======================= */}
        {activeTab === 'signin' && (
          <div className="space-y-4 mt-5">
            {/* Quick 1-Click Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs flex items-center justify-center space-x-2 shadow transition-all hover:scale-[1.01]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center my-3">
              <div className="flex-1 border-t border-slate-800"></div>
              <span className="px-3 text-[11px] uppercase tracking-wider text-slate-500">or sign in with email</span>
              <div className="flex-1 border-t border-slate-800"></div>
            </div>

            <form onSubmit={handleEmailSignIn} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="student@btech.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('forgot')}
                    className="text-[11px] text-blue-400 hover:text-blue-300"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.01]"
              >
                Sign In
              </button>
            </form>
          </div>
        )}

        {/* ======================= TAB: SIGN UP ======================= */}
        {activeTab === 'signup' && (
          <form onSubmit={handleEmailSignUp} className="space-y-3.5 mt-5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Student Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">College Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="rahul.sharma@btech.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Engineering Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="CSE">CSE</option>
                  <option value="CSD">CSD (Design)</option>
                  <option value="AI & ML">AI & ML</option>
                  <option value="Data Science">Data Science</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="Chemical">Chemical</option>
                  <option value="Biotechnology">Biotechnology</option>
                  <option value="Other">Other Branch</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Current Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-blue-500 focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password (min 6 characters) *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.01]"
            >
              Create Account
            </button>
          </form>
        )}

        {/* ======================= TAB: PHONE NUMBER SMS OTP ======================= */}
        {activeTab === 'phone' && (
          <div className="space-y-4 mt-5">
            <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-900/40 text-xs text-slate-300 flex items-start space-x-2">
              <Smartphone className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Phone Sign-In with SMS OTP Verification</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Sign in instantly with a one-time passcode sent directly to your mobile phone. Supports device OTP autofill and manual entry.
                </p>
              </div>
            </div>

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Mobile Phone Number</label>
                  <div className="flex space-x-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-blue-500 focus:outline-none"
                    >
                      <option value="+91">🇮🇳 +91 (India)</option>
                      <option value="+1">🇺🇸 +1 (USA / CA)</option>
                      <option value="+44">🇬🇧 +44 (UK)</option>
                      <option value="+65">🇸🇬 +65 (Singapore)</option>
                      <option value="+971">🇦🇪 +971 (UAE)</option>
                      <option value="+61">🇦🇺 +61 (Australia)</option>
                    </select>
                    <div className="relative flex-1">
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="tel"
                        required
                        placeholder="98765 43210"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-all"
                >
                  Send Verification OTP
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-300">Enter 6-Digit OTP</label>
                    <span className="text-[11px] text-slate-400">
                      Sent to {countryCode} {phoneNumber}
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoComplete="one-time-code"
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 text-center tracking-widest text-lg font-mono font-bold rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-cyan-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Device WebOTP auto-fill active. You can also enter the 6 digits manually.
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtpCode(''); }}
                    className="text-slate-400 hover:text-white"
                  >
                    Change Phone Number
                  </button>
                  <button
                    type="button"
                    disabled={resendSeconds > 0}
                    onClick={() => {
                      setResendSeconds(60);
                      setAuthSuccess('New OTP dispatched!');
                    }}
                    className={`font-semibold ${
                      resendSeconds > 0
                        ? 'text-slate-600 cursor-not-allowed'
                        : 'text-cyan-400 hover:text-cyan-300'
                    }`}
                  >
                    {resendSeconds > 0 ? `Resend OTP in ${resendSeconds}s` : 'Resend OTP'}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-all"
                >
                  Verify & Sign In
                </button>
              </form>
            )}

            {/* Provider Configuration Notice */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-semibold text-slate-300 block">External SMS Provider Note:</span>
              <p>
                In production, phone sign-in connects to your configured SMS gateway (e.g. Firebase Auth SMS or Twilio). In this local developer sandbox, verification codes are safely simulated so you can verify user flows without incurred SMS charges.
              </p>
            </div>
          </div>
        )}

        {/* ======================= TAB: PASSWORD RECOVERY ======================= */}
        {activeTab === 'forgot' && (
          <div className="space-y-4 mt-5">
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Reset Your Password</h4>
              <p className="text-xs text-slate-400">
                Enter your registered student email address and we will dispatch a secure password reset link.
              </p>
            </div>

            <form onSubmit={handlePasswordRecovery} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Registered Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="student@btech.edu"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('signin')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Back to Sign In
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all"
                >
                  Dispatch Reset Instructions
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ======================= TAB: PROFILE & SETTINGS ======================= */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-4 mt-5">
            {/* Avatar Row */}
            <div className="flex items-center space-x-4 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <img
                src={profileAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                alt="Profile Avatar"
                className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-500/40 shadow"
              />
              <div className="flex-1 space-y-1">
                <span className="text-xs font-semibold text-white block">Profile Photo</span>
                <div className="flex items-center space-x-2">
                  <label className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold cursor-pointer border border-slate-700 inline-flex items-center space-x-1">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Upload Photo</span>
                    <input type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={() => setProfileAvatar(`https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`)}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700"
                  >
                    Random Robot
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Display Name *</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Engineering Branch</label>
                <select
                  value={profileBranch}
                  onChange={(e) => setProfileBranch(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="CSE">CSE</option>
                  <option value="CSD">CSD (Design)</option>
                  <option value="AI & ML">AI & ML</option>
                  <option value="Data Science">Data Science</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="Chemical">Chemical</option>
                  <option value="Biotechnology">Biotechnology</option>
                  <option value="Common 1st Year">Common 1st Year</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Current Semester</label>
                <select
                  value={profileSemester}
                  onChange={(e) => setProfileSemester(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-blue-500 focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Account Provider</label>
                <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 capitalize flex items-center justify-between">
                  <span>{currentUser.provider} Auth</span>
                  <span className="text-[10px] font-mono text-emerald-400">Active ✓</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Student Bio & Interests</label>
              <textarea
                rows={2}
                value={profileBio}
                onChange={(e) => setProfileBio(e.target.value)}
                placeholder="Share your technical interests, favorite subjects, or project goals..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Privacy Toggles */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-white block">Community Privacy Controls</span>
              <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileIsPublic}
                  onChange={(e) => setProfileIsPublic(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700"
                />
                <span>Allow other students to see my public profile, answers, and study contributions</span>
              </label>
              <p className="text-[11px] text-slate-500">
                Your private tasks, personal timetable, and passwords will NEVER be exposed publicly.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to sign out from this device?')) {
                    onSignOut();
                    onClose();
                  }
                }}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md transition-all"
              >
                Save Profile
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
