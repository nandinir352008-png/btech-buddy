import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  Phone, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  Smartphone, 
  ArrowRight, 
  KeyRound, 
  Sparkles,
  Info,
  ChevronDown
} from 'lucide-react';
import { UserAccount } from '../types';

interface AuthViewProps {
  onSignInSuccess: (user: UserAccount) => void;
  onContinueAsGuest: () => void;
}

type AuthMode = 'signin' | 'signup' | 'phone' | 'recovery';

const COUNTRY_CODES = [
  { code: '+91', country: 'India 🇮🇳' },
  { code: '+1', country: 'USA / Canada 🇺🇸' },
  { code: '+44', country: 'UK 🇬🇧' },
  { code: '+61', country: 'Australia 🇦🇺' },
  { code: '+971', country: 'UAE 🇦🇪' },
  { code: '+65', country: 'Singapore 🇸🇬' },
  { code: '+49', country: 'Germany 🇩🇪' },
];

export const AuthView: React.FC<AuthViewProps> = ({
  onSignInSuccess,
  onContinueAsGuest,
}) => {
  const [authMode, setAuthMode] = useState<AuthMode>('signin');

  // Email form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('CSE');
  const [semester, setSemester] = useState<number | string>(5);

  // Phone OTP form
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);
  const [generatedSandboxOtp, setGeneratedSandboxOtp] = useState<string | null>(null);

  // Recovery
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySubmitted, setRecoverySubmitted] = useState(false);

  // Alerts
  const [authError, setAuthError] = useState('');
  const [authNotice, setAuthNotice] = useState('');

  // Resend Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

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
          // Gracefully fall back to manual OTP entry
        });
      return () => ac.abort();
    }
  }, [otpSent]);

  // Handle Google Sign In
  const handleGoogleSignIn = () => {
    setAuthError('');
    const googleClientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;

    if (!googleClientId) {
      setAuthNotice(
        'Google OAuth Provider Notice: VITE_GOOGLE_CLIENT_ID is not configured in .env.example. To connect production Google sign-in, configure your Google Cloud OAuth Client ID. You can sign in using Phone OTP, Email, or the 1-Click Engineering Demo Account below!'
      );
      return;
    }

    // Google Sign in flow
    setAuthNotice('Initializing Google OAuth popup...');
  };

  // Demo 1-Click Sign-In
  const handleDemoSignIn = () => {
    const demoUser: UserAccount = {
      id: 'usr-student-me',
      name: 'Nandini R.',
      email: 'nandini.r@btech.edu',
      phone: '+91 98765 43210',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      branch: 'CSE',
      semester: 5,
      bio: '3rd Year B.Tech CSE student passionate about Operating Systems, Distributed Systems, and Competitive Programming.',
      interests: ['Data Structures', 'Linux Kernel', 'Web Engineering', 'Competitive Coding'],
      joinedAt: '2025-08-01',
      provider: 'email',
      isPublicProfile: true,
      following: ['usr-priya', 'usr-aditya'],
      followersCount: 18,
    };
    onSignInSuccess(demoUser);
  };

  // Handle Email Sign In
  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!email.trim() || !password.trim()) {
      setAuthError('Please enter both academic email and password.');
      return;
    }
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    const signedInUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      email: email.trim(),
      branch: 'CSE',
      semester: 5,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
      joinedAt: new Date().toISOString(),
      provider: 'email',
      isPublicProfile: true,
      following: ['usr-priya'],
      followersCount: 1,
    };
    onSignInSuccess(signedInUser);
  };

  // Handle Email Sign Up
  const handleEmailSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!name.trim() || !email.trim() || !password.trim()) {
      setAuthError('Please fill in all registration fields.');
      return;
    }
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      branch,
      semester,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name.trim())}`,
      joinedAt: new Date().toISOString(),
      provider: 'email',
      isPublicProfile: true,
      following: [],
      followersCount: 0,
    };
    onSignInSuccess(newUser);
  };

  // Handle Send Phone OTP
  const handleSendPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const cleanNum = phoneNumber.replace(/\D/g, '');
    if (cleanNum.length < 7 || cleanNum.length > 13) {
      setAuthError('Please enter a valid phone number (7 to 13 digits).');
      return;
    }

    const mockOtp = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedSandboxOtp(mockOtp);
    setOtpSent(true);
    setResendCountdown(60);
    setAuthNotice(
      `SMS Verification dispatched to ${countryCode} ${phoneNumber}. (Sandbox environment: Enter ${mockOtp} or 123456 to verify)`
    );
  };

  // Handle Verify Phone OTP
  const handleVerifyPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!otpCode || otpCode.length !== 6) {
      setAuthError('Please enter the 6-digit OTP code.');
      return;
    }

    // Verify OTP against generated sandbox OTP or standard testing OTP
    if (generatedSandboxOtp && otpCode !== generatedSandboxOtp && otpCode !== '123456') {
      setAuthError(`Invalid OTP code entered. Please enter ${generatedSandboxOtp} or 123456.`);
      return;
    }

    const verifiedUser: UserAccount = {
      id: `usr-phone-${Date.now()}`,
      name: `Student ${phoneNumber.slice(-4)}`,
      email: `${phoneNumber.slice(-4)}@student.btech.edu`,
      phone: `${countryCode} ${phoneNumber}`,
      branch: 'CSE',
      semester: 5,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${phoneNumber}`,
      joinedAt: new Date().toISOString(),
      provider: 'phone',
      isPublicProfile: true,
      following: [],
      followersCount: 0,
    };
    onSignInSuccess(verifiedUser);
  };

  // Handle Recovery
  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!recoveryEmail.trim() || !recoveryEmail.includes('@')) {
      setAuthError('Please enter a valid academic email address.');
      return;
    }
    setRecoverySubmitted(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-md w-full bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
        {/* Glow backdrop */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25 text-white">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Welcome to B.Tech Buddy
          </h2>
          <p className="text-xs text-slate-400">
            Sign in to synchronize tasks, labs, community questions, and peer direct messages
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => { setAuthMode('signin'); setAuthError(''); setAuthNotice(''); }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              authMode === 'signin' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setAuthMode('signup'); setAuthError(''); setAuthNotice(''); }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              authMode === 'signup' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
          <button
            onClick={() => { setAuthMode('phone'); setAuthError(''); setAuthNotice(''); }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              authMode === 'phone' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Phone OTP
          </button>
        </div>

        {/* Error / Notice Banners */}
        {authError && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {authNotice && (
          <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs space-y-1">
            <div className="flex items-center space-x-1.5 font-bold">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>Authentication Notice</span>
            </div>
            <p className="leading-relaxed text-[11px] text-slate-300">{authNotice}</p>
          </div>
        )}

        {/* ================= MODE: SIGN IN ================= */}
        {authMode === 'signin' && (
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Academic Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="student@btech.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setAuthMode('recovery')}
                  className="text-[11px] text-blue-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.01]"
            >
              Sign In with Email
            </button>
          </form>
        )}

        {/* ================= MODE: SIGN UP ================= */}
        {authMode === 'signup' && (
          <form onSubmit={handleEmailSignUp} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Nandini R."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Academic Email</label>
              <input
                type="email"
                required
                placeholder="nandini.r@btech.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
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
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Create Password</label>
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.01]"
            >
              Create Student Account
            </button>
          </form>
        )}

        {/* ================= MODE: PHONE SMS OTP ================= */}
        {authMode === 'phone' && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendPhoneOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Country Code & Phone Number
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-blue-500 focus:outline-none"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code} ({c.country})
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      required
                      placeholder="98765 43210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all"
                >
                  Send Verification OTP
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyPhoneOtp} className="space-y-4 animate-fadeIn">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                  <span>Enter the 6-digit code sent to </span>
                  <strong className="text-white">{countryCode} {phoneNumber}</strong>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="ml-2 text-cyan-400 hover:underline"
                  >
                    Change
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    6-Digit OTP Code (Autofill Supported)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    required
                    placeholder="e.g. 123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-cyan-500/50 text-white font-mono text-center text-xl tracking-widest focus:border-cyan-400 focus:outline-none font-bold"
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Didn't receive code?</span>
                  {resendCountdown > 0 ? (
                    <span className="text-slate-500 font-mono">Resend in {resendCountdown}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendPhoneOtp}
                      className="text-blue-400 hover:underline font-semibold"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-600/30 transition-all"
                >
                  Verify OTP & Enter
                </button>
              </form>
            )}
          </div>
        )}

        {/* ================= MODE: PASSWORD RECOVERY ================= */}
        {authMode === 'recovery' && (
          <div className="space-y-4">
            {!recoverySubmitted ? (
              <form onSubmit={handleRecovery} className="space-y-4">
                <p className="text-xs text-slate-400">
                  Enter your registered academic email. We will send password reset instructions to your inbox.
                </p>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Academic Email</label>
                  <input
                    type="email"
                    required
                    placeholder="student@btech.edu"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setAuthMode('signin')}
                    className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Back to Sign In
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                  >
                    Send Recovery Link
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 text-center space-y-2">
                <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Recovery Link Sent</h4>
                <p className="text-xs text-slate-300">
                  Instructions dispatched to {recoveryEmail}. Please check your inbox and spam folder.
                </p>
                <button
                  onClick={() => setAuthMode('signin')}
                  className="mt-2 text-xs text-blue-400 hover:underline"
                >
                  Return to Sign In
                </button>
              </div>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-[#0f172a] px-2 text-slate-500 font-bold tracking-wider">
              Or Instant Access
            </span>
          </div>
        </div>

        {/* 1-Click Google & Demo Sign-In Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold transition-all flex items-center justify-center space-x-2"
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

          <button
            type="button"
            onClick={handleDemoSignIn}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 hover:from-emerald-600/30 hover:to-cyan-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Sign In as Demo Student (Nandini R.)</span>
          </button>
        </div>

        {/* Guest Mode Link */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onContinueAsGuest}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            Continue as Guest (Local Offline Mode) →
          </button>
        </div>
      </div>
    </div>
  );
};
