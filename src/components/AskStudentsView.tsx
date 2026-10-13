import React, { useState, useRef, useMemo } from 'react';
import { 
  HelpCircle, 
  Plus, 
  Search, 
  Filter, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  ThumbsUp, 
  Bookmark, 
  BookmarkCheck, 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Upload, 
  Paperclip, 
  Star, 
  Trash2, 
  Edit3, 
  X, 
  Check, 
  FileText, 
  Image as ImageIcon, 
  Share2, 
  AlertCircle,
  Eye,
  Download,
  Volume2,
  ChevronDown,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { 
  CommunityQuestion, 
  QuestionAnswer, 
  QuestionReview, 
  AnswerComment, 
  AttachedFile, 
  QuestionStatus, 
  QuestionDifficulty,
  UserAccount 
} from '../types';
import { loadCustomTaxonomies, addCustomSubject } from '../utils/storage';

interface AskStudentsViewProps {
  currentUser: UserAccount;
  questions: CommunityQuestion[];
  onAddQuestion: (q: Omit<CommunityQuestion, 'id' | 'createdAt' | 'answers' | 'reviews' | 'savedBy' | 'followers' | 'upvotes' | 'upvotedBy'>) => void;
  onUpdateQuestion: (q: CommunityQuestion) => void;
  onDeleteQuestion: (id: string) => void;
  onAddAnswer: (questionId: string, answer: Omit<QuestionAnswer, 'id' | 'timestamp' | 'helpfulVotes' | 'votedBy' | 'isAccepted' | 'comments'>) => void;
  onUpvoteQuestion: (questionId: string) => void;
  onToggleSaveQuestion: (questionId: string) => void;
  onToggleFollowQuestion: (questionId: string) => void;
  onVoteAnswerHelpful: (questionId: string, answerId: string) => void;
  onAcceptAnswer: (questionId: string, answerId: string) => void;
  onAddAnswerComment: (questionId: string, answerId: string, text: string) => void;
  onSubmitReview: (questionId: string, review: Omit<QuestionReview, 'id' | 'timestamp' | 'reviewerId' | 'reviewerName'>) => void;
  onOpenStudentProfile?: (studentId: string) => void;
  availableSubjects?: string[];
}

export const AskStudentsView: React.FC<AskStudentsViewProps> = ({
  currentUser,
  questions,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  onAddAnswer,
  onUpvoteQuestion,
  onToggleSaveQuestion,
  onToggleFollowQuestion,
  onVoteAnswerHelpful,
  onAcceptAnswer,
  onAddAnswerComment,
  onSubmitReview,
  onOpenStudentProfile,
  availableSubjects,
}) => {
  // Navigation / Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'unanswered' | 'answered' | 'resolved'>('all');
  const [filterMyQuestions, setFilterMyQuestions] = useState(false);
  const [filterSaved, setFilterSaved] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'upvotes' | 'answers'>('newest');

  // Question detail modal / view
  const [selectedQuestion, setSelectedQuestion] = useState<CommunityQuestion | null>(null);

  // New Question Modal State
  const [showAskModal, setShowAskModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<CommunityQuestion | null>(null);

  const taxonomies = loadCustomTaxonomies();
  const subjectsList = availableSubjects || taxonomies.subjects;

  // Question Form Fields
  const [qTitle, setQTitle] = useState('');
  const [qDescription, setQDescription] = useState('');
  const [qSubject, setQSubject] = useState(subjectsList[0] || 'Data Structures & Algorithms');
  const [isCustomSubject, setIsCustomSubject] = useState(false);
  const [customSubjectText, setCustomSubjectText] = useState('');
  const [qSemester, setQSemester] = useState<string>('5');
  const [isCustomSemester, setIsCustomSemester] = useState(false);
  const [customSemesterText, setCustomSemesterText] = useState('');
  const [qTopic, setQTopic] = useState('');
  const [qDifficulty, setQDifficulty] = useState<QuestionDifficulty>('Intermediate');
  const [qAttachments, setQAttachments] = useState<AttachedFile[]>([]);
  const [qFormError, setQFormError] = useState('');

  // Answer Form State
  const [answerContent, setAnswerContent] = useState('');
  const [answerAttachments, setAnswerAttachments] = useState<AttachedFile[]>([]);
  const [answerError, setAnswerError] = useState('');

  // Audio / Voice-Note Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioBlobUrl, setRecordedAudioBlobUrl] = useState<string | null>(null);
  const [recordedAudioBase64, setRecordedAudioBase64] = useState<string | null>(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recordedAudioRef = useRef<HTMLAudioElement | null>(null);

  // Comment state per answer
  const [commentInputs, setCommentInputs] = useState<{ [answerId: string]: string }>({});

  // Review Form State (For Question Owner)
  const [reviewingAnswerId, setReviewingAnswerId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewUnderstandable, setReviewUnderstandable] = useState<'yes' | 'partially' | 'needs-improvement'>('yes');
  const [reviewFeedback, setReviewFeedback] = useState('');

  // Image Preview Modal
  const [previewFile, setPreviewFile] = useState<AttachedFile | null>(null);

  // Filtered & Sorted Questions
  const filteredQuestions = useMemo(() => {
    return questions
      .filter((q) => {
        // Search
        const matchesSearch =
          q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (q.topic && q.topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
          q.authorName.toLowerCase().includes(searchQuery.toLowerCase());

        // Subject
        const matchesSubject = selectedSubject === 'all' || q.subject === selectedSubject;

        // Semester
        const matchesSemester = selectedSemester === 'all' || String(q.semester) === selectedSemester;

        // Status
        const matchesStatus =
          selectedStatus === 'all'
            ? true
            : selectedStatus === 'unanswered'
            ? q.answers.length === 0
            : selectedStatus === 'resolved'
            ? q.status === 'resolved'
            : q.answers.length > 0;

        // My Questions
        const matchesMy = !filterMyQuestions || q.authorId === currentUser.id;

        // Saved
        const matchesSaved = !filterSaved || (q.savedBy && q.savedBy.includes(currentUser.id));

        return matchesSearch && matchesSubject && matchesSemester && matchesStatus && matchesMy && matchesSaved;
      })
      .sort((a, b) => {
        if (sortBy === 'upvotes') return b.upvotes - a.upvotes;
        if (sortBy === 'answers') return b.answers.length - a.answers.length;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [questions, searchQuery, selectedSubject, selectedSemester, selectedStatus, filterMyQuestions, filterSaved, sortBy, currentUser.id]);

  // Handle Open Create / Edit Modal
  const openAskModal = (qToEdit?: CommunityQuestion) => {
    if (qToEdit) {
      setEditingQuestion(qToEdit);
      setQTitle(qToEdit.title);
      setQDescription(qToEdit.description);
      setQSubject(qToEdit.subject);
      setIsCustomSubject(!subjectsList.includes(qToEdit.subject));
      setCustomSubjectText(!subjectsList.includes(qToEdit.subject) ? qToEdit.subject : '');
      setQSemester(String(qToEdit.semester));
      setQTopic(qToEdit.topic || '');
      setQDifficulty(qToEdit.difficulty);
      setQAttachments(qToEdit.attachments || []);
    } else {
      setEditingQuestion(null);
      setQTitle('');
      setQDescription('');
      setQSubject(subjectsList[0] || 'Data Structures & Algorithms');
      setIsCustomSubject(false);
      setCustomSubjectText('');
      setQSemester('5');
      setIsCustomSemester(false);
      setCustomSemesterText('');
      setQTopic('');
      setQDifficulty('Intermediate');
      setQAttachments([]);
    }
    setQFormError('');
    setShowAskModal(true);
  };

  // Handle Question File Upload (PDF, DOCX, JPG, PNG)
  const handleQuestionFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.size > 4 * 1024 * 1024) {
        setQFormError(`"${file.name}" exceeds 4MB file limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const attached: AttachedFile = {
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          uploadedAt: new Date().toISOString(),
          dataUrl: reader.result as string,
        };
        setQAttachments((prev) => [...prev, attached]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Submit Question
  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qTitle.trim() || !qDescription.trim()) {
      setQFormError('Please enter both question title and detailed problem description.');
      return;
    }

    let finalSubject = isCustomSubject ? customSubjectText.trim() : qSubject;
    if (!finalSubject) {
      setQFormError('Please specify the subject.');
      return;
    }
    // Auto-save custom subject
    if (isCustomSubject && customSubjectText.trim()) {
      addCustomSubject(customSubjectText.trim());
    }

    const finalSemester = isCustomSemester ? customSemesterText.trim() : qSemester;

    if (editingQuestion) {
      onUpdateQuestion({
        ...editingQuestion,
        title: qTitle.trim(),
        description: qDescription.trim(),
        subject: finalSubject,
        semester: finalSemester,
        topic: qTopic.trim() || undefined,
        difficulty: qDifficulty,
        attachments: qAttachments,
      });
      // Update selected question if open
      if (selectedQuestion?.id === editingQuestion.id) {
        setSelectedQuestion({
          ...selectedQuestion,
          title: qTitle.trim(),
          description: qDescription.trim(),
          subject: finalSubject,
          semester: finalSemester,
          topic: qTopic.trim() || undefined,
          difficulty: qDifficulty,
          attachments: qAttachments,
        });
      }
    } else {
      onAddQuestion({
        title: qTitle.trim(),
        description: qDescription.trim(),
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatarUrl,
        authorBranch: currentUser.branch,
        semester: finalSemester,
        subject: finalSubject,
        topic: qTopic.trim() || undefined,
        difficulty: qDifficulty,
        tags: [finalSubject, qDifficulty, qTopic.trim()].filter(Boolean),
        isAnonymous: false,
        status: 'unanswered',
        attachments: qAttachments,
      });
    }

    setShowAskModal(false);
  };

  // Start Voice-Note Recording
  const startVoiceRecording = async () => {
    try {
      setAnswerError('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const blobUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioBlobUrl(blobUrl);

        const reader = new FileReader();
        reader.onloadend = () => {
          setRecordedAudioBase64(reader.result as string);
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone access denied:', err);
      setAnswerError('Microphone permission denied or not supported by browser. You can still type your answer and upload diagrams or notes!');
    }
  };

  // Stop Voice Recording
  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  // Handle Answer File Upload
  const handleAnswerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.size > 4 * 1024 * 1024) {
        setAnswerError(`"${file.name}" exceeds 4MB file limit.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const attached: AttachedFile = {
          id: `ans-file-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          uploadedAt: new Date().toISOString(),
          dataUrl: reader.result as string,
        };
        setAnswerAttachments((prev) => [...prev, attached]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Submit Answer
  const handlePostAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestion) return;
    if (!answerContent.trim() && !recordedAudioBase64) {
      setAnswerError('Please write an explanation or record a voice note.');
      return;
    }

    onAddAnswer(selectedQuestion.id, {
      questionId: selectedQuestion.id,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatarUrl,
      authorBranch: currentUser.branch,
      authorSemester: currentUser.semester,
      content: answerContent.trim() || 'Audio / Diagram Explanation Attached Below',
      voiceNoteUrl: recordedAudioBase64 || undefined,
      voiceNoteDuration: recordingSeconds || undefined,
      attachments: answerAttachments,
    });

    // Reset answer form
    setAnswerContent('');
    setRecordedAudioBlobUrl(null);
    setRecordedAudioBase64(null);
    setRecordingSeconds(0);
    setAnswerAttachments([]);
    setAnswerError('');

    // Update active question view
    const updatedQ = questions.find((q) => q.id === selectedQuestion.id);
    if (updatedQ) {
      setSelectedQuestion(updatedQ);
    }
  };

  // Submit Comment on Answer
  const handlePostComment = (questionId: string, answerId: string) => {
    const text = commentInputs[answerId]?.trim();
    if (!text) return;
    onAddAnswerComment(questionId, answerId, text);
    setCommentInputs((prev) => ({ ...prev, [answerId]: '' }));
  };

  // Submit Review on Answer
  const handleSubmitOwnerReview = (questionId: string, answerId: string) => {
    onSubmitReview(questionId, {
      questionId,
      answerId,
      rating: reviewRating,
      understandable: reviewUnderstandable,
      feedback: reviewFeedback.trim(),
    });
    setReviewingAnswerId(null);
    setReviewFeedback('');
  };

  // Helper formatting
  const formatTimeAgo = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2.5">
            <HelpCircle className="w-6 h-6 text-indigo-400" />
            <span>Ask Students – Peer Learning Community</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Can't understand a textbook theorem or lab logic? Ask fellow B.Tech students or share your own answers!
          </p>
        </div>

        <button
          onClick={() => openAskModal()}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ask a Question</span>
        </button>
      </div>

      {/* Main Two-Column Layout or Question Detail View */}
      {!selectedQuestion ? (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search questions by topic, algorithm, or concept..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Subject Dropdown Filter (Includes Custom Subjects) */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400 hidden lg:inline">Subject:</span>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-indigo-500 focus:outline-none max-w-[190px] truncate"
                >
                  <option value="all">All Subjects</option>
                  {subjectsList.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              {/* Semester Filter */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400 hidden lg:inline">Sem:</span>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-indigo-500 focus:outline-none"
                >
                  <option value="all">All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={String(s)}>Sem {s}</option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-indigo-500 focus:outline-none"
              >
                <option value="newest">Most Recent</option>
                <option value="upvotes">Most Upvoted</option>
                <option value="answers">Most Answers</option>
              </select>
            </div>

            {/* Quick Status Chips */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => { setSelectedStatus('all'); setFilterMyQuestions(false); setFilterSaved(false); }}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedStatus === 'all' && !filterMyQuestions && !filterSaved
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                All Questions ({questions.length})
              </button>
              <button
                onClick={() => { setSelectedStatus('unanswered'); setFilterMyQuestions(false); setFilterSaved(false); }}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedStatus === 'unanswered'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Unanswered ({questions.filter((q) => q.answers.length === 0).length})
              </button>
              <button
                onClick={() => { setSelectedStatus('resolved'); setFilterMyQuestions(false); setFilterSaved(false); }}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedStatus === 'resolved'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Resolved ({questions.filter((q) => q.status === 'resolved').length})
              </button>
              <button
                onClick={() => setFilterMyQuestions(!filterMyQuestions)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  filterMyQuestions
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                My Questions ({questions.filter((q) => q.authorId === currentUser.id).length})
              </button>
              <button
                onClick={() => setFilterSaved(!filterSaved)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  filterSaved
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Saved Bookmarks
              </button>
            </div>
          </div>

          {/* Question Feed Cards */}
          <div className="space-y-3">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-16 rounded-2xl bg-[#0f172a]/50 border border-slate-800 space-y-3">
                <HelpCircle className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-semibold text-white">No questions found matching your filter</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Be the first to ask an engineering doubt or clear your search filters.
                </p>
                <button
                  onClick={() => openAskModal()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Ask a Question
                </button>
              </div>
            ) : (
              filteredQuestions.map((q) => {
                const isOwner = q.authorId === currentUser.id;
                const isSaved = q.savedBy && q.savedBy.includes(currentUser.id);
                const hasUpvoted = q.upvotedBy && q.upvotedBy.includes(currentUser.id);

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-slate-700 transition-all space-y-3 cursor-pointer shadow-sm hover:shadow-md"
                    onClick={() => setSelectedQuestion(q)}
                  >
                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={q.authorAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${q.authorName}`}
                          alt={q.authorName}
                          className="w-8 h-8 rounded-full border border-slate-700 object-cover"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onOpenStudentProfile) onOpenStudentProfile(q.authorId);
                              }}
                              className="text-xs font-bold text-white hover:text-cyan-400 transition-colors"
                            >
                              {q.authorName}
                            </span>
                            <span className="text-[10px] text-slate-400 px-1.5 py-0.2 rounded bg-slate-800">
                              {q.authorBranch} • Sem {q.semester}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500">{formatTimeAgo(q.createdAt)}</span>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex items-center space-x-2 self-start sm:self-auto">
                        {q.status === 'resolved' ? (
                          <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Resolved ✓</span>
                          </span>
                        ) : q.answers.length > 0 ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            {q.answers.length} Answer{q.answers.length === 1 ? '' : 's'}
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Unanswered
                          </span>
                        )}

                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 border border-slate-800 text-slate-400">
                          {q.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* Question Title */}
                    <h3 className="text-base font-bold text-white hover:text-indigo-400 transition-colors">
                      {q.title}
                    </h3>

                    {/* Snippet */}
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {q.description}
                    </p>

                    {/* Tags & Attachments */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-950/40 text-cyan-300 border border-cyan-800/40">
                        {q.subject}
                      </span>
                      {q.topic && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-900 text-slate-400 border border-slate-800">
                          {q.topic}
                        </span>
                      )}
                      {q.attachments && q.attachments.length > 0 && (
                        <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] bg-slate-900 border border-slate-800 text-slate-400">
                          <Paperclip className="w-3 h-3 text-cyan-400" />
                          <span>{q.attachments.length} file{q.attachments.length === 1 ? '' : 's'}</span>
                        </span>
                      )}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpvoteQuestion(q.id);
                          }}
                          className={`flex items-center space-x-1.5 transition-colors ${
                            hasUpvoted ? 'text-indigo-400 font-bold' : 'hover:text-white'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{q.upvotes} Upvotes</span>
                        </button>

                        <div className="flex items-center space-x-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                          <span>{q.answers.length} answers</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleSaveQuestion(q.id);
                          }}
                          className={`p-1.5 rounded-lg hover:bg-slate-800 transition-colors ${
                            isSaved ? 'text-purple-400' : 'text-slate-400 hover:text-white'
                          }`}
                          title={isSaved ? 'Remove from saved' : 'Save question'}
                        >
                          {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </button>

                        {isOwner && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openAskModal(q);
                              }}
                              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                              title="Edit question"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm('Are you sure you want to delete this question?')) {
                                  onDeleteQuestion(q.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10"
                              title="Delete question"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* ======================== QUESTION DETAIL VIEW ======================== */
        <div className="space-y-6">
          <button
            onClick={() => setSelectedQuestion(null)}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center space-x-1 mb-2"
          >
            <span>← Back to All Community Questions</span>
          </button>

          {/* Question Full Card */}
          <div className="p-6 rounded-3xl bg-[#0f172a] border border-slate-800 space-y-4 shadow-xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedQuestion.authorAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${selectedQuestion.authorName}`}
                  alt={selectedQuestion.authorName}
                  className="w-10 h-10 rounded-full border border-slate-700 object-cover"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span
                      onClick={() => onOpenStudentProfile && onOpenStudentProfile(selectedQuestion.authorId)}
                      className="text-sm font-bold text-white hover:text-cyan-400 cursor-pointer"
                    >
                      {selectedQuestion.authorName}
                    </span>
                    <span className="text-xs text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                      {selectedQuestion.authorBranch} • Semester {selectedQuestion.semester}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">Posted {formatTimeAgo(selectedQuestion.createdAt)}</span>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center space-x-2 self-start">
                {selectedQuestion.status === 'resolved' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Resolved ✓
                  </span>
                )}
                <button
                  onClick={() => onUpvoteQuestion(selectedQuestion.id)}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                    selectedQuestion.upvotedBy?.includes(currentUser.id)
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{selectedQuestion.upvotes} Upvotes</span>
                </button>
                <button
                  onClick={() => onToggleFollowQuestion(selectedQuestion.id)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                    selectedQuestion.followers?.includes(currentUser.id)
                      ? 'bg-cyan-600/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
                  }`}
                >
                  {selectedQuestion.followers?.includes(currentUser.id) ? 'Following ✓' : 'Follow Alerts'}
                </button>
              </div>
            </div>

            {/* Question Title & Description */}
            <h2 className="text-xl font-extrabold text-white">
              {selectedQuestion.title}
            </h2>

            <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              {selectedQuestion.description}
            </div>

            {/* Attachments if any */}
            {selectedQuestion.attachments && selectedQuestion.attachments.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-400 block">
                  Question Attachments ({selectedQuestion.attachments.length}):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedQuestion.attachments.map((f) => (
                    <div
                      key={f.id}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2 truncate pr-2">
                        {f.type.includes('image') ? (
                          <ImageIcon className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <FileText className="w-4 h-4 text-amber-400" />
                        )}
                        <span className="truncate font-medium text-slate-200">{f.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setPreviewFile(f)}
                          className="p-1 text-slate-400 hover:text-white"
                          title="Open preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={f.dataUrl}
                          download={f.name}
                          className="p-1 text-slate-400 hover:text-cyan-400"
                          title="Download"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Answers Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>Student Explanations & Solutions ({selectedQuestion.answers.length})</span>
            </h3>

            {/* Answer List */}
            {selectedQuestion.answers.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[#0f172a]/50 border border-slate-800 text-xs text-slate-400">
                No explanations submitted yet. If you understand this topic, submit your answer below!
              </div>
            ) : (
              selectedQuestion.answers.map((ans) => {
                const isAccepted = ans.isAccepted;
                const isQuestionOwner = selectedQuestion.authorId === currentUser.id;
                const hasVotedHelpful = ans.votedBy && ans.votedBy.includes(currentUser.id);
                const review = selectedQuestion.reviews?.find((r) => r.answerId === ans.id);

                return (
                  <div
                    key={ans.id}
                    className={`p-5 rounded-2xl border transition-all space-y-3.5 ${
                      isAccepted
                        ? 'bg-[#0b1720] border-emerald-500/50 shadow-md shadow-emerald-950/20'
                        : 'bg-[#0f172a] border-slate-800'
                    }`}
                  >
                    {/* Answer Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={ans.authorAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${ans.authorName}`}
                          alt={ans.authorName}
                          className="w-8 h-8 rounded-full border border-slate-700 object-cover"
                        />
                        <div>
                          <span
                            onClick={() => onOpenStudentProfile && onOpenStudentProfile(ans.authorId)}
                            className="text-xs font-bold text-white hover:text-cyan-400 cursor-pointer"
                          >
                            {ans.authorName}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            {formatTimeAgo(ans.timestamp)}
                          </span>
                        </div>
                      </div>

                      {/* Best Answer Badge or Accept Button */}
                      <div className="flex items-center space-x-2">
                        {isAccepted ? (
                          <span className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Accepted by Question Owner ✓</span>
                          </span>
                        ) : isQuestionOwner ? (
                          <button
                            onClick={() => onAcceptAnswer(selectedQuestion.id, ans.id)}
                            className="flex items-center space-x-1 px-3 py-1 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept this Answer</span>
                          </button>
                        ) : null}
                      </div>
                    </div>

                    {/* Answer Content */}
                    <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {ans.content}
                    </div>

                    {/* Voice Note Player if Present */}
                    {ans.voiceNoteUrl && (
                      <div className="p-3 rounded-xl bg-slate-950 border border-purple-500/30 flex items-center space-x-3 text-xs">
                        <Volume2 className="w-4 h-4 text-purple-400" />
                        <span className="font-semibold text-purple-300">
                          Audio Explanation ({ans.voiceNoteDuration || 15}s):
                        </span>
                        <audio controls src={ans.voiceNoteUrl} className="h-8 flex-1" />
                      </div>
                    )}

                    {/* Answer Attachments if Present */}
                    {ans.attachments && ans.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {ans.attachments.map((f) => (
                          <div
                            key={f.id}
                            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center space-x-2 text-xs"
                          >
                            <Paperclip className="w-3 h-3 text-cyan-400" />
                            <span className="font-medium text-slate-300 truncate max-w-[140px]">{f.name}</span>
                            <button onClick={() => setPreviewFile(f)} className="text-slate-400 hover:text-white">
                              <Eye className="w-3 h-3" />
                            </button>
                            <a href={f.dataUrl} download={f.name} className="text-slate-400 hover:text-cyan-400">
                              <Download className="w-3 h-3" />
                            </a>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Owner Review Badge if Already Reviewed */}
                    {review && (
                      <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-indigo-300">Question Owner Review:</span>
                          <div className="flex items-center text-amber-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3 h-3 ${s <= review.rating ? 'fill-amber-400' : 'text-slate-600'}`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-400 capitalize">
                            ({review.understandable})
                          </span>
                        </div>
                        {review.feedback && (
                          <p className="text-slate-300 italic">"{review.feedback}"</p>
                        )}
                      </div>
                    )}

                    {/* Action Footer: Helpful Button & Owner Review Trigger */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
                      <button
                        onClick={() => onVoteAnswerHelpful(selectedQuestion.id, ans.id)}
                        className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg border transition-colors ${
                          hasVotedHelpful
                            ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 font-semibold'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Helpful ({ans.helpfulVotes})</span>
                      </button>

                      {isQuestionOwner && !review && (
                        <button
                          onClick={() => setReviewingAnswerId(ans.id)}
                          className="flex items-center space-x-1 text-indigo-400 hover:underline"
                        >
                          <Star className="w-3.5 h-3.5" />
                          <span>Review this Explanation</span>
                        </button>
                      )}
                    </div>

                    {/* Review Form Drawer for Question Owner */}
                    {reviewingAnswerId === ans.id && (
                      <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/40 space-y-3 animate-fadeIn">
                        <h4 className="text-xs font-bold text-white">
                          Did this explanation help you understand the question?
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-slate-400">Rating:</span>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewRating(star)}
                                className="focus:outline-none"
                              >
                                <Star
                                  className={`w-5 h-5 ${
                                    star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-xs">
                          <span className="text-slate-400">Clarity:</span>
                          <select
                            value={reviewUnderstandable}
                            onChange={(e) => setReviewUnderstandable(e.target.value as any)}
                            className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none"
                          >
                            <option value="yes">Yes, crystal clear!</option>
                            <option value="partially">Partially helped</option>
                            <option value="needs-improvement">Needs more steps/diagrams</option>
                          </select>
                        </div>

                        <textarea
                          rows={2}
                          placeholder="Optional feedback about explanation clarity..."
                          value={reviewFeedback}
                          onChange={(e) => setReviewFeedback(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                        />

                        <div className="flex items-center justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => setReviewingAnswerId(null)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSubmitOwnerReview(selectedQuestion.id, ans.id)}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                          >
                            Submit Review
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Follow-up Comments */}
                    <div className="pt-2 border-t border-slate-800/60 space-y-2">
                      {ans.comments && ans.comments.length > 0 && (
                        <div className="space-y-1.5">
                          {ans.comments.map((comm) => (
                            <div key={comm.id} className="text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                              <span className="font-bold text-slate-300 mr-2">{comm.authorName}:</span>
                              <span className="text-slate-400">{comm.text}</span>
                              <span className="text-[10px] text-slate-600 block mt-0.5">{formatTimeAgo(comm.timestamp)}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Comment Input */}
                      <div className="flex items-center space-x-2 pt-1">
                        <input
                          type="text"
                          placeholder="Add a follow-up comment or question..."
                          value={commentInputs[ans.id] || ''}
                          onChange={(e) => setCommentInputs({ ...commentInputs, [ans.id]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handlePostComment(selectedQuestion.id, ans.id);
                            }
                          }}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => handlePostComment(selectedQuestion.id, ans.id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                        >
                          Comment
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Answer Post Form */}
            <div className="p-6 rounded-3xl bg-[#0f172a] border border-slate-800 space-y-4 shadow-xl">
              <h4 className="text-base font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Submit Your Answer & Explanation</span>
              </h4>

              {answerError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                  {answerError}
                </div>
              )}

              <form onSubmit={handlePostAnswer} className="space-y-4">
                <textarea
                  rows={4}
                  required={!recordedAudioBase64}
                  placeholder="Explain step-by-step with clear logic, theorems, or sample code vectors..."
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none leading-relaxed"
                />

                {/* Voice Note & File Attachment Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
                  {/* Voice Note Recording Controls */}
                  <div className="flex items-center space-x-2">
                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={startVoiceRecording}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-colors"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>Record Voice Note</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopVoiceRecording}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-semibold animate-pulse"
                      >
                        <Square className="w-3.5 h-3.5 fill-white" />
                        <span>Stop Recording ({recordingSeconds}s)</span>
                      </button>
                    )}

                    {recordedAudioBlobUrl && !isRecording && (
                      <div className="flex items-center space-x-2 text-xs text-purple-300 font-medium">
                        <audio controls src={recordedAudioBlobUrl} className="h-7 w-40" />
                        <button
                          type="button"
                          onClick={() => {
                            setRecordedAudioBlobUrl(null);
                            setRecordedAudioBase64(null);
                          }}
                          className="text-slate-400 hover:text-red-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Attachment File Input */}
                  <label className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold cursor-pointer transition-colors">
                    <Paperclip className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Attach Diagrams / PDF</span>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                      onChange={handleAnswerFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Attached Files Preview */}
                {answerAttachments.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {answerAttachments.map((f, i) => (
                      <div
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center space-x-1.5 text-xs text-slate-300"
                      >
                        <span className="truncate max-w-[150px]">{f.name}</span>
                        <button
                          type="button"
                          onClick={() => setAnswerAttachments(answerAttachments.filter((_, idx) => idx !== i))}
                          className="text-slate-500 hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02]"
                  >
                    Post Explanation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL: ASK A QUESTION ===================== */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl animate-scaleIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingQuestion ? 'Edit Your Question' : 'Ask Fellow Engineering Students'}
              </h3>
              <button
                onClick={() => setShowAskModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {qFormError && (
              <div className="mt-3 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {qFormError}
              </div>
            )}

            <form onSubmit={handleSubmitQuestion} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Question Title * (Clear, specific question)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Why does quicksort degrade to O(N²) on already sorted inputs?"
                  value={qTitle}
                  onChange={(e) => setQTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Detailed Explanation / Problem Statement *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe where you are stuck, textbook references, and what you have attempted..."
                  value={qDescription}
                  onChange={(e) => setQDescription(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Subject Selection & Custom Entry */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-200">Subject *</label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomSubject(!isCustomSubject);
                      setCustomSubjectText('');
                    }}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                  >
                    {isCustomSubject ? '← Select Standard' : '+ Type Custom Subject'}
                  </button>
                </div>
                {!isCustomSubject ? (
                  <select
                    value={qSubject}
                    onChange={(e) => setQSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  >
                    {subjectsList.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    placeholder="e.g. Python Programming, English Practice, Quantum Computing"
                    value={customSubjectText}
                    onChange={(e) => setCustomSubjectText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-cyan-500/50 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  />
                )}
              </div>

              {/* Semester & Topic */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-300">Semester</label>
                    <button
                      type="button"
                      onClick={() => setIsCustomSemester(!isCustomSemester)}
                      className="text-[10px] text-cyan-400 hover:underline"
                    >
                      {isCustomSemester ? 'Select' : '+ Custom'}
                    </button>
                  </div>
                  {!isCustomSemester ? (
                    <select
                      value={qSemester}
                      onChange={(e) => setQSemester(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={String(s)}>Semester {s}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="e.g. Semester 5 / Summer"
                      value={customSemesterText}
                      onChange={(e) => setCustomSemesterText(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Topic / Unit (Custom)</label>
                  <input
                    type="text"
                    placeholder="e.g. Unit 3 - Tree Rotations"
                    value={qTopic}
                    onChange={(e) => setQTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Difficulty Level</label>
                <div className="flex items-center space-x-2">
                  {(['Beginner', 'Intermediate', 'Advanced'] as QuestionDifficulty[]).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setQDifficulty(diff)}
                      className={`flex-1 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                        qDifficulty === diff
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Attachments Upload */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Optional Attachments (PDF notes, problem screenshots, diagrams)
                </label>
                <label className="flex items-center justify-center space-x-2 p-3 rounded-2xl bg-slate-950 border border-dashed border-slate-800 hover:border-slate-700 cursor-pointer text-xs text-slate-400 hover:text-white transition-colors">
                  <Upload className="w-4 h-4 text-cyan-400" />
                  <span>Click to upload PDF, DOCX, JPG or PNG (max 4MB each)</span>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    onChange={handleQuestionFileUpload}
                    className="hidden"
                  />
                </label>
                {qAttachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {qAttachments.map((f, i) => (
                      <div
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center space-x-1.5 text-xs text-slate-300"
                      >
                        <span className="truncate max-w-[150px]">{f.name}</span>
                        <button
                          type="button"
                          onClick={() => setQAttachments(qAttachments.filter((_, idx) => idx !== i))}
                          className="text-slate-500 hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
                >
                  {editingQuestion ? 'Update Question' : 'Post Question to Community'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== FILE PREVIEW MODAL ===================== */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-sm font-bold text-white truncate max-w-sm">{previewFile.name}</span>
              <button onClick={() => setPreviewFile(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="my-4 max-h-[70vh] overflow-auto flex items-center justify-center">
              {previewFile.type.includes('image') ? (
                <img src={previewFile.dataUrl} alt={previewFile.name} className="max-h-[65vh] rounded-xl object-contain" />
              ) : (
                <div className="text-center py-12 space-y-3">
                  <FileText className="w-16 h-16 text-cyan-400 mx-auto" />
                  <p className="text-sm text-slate-300 font-semibold">{previewFile.name}</p>
                  <a
                    href={previewFile.dataUrl}
                    download={previewFile.name}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Document</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
