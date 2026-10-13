import React, { useState } from 'react';
import { 
  BookOpen, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  Copy, 
  Code2, 
  Database, 
  Rocket, 
  Info,
  Server,
  Layers,
  Sparkles
} from 'lucide-react';
import { exportAllDataAsJSON, importAllDataFromJSON, resetAllDataToDefault } from '../utils/storage';

interface ProjectDocsModalProps {
  onRefreshData: () => void;
}

export const ProjectDocsModal: React.FC<ProjectDocsModalProps> = ({ onRefreshData }) => {
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExport = () => {
    const jsonStr = exportAllDataAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `btech-buddy-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importAllDataFromJSON(content);
      if (success) {
        setImportStatus('Data backup successfully restored! Refreshing view...');
        setTimeout(() => {
          onRefreshData();
          setImportStatus(null);
        }, 1200);
      } else {
        setImportStatus('Error: Invalid backup JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Reset all tasks, timetable, and lab records back to default sample B.Tech data?')) {
      resetAllDataToDefault();
      onRefreshData();
    }
  };

  const runCommandSnippet = `npm install
npm run dev
# App runs at http://localhost:3000`;

  const copyCode = () => {
    navigator.clipboard.writeText(runCommandSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-blue-400" />
          <span>Hackathon Project Documentation & Guide</span>
        </h1>
        <p className="text-slate-400 text-sm">
          Technical architecture, data persistence analysis, and beginner modification tutorial
        </p>
      </div>

      {/* Backup and Restore Controls */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0f172a] to-blue-950/30 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Database className="w-5 h-5 text-blue-400" />
              <span>Data Storage & Local Backup Manager</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Tasks, timetable, lab records, and timer history are stored locally in your browser.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExport}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export JSON Backup</span>
            </button>

            <label className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              <span>Import JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>

            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 border border-slate-700 transition-colors"
              title="Reset to default sample data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {importStatus && (
          <div className={`p-3 rounded-xl text-xs font-medium ${
            importStatus.startsWith('Error') 
              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
          }`}>
            {importStatus}
          </div>
        )}
      </div>

      {/* Section 1: Storage Explanation & Limitations */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-3">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Info className="w-5 h-5 text-amber-400" />
          <span>Storage Choice, File Uploads & Architectural Limitations</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          This productivity app utilizes the browser's <strong>Web Storage API (LocalStorage)</strong> to ensure that all tasks, timetable slots, custom laboratories, experiment records, uploaded documents & photos, timer logs, and attendance counters persist across browser refreshes and device restarts without requiring paid third-party databases.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-800 text-xs">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-bold text-emerald-400">Advantages:</span>
            <ul className="list-disc list-inside text-slate-400 space-y-1">
              <li>100% private: your study notes, lab records & photos stay on your device</li>
              <li>Zero network latency: instant reads and writes with no server wait</li>
              <li>Works offline without internet connection</li>
              <li>Full JSON backup & restore to transfer your labs and records anytime</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-bold text-amber-400">Limitations to Note:</span>
            <ul className="list-disc list-inside text-slate-400 space-y-1">
              <li>Scoped to the current browser profile (~5MB-10MB quota per domain)</li>
              <li>Uploaded PDFs & photos are stored in local base64 format</li>
              <li>Clearing browser cache or incognito mode resets local data</li>
              <li>Use the <strong>Export JSON Backup</strong> button above to save your data permanently</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section 2: Beginner Modification Tutorial */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Code2 className="w-5 h-5 text-cyan-400" />
          <span>How a Beginner Can Customize & Extend This Project</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          The codebase is organized in clean, modular TypeScript components. Here is how you can customize it for your specific engineering branch (ECE, Mech, Civil, IT):
        </p>

        <div className="space-y-3 text-xs sm:text-sm">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <h4 className="font-bold text-white text-xs">1. Changing Default Subjects & Curriculum</h4>
            <p className="text-xs text-slate-400 mt-1">
              Open <code className="text-cyan-400 bg-slate-800 px-1 py-0.5 rounded">src/utils/storage.ts</code> and edit <code className="text-cyan-400">INITIAL_TIMETABLE</code> and <code className="text-cyan-400">INITIAL_ATTENDANCE</code> with your semester's course names (e.g. Microprocessors, Fluid Mechanics, Control Systems).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <h4 className="font-bold text-white text-xs">2. Customizing Pomodoro Timer Sound & Intervals</h4>
            <p className="text-xs text-slate-400 mt-1">
              Open <code className="text-cyan-400 bg-slate-800 px-1 py-0.5 rounded">src/utils/audio.ts</code>. You can customize the synthesizer frequencies (e.g., E5, G#5, B5) or adjust the ambient noise filter frequencies without touching external audio files.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <h4 className="font-bold text-white text-xs">3. Adding Custom Gemini AI Prompts</h4>
            <p className="text-xs text-slate-400 mt-1">
              Open <code className="text-cyan-400 bg-slate-800 px-1 py-0.5 rounded">server.ts</code> and explore <code className="text-cyan-400">SYSTEM_INSTRUCTIONS</code>. You can add new roles (e.g. GATE Exam Coach, Campus Interview Mock Examiner).
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Setup & Deployment Instructions */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Rocket className="w-5 h-5 text-emerald-400" />
            <span>Local Setup & Production Deployment</span>
          </h3>
          <button
            onClick={copyCode}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Commands'}</span>
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 border border-slate-800/80 overflow-x-auto">
          <pre>{runCommandSnippet}</pre>
        </div>

        <div className="text-xs text-slate-400 space-y-1.5">
          <p>• <strong>Production Build:</strong> Run <code className="text-slate-200 bg-slate-800 px-1 rounded">npm run build</code> which creates the optimized Vite bundle in <code className="text-slate-200">dist/</code>.</p>
          <p>• <strong>Cloud Run / Hosting:</strong> The backend Express server in <code className="text-slate-200">server.ts</code> serves static assets from <code className="text-slate-200">dist/</code> in production and proxy routes for Gemini API.</p>
          <p>• <strong>API Keys:</strong> Set <code className="text-slate-200">GEMINI_API_KEY</code> in environment variables or the AI Studio Secrets panel.</p>
        </div>
      </div>

    </div>
  );
};
