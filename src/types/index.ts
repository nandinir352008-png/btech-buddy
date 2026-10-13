export type TaskCategory = 'assignment' | 'lab' | 'exam' | 'coding' | 'general' | (string & {});
export type PriorityLevel = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  subject: string;
  priority: PriorityLevel;
  dueDate: string; // YYYY-MM-DD
  completed: boolean;
  completedAt?: string;
  notes?: string;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface TimetableSlot {
  id: string;
  day: DayOfWeek;
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:00"
  subject: string;
  room: string;
  faculty: string;
  type: 'theory' | 'lab' | 'tutorial' | 'break';
  color?: string;
}

export type LabStatus = 'pending' | 'written' | 'submitted' | 'checked' | 'signed';
export type ExperimentStatus = 'pending' | 'in-progress' | 'completed' | 'submitted' | 'signed';

export interface AttachedFile {
  id: string;
  name: string;
  size: number; // bytes
  type: string; // mime type (pdf, doc, docx, png, jpg, etc.)
  uploadedAt: string;
  dataUrl: string; // base64 for preview, open, and download
  description?: string;
}

export interface Experiment {
  id: string;
  labId: string;
  experimentNumber: number;
  title: string;
  aim?: string;
  equipment?: string; // Apparatus, software, tools required
  procedure?: string;
  observations?: string; // Tabular values, code snippet, output readings
  result?: string;
  remarks?: string; // Faculty comments / corrections
  dateConducted: string;
  submissionDeadline?: string;
  status: ExperimentStatus;
  vivaPrepared: boolean;
  files: AttachedFile[];
}

export interface LabCourse {
  id: string;
  name: string;
  code?: string;
  branch: string; // e.g. 'CSE', 'ECE', 'AI & ML', etc.
  category: string; // e.g. 'Software & Systems', 'Hardware', 'Core Engineering'
  semester: number;
  academicYear?: string;
  description: string;
  facultyInCharge?: string;
  isCustom: boolean;
  createdAt: string;
  files: AttachedFile[]; // Lab syllabus, manual, templates
  experiments: Experiment[];
}

export interface LabRecord {
  id: string;
  subject: string;
  experimentNumber: number;
  title: string;
  dateConducted: string;
  submissionDeadline: string;
  faculty: string;
  status: LabStatus;
  vivaPrepared: boolean;
  remarks?: string;
}

export type AssignmentStatus = 'not-started' | 'in-progress' | 'submitted' | 'evaluated';

export interface Assignment {
  id: string;
  subject: string;
  title: string;
  deadline: string;
  totalMarks: number;
  status: AssignmentStatus;
  priority: PriorityLevel;
  description?: string;
}

export interface TimerSession {
  id: string;
  timestamp: string;
  durationMinutes: number;
  subject: string;
  mode: 'pomodoro' | 'deep-work' | 'custom';
}

export interface SubjectAttendance {
  id: string;
  subject: string;
  code: string;
  attended: number;
  total: number;
  credits: number;
  targetGrade?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  modelUsed?: string;
  thinkingUsed?: boolean;
  isError?: boolean;
  imageThumbnail?: string;
}

// -------------------------------------------------------------
// USER ACCOUNTS & AUTH
// -------------------------------------------------------------
export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  branch: string;
  semester: number | string;
  bio?: string;
  interests?: string[];
  joinedAt: string;
  provider: 'email' | 'google' | 'phone' | 'guest';
  isPublicProfile: boolean;
  following: string[]; // User IDs followed
  followersCount: number;
}

// -------------------------------------------------------------
// CUSTOM TAXONOMIES & PERSONALIZATION
// -------------------------------------------------------------
export interface CustomTaxonomies {
  subjects: string[];
  categories: string[];
  topics: string[];
  branches: string[];
  semesters: string[];
}

// -------------------------------------------------------------
// STUDENT QUESTION COMMUNITY
// -------------------------------------------------------------
export type QuestionStatus = 'unanswered' | 'answered' | 'resolved';
export type QuestionDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface AnswerComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  text: string;
  timestamp: string;
}

export interface QuestionAnswer {
  id: string;
  questionId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorBranch?: string;
  authorSemester?: string | number;
  content: string; // text answer
  voiceNoteUrl?: string; // base64 / audio URL
  voiceNoteDuration?: number; // seconds
  videoUrl?: string; // base64 / video URL
  attachments: AttachedFile[];
  timestamp: string;
  helpfulVotes: number;
  votedBy: string[]; // user IDs who upvoted
  isAccepted: boolean;
  comments: AnswerComment[];
}

export interface QuestionReview {
  id: string;
  questionId: string;
  answerId: string;
  reviewerId: string;
  reviewerName: string;
  rating: number; // 1 to 5 stars
  understandable: 'yes' | 'partially' | 'needs-improvement';
  feedback: string;
  timestamp: string;
}

export interface CommunityQuestion {
  id: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorBranch: string;
  semester: string | number;
  subject: string;
  topic?: string;
  difficulty: QuestionDifficulty;
  tags: string[];
  isAnonymous: boolean;
  status: QuestionStatus;
  createdAt: string;
  attachments: AttachedFile[];
  answers: QuestionAnswer[];
  reviews: QuestionReview[];
  savedBy: string[]; // user IDs who bookmarked
  followers: string[]; // user IDs following this question for alerts
  upvotes: number;
  upvotedBy: string[];
}

// -------------------------------------------------------------
// STUDENT PROFILES & DIRECT MESSAGING
// -------------------------------------------------------------
export interface DirectMessage {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachment?: AttachedFile;
}

export interface StudentProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  branch: string;
  semester: string | number;
  bio: string;
  interests: string[];
  college?: string;
  isPublic: boolean;
  tasksCompletedCount: number;
  focusHours: number;
  questionsAskedCount: number;
  questionsAnsweredCount: number;
  helpfulVotesCount: number;
  followers: string[];
  following: string[];
  isOnline?: boolean;
}

// -------------------------------------------------------------
// NOTIFICATIONS INBOX
// -------------------------------------------------------------
export type NotificationType = 
  | 'new_answer'
  | 'answer_accepted'
  | 'new_comment'
  | 'direct_message'
  | 'question_resolved'
  | 'new_follower'
  | 'question_upvoted'
  | 'question_reply'
  | 'system';

export interface NotificationItem {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkTab: TabType;
  referenceId?: string; // questionId or senderId
  senderName?: string;
  senderAvatar?: string;
}

export type TabType = 
  | 'dashboard'
  | 'timetable'
  | 'tasks'
  | 'timer'
  | 'labs'
  | 'progress'
  | 'community'
  | 'inbox'
  | 'students'
  | 'auth'
  | 'ai-mentor'
  | 'docs';
