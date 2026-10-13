import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Image as ImageIcon, 
  BrainCircuit, 
  Sparkles, 
  Trash2, 
  Code, 
  FlaskConical, 
  BookOpen, 
  X, 
  Cpu, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { ChatMessage } from '../types';

interface AIAssistantViewProps {
  chatMessages: ChatMessage[];
  onSendMessage: (userMessage: string, role: string, model: string, thinking: boolean) => Promise<void>;
  onAnalyzeImage: (imageBase64: string, mimeType: string, prompt: string, thinking: boolean) => Promise<void>;
  onClearHistory: () => void;
  isLoading: boolean;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  chatMessages,
  onSendMessage,
  onAnalyzeImage,
  onClearHistory,
  isLoading,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedRole, setSelectedRole] = useState<'mentor' | 'debugger' | 'viva' | 'math'>('mentor');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.5-flash');
  const [highThinking, setHighThinking] = useState(false);

  // Image Upload state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageMime, setSelectedImageMime] = useState<string>('image/jpeg');
  const [selectedImageName, setSelectedImageName] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isLoading]);

  // When highThinking is toggled ON, automatically select gemini-3.1-pro-preview per requirement
  const handleToggleThinking = (checked: boolean) => {
    setHighThinking(checked);
    if (checked) {
      setSelectedModel('gemini-3.1-pro-preview');
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('Please upload an image smaller than 15MB');
      return;
    }

    setSelectedImageName(file.name);
    setSelectedImageMime(file.type || 'image/jpeg');

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setSelectedImage(result);
      // Auto-set model to gemini-3.1-pro-preview for image analysis
      setSelectedModel('gemini-3.1-pro-preview');
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setSelectedImageName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (selectedImage) {
      // Analyze image via Gemini 3.1 Pro
      const prompt = inputText.trim() || 'Analyze this engineering diagram, circuit, or code snippet in detail and solve any problems shown.';
      const img = selectedImage;
      const mime = selectedImageMime;
      handleClearImage();
      setInputText('');
      await onAnalyzeImage(img, mime, prompt, highThinking);
    } else {
      if (!inputText.trim()) return;
      const text = inputText.trim();
      setInputText('');
      await onSendMessage(text, selectedRole, selectedModel, highThinking);
    }
  };

  const quickPrompts = [
    { label: 'Explain Dijkstra algorithm simply', text: 'Explain Dijkstra algorithm with a step-by-step example, time complexity analysis, and C++ priority queue implementation.' },
    { label: 'DBMS SQL Joins Viva Questions', text: 'Generate the top 5 tricky Viva Voce questions on SQL INNER, LEFT, RIGHT, and FULL OUTER joins with concise model answers.' },
    { label: 'Find Worst-Case QuickSort Proof', text: 'Provide a formal mathematical proof for why QuickSort degrades to O(N^2) in worst case and how randomized pivot prevents it.' },
    { label: 'Normal Forms (1NF to BCNF)', text: 'Explain Database Normalization from 1NF to BCNF with a clear tabular example and dependency preservation rules.' },
  ];

  return (
    <div className="space-y-4 pb-12 animate-fadeIn max-w-5xl mx-auto flex flex-col h-[calc(100vh-8rem)] min-h-[600px]">
      
      {/* Top Controls Header */}
      <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-3 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white flex items-center space-x-2">
                <span>Gemini Engineering Doubt Solver</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Multi-Turn
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Solve coding bugs, verify mathematical derivations, and analyze circuit diagrams
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Clear History */}
            <button
              onClick={onClearHistory}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs font-medium transition-colors"
              title="Clear chat history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Configuration Row: Roles + Models + High Thinking Toggle */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Persona Role Selector */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-slate-400 mr-1 font-medium">Role:</span>
            {[
              { id: 'mentor', label: 'Mentor', icon: <BookOpen className="w-3 h-3" /> },
              { id: 'debugger', label: 'Code & DSA', icon: <Code className="w-3 h-3" /> },
              { id: 'viva', label: 'Viva Examiner', icon: <FlaskConical className="w-3 h-3" /> },
              { id: 'math', label: 'Math Proofs', icon: <Cpu className="w-3 h-3" /> },
            ].map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id as any)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  selectedRole === role.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {role.icon}
                <span>{role.label}</span>
              </button>
            ))}
          </div>

          {/* Model Selector and High Thinking */}
          <div className="flex items-center space-x-3">
            {/* Model dropdown */}
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400 font-medium">Model:</span>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-blue-500 font-mono"
              >
                <option value="gemini-3.5-flash">gemini-3.5-flash (General)</option>
                <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex)</option>
                <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast)</option>
              </select>
            </div>

            {/* High Thinking Toggle */}
            <label className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border cursor-pointer transition-all ${
              highThinking
                ? 'bg-purple-600/20 text-purple-300 border-purple-500/40 shadow-sm shadow-purple-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}>
              <BrainCircuit className={`w-3.5 h-3.5 ${highThinking ? 'text-purple-400 animate-pulse' : 'text-slate-500'}`} />
              <input
                type="checkbox"
                checked={highThinking}
                onChange={(e) => handleToggleThinking(e.target.checked)}
                className="hidden"
              />
              <span className="font-semibold text-[11px]">
                {highThinking ? 'High Thinking (ON)' : 'Thinking Mode'}
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Scrollable Message Thread */}
      <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-[#0c1220] border border-slate-800/80 space-y-4">
        {chatMessages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-bold ${
                  isUser
                    ? 'bg-blue-600 shadow-md shadow-blue-600/30'
                    : 'bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-md shadow-indigo-600/30'
                }`}
              >
                {isUser ? 'ME' : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white shadow-md'
                    : msg.isError
                    ? 'bg-red-950/40 text-red-200 border border-red-500/30'
                    : 'bg-[#131b2e] text-slate-200 border border-slate-800 shadow-sm'
                }`}
              >
                {/* Image thumbnail if attached by user */}
                {msg.imageThumbnail && (
                  <div className="mb-2 rounded-lg overflow-hidden border border-white/20 max-w-xs">
                    <img
                      src={msg.imageThumbnail}
                      alt="Uploaded engineering diagram"
                      className="w-full h-auto object-cover max-h-48"
                    />
                  </div>
                )}

                {/* Badges for model & thinking mode on assistant answers */}
                {!isUser && (msg.modelUsed || msg.thinkingUsed) && (
                  <div className="flex items-center space-x-1.5 mb-2 pb-1.5 border-b border-slate-800 text-[10px] text-slate-400 font-mono">
                    {msg.modelUsed && <span>{msg.modelUsed}</span>}
                    {msg.thinkingUsed && (
                      <span className="flex items-center space-x-1 text-purple-400 bg-purple-500/10 px-1.5 py-0.2 rounded border border-purple-500/20">
                        <BrainCircuit className="w-2.5 h-2.5" />
                        <span>High Thinking</span>
                      </span>
                    )}
                  </div>
                )}

                <div className="whitespace-pre-wrap font-sans">
                  {msg.text}
                </div>

                <div className="text-[10px] text-slate-400/80 mt-2 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#131b2e] border border-slate-800 text-xs text-slate-300 flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              <span>
                {highThinking
                  ? 'Gemini 3.1 Pro is deep reasoning (ThinkingLevel.HIGH)...'
                  : 'Analyzing with Gemini...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] flex-shrink-0">
        <span className="text-slate-500 flex items-center space-x-1 flex-shrink-0 mr-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Quick:</span>
        </span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => setInputText(qp.text)}
            className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Input Form with Image Upload & Prompt */}
      <form onSubmit={handleFormSubmit} className="flex-shrink-0 space-y-2">
        {/* Attached image preview banner */}
        {selectedImage && (
          <div className="flex items-center justify-between p-2 rounded-xl bg-blue-950/40 border border-blue-500/40 text-xs text-blue-200">
            <div className="flex items-center space-x-2 truncate">
              <img
                src={selectedImage}
                alt="Upload preview"
                className="w-8 h-8 rounded object-cover border border-blue-400/30"
              />
              <span className="truncate">Attached: {selectedImageName} (Gemini 3.1 Pro Vision)</span>
            </div>
            <button
              type="button"
              onClick={handleClearImage}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-center space-x-2">
          {/* Photo / Diagram Upload trigger */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Upload photo / circuit / whiteboard / code screenshot"
            className={`p-3 rounded-xl border transition-all ${
              selectedImage
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800 hover:border-slate-700'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Text Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                selectedImage
                  ? "Describe what to analyze in this image (or press Send for full analysis)..."
                  : highThinking
                  ? "Ask complex engineering problem (High Thinking mode active)..."
                  : "Ask a doubt, paste code, or request lab viva questions..."
              }
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-blue-500 focus:outline-none pr-10"
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={isLoading || (!inputText.trim() && !selectedImage)}
            className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>

    </div>
  );
};
