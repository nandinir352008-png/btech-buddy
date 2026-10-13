import React, { useState, useEffect, useMemo } from 'react';
import { 
  Task, 
  TimetableSlot, 
  LabRecord, 
  LabCourse,
  Experiment,
  AttachedFile,
  Assignment, 
  TimerSession, 
  SubjectAttendance, 
  ChatMessage, 
  TabType,
  LabStatus,
  AssignmentStatus,
  UserAccount,
  CustomTaxonomies,
  CommunityQuestion,
  QuestionAnswer,
  QuestionReview,
  StudentProfile,
  DirectMessage,
  NotificationItem,
  TaskCategory,
  PriorityLevel
} from './types';
import { 
  STORAGE_KEYS, 
  INITIAL_TASKS, 
  INITIAL_TIMETABLE, 
  INITIAL_LAB_COURSES,
  INITIAL_ASSIGNMENTS, 
  INITIAL_ATTENDANCE, 
  INITIAL_TIMER_LOGS, 
  INITIAL_CHAT,
  loadFromStorage, 
  loadLabCoursesFromStorage,
  saveToStorage,
  loadCustomTaxonomies,
  saveCustomTaxonomies,
  addCustomSubject,
  loadCurrentUser,
  saveCurrentUser,
  loadCommunityQuestions,
  saveCommunityQuestions,
  loadStudentProfiles,
  saveStudentProfiles,
  loadDirectMessages,
  saveDirectMessages,
  loadNotifications,
  saveNotifications,
  resetAllDataToDefault 
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { TimetableView } from './components/TimetableView';
import { TaskChecklistView } from './components/TaskChecklistView';
import { StudyTimerView } from './components/StudyTimerView';
import { LabsAssignmentsView } from './components/LabsAssignmentsView';
import { ProgressDashboardView } from './components/ProgressDashboardView';
import { AIAssistantView } from './components/AIAssistantView';
import { ProjectDocsModal } from './components/ProjectDocsModal';
import { AskStudentsView } from './components/AskStudentsView';
import { InboxView } from './components/InboxView';
import { StudentChatView } from './components/StudentChatView';
import { AuthView } from './components/AuthView';
import { ProfileModal, ProfileModalMode } from './components/ProfileModal';

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');

  // Application Data States (synced with LocalStorage)
  const [tasks, setTasks] = useState<Task[]>(() => loadFromStorage(STORAGE_KEYS.TASKS, INITIAL_TASKS));
  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => loadFromStorage(STORAGE_KEYS.TIMETABLE, INITIAL_TIMETABLE));
  const [labCourses, setLabCourses] = useState<LabCourse[]>(() => loadLabCoursesFromStorage());
  const [assignments, setAssignments] = useState<Assignment[]>(() => loadFromStorage(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS));
  const [timerLogs, setTimerLogs] = useState<TimerSession[]>(() => loadFromStorage(STORAGE_KEYS.TIMER_LOGS, INITIAL_TIMER_LOGS));
  const [attendance, setAttendance] = useState<SubjectAttendance[]>(() => loadFromStorage(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE));
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => loadFromStorage(STORAGE_KEYS.CHAT, INITIAL_CHAT));
  const [isAILoading, setIsAILoading] = useState(false);

  // User Accounts & Social States
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => loadCurrentUser());
  const [taxonomies, setTaxonomies] = useState<CustomTaxonomies>(() => loadCustomTaxonomies());
  const [questions, setQuestions] = useState<CommunityQuestion[]>(() => loadCommunityQuestions());
  const [studentProfiles, setStudentProfiles] = useState<StudentProfile[]>(() => loadStudentProfiles());
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>(() => loadDirectMessages());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadNotifications());

  // Profile Modal State
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileModalMode, setProfileModalMode] = useState<ProfileModalMode>('view_public');
  const [selectedChatStudentId, setSelectedChatStudentId] = useState<string | undefined>(undefined);

  // Quick Add Task Modal State (accessible from Dashboard)
  const [showGlobalAddTask, setShowGlobalAddTask] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickSubject, setQuickSubject] = useState(taxonomies.subjects[0] || 'Data Structures & Algorithms');
  const [isQuickCustomSubject, setIsQuickCustomSubject] = useState(false);
  const [quickCustomSubjectInput, setQuickCustomSubjectInput] = useState('');
  const [quickPriority, setQuickPriority] = useState<PriorityLevel>('medium');
  const [quickCategory, setQuickCategory] = useState<TaskCategory>('assignment');
  const [quickDueDate, setQuickDueDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);

  // Derive flat lab records from labCourses for Dashboard and Progress Analytics
  const flatLabRecords: LabRecord[] = useMemo(() => {
    return labCourses.flatMap((course) =>
      course.experiments.map((exp) => ({
        id: exp.id,
        subject: course.name,
        experimentNumber: exp.experimentNumber,
        title: exp.title,
        dateConducted: exp.dateConducted,
        submissionDeadline: exp.submissionDeadline || exp.dateConducted,
        faculty: course.facultyInCharge || course.branch,
        status: (exp.status === 'in-progress' ? 'pending' : exp.status === 'completed' ? 'written' : exp.status) as LabStatus,
        vivaPrepared: exp.vivaPrepared,
        remarks: exp.remarks,
      }))
    );
  }, [labCourses]);

  // Persist on changes
  useEffect(() => { saveToStorage(STORAGE_KEYS.TASKS, tasks); }, [tasks]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.TIMETABLE, timetable); }, [timetable]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.LAB_COURSES, labCourses); }, [labCourses]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.ASSIGNMENTS, assignments); }, [assignments]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.TIMER_LOGS, timerLogs); }, [timerLogs]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.ATTENDANCE, attendance); }, [attendance]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.CHAT, chatMessages); }, [chatMessages]);
  useEffect(() => { saveCurrentUser(currentUser); }, [currentUser]);
  useEffect(() => { saveCustomTaxonomies(taxonomies); }, [taxonomies]);
  useEffect(() => { saveCommunityQuestions(questions); }, [questions]);
  useEffect(() => { saveStudentProfiles(studentProfiles); }, [studentProfiles]);
  useEffect(() => { saveDirectMessages(directMessages); }, [directMessages]);
  useEffect(() => { saveNotifications(notifications); }, [notifications]);

  // ================= NOTIFICATION DISPATCHER =================
  const dispatchNotification = (
    recipientUserId: string,
    type: any,
    title: string,
    message: string,
    linkTab: TabType,
    referenceId?: string
  ) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId: recipientUserId,
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      linkTab,
      referenceId,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatarUrl,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // ================= TASK HANDLERS =================
  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? new Date().toISOString() : undefined,
            }
          : t
      )
    );
  };

  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'completed'>) => {
    // If subject is new, add to taxonomy
    if (newTaskData.subject && !taxonomies.subjects.includes(newTaskData.subject)) {
      const updatedTax = addCustomSubject(newTaskData.subject);
      setTaxonomies(updatedTax);
    }

    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    if (updatedTask.subject && !taxonomies.subjects.includes(updatedTask.subject)) {
      const updatedTax = addCustomSubject(updatedTask.subject);
      setTaxonomies(updatedTax);
    }
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleClearCompletedTasks = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  // ================= TIMETABLE HANDLERS =================
  const handleAddTimetableSlot = (slotData: Omit<TimetableSlot, 'id'>) => {
    const newSlot: TimetableSlot = {
      ...slotData,
      id: `tt-${Date.now()}`,
    };
    setTimetable((prev) => [...prev, newSlot]);
  };

  const handleDeleteTimetableSlot = (id: string) => {
    setTimetable((prev) => prev.filter((s) => s.id !== id));
  };

  const handleResetTimetable = () => {
    if (window.confirm('Reset timetable to standard B.Tech computer science class schedule?')) {
      setTimetable(INITIAL_TIMETABLE);
    }
  };

  // ================= LAB COURSE HANDLERS =================
  const handleAddLabCourse = (courseData: Omit<LabCourse, 'id' | 'createdAt'>) => {
    const newCourse: LabCourse = {
      ...courseData,
      id: `custom-lab-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setLabCourses((prev) => [newCourse, ...prev]);
    // Save subject to taxonomies
    if (courseData.name && !taxonomies.subjects.includes(courseData.name)) {
      const updatedTax = addCustomSubject(courseData.name);
      setTaxonomies(updatedTax);
    }
  };

  const handleUpdateLabCourse = (updatedCourse: LabCourse) => {
    setLabCourses((prev) =>
      prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c))
    );
  };

  const handleDeleteLabCourse = (id: string) => {
    setLabCourses((prev) => prev.filter((c) => c.id !== id));
  };

  // Experiment Handlers
  const handleAddExperiment = (labId: string, experimentData: Omit<Experiment, 'id' | 'labId'>) => {
    const newExp: Experiment = {
      ...experimentData,
      id: `exp-${Date.now()}`,
      labId,
    };
    setLabCourses((prev) =>
      prev.map((course) =>
        course.id === labId
          ? { ...course, experiments: [...course.experiments, newExp] }
          : course
      )
    );
  };

  const handleUpdateExperiment = (labId: string, updatedExp: Experiment) => {
    setLabCourses((prev) =>
      prev.map((course) =>
        course.id === labId
          ? {
              ...course,
              experiments: course.experiments.map((e) =>
                e.id === updatedExp.id ? updatedExp : e
              ),
            }
          : course
      )
    );
  };

  const handleDeleteExperiment = (labId: string, experimentId: string) => {
    setLabCourses((prev) =>
      prev.map((course) =>
        course.id === labId
          ? {
              ...course,
              experiments: course.experiments.filter((e) => e.id !== experimentId),
            }
          : course
      )
    );
  };

  // File Upload Handlers
  const handleAddLabFile = (labId: string, file: AttachedFile, experimentId?: string) => {
    setLabCourses((prev) =>
      prev.map((course) => {
        if (course.id !== labId) return course;
        if (experimentId) {
          return {
            ...course,
            experiments: course.experiments.map((exp) =>
              exp.id === experimentId
                ? { ...exp, files: [...(exp.files || []), file] }
                : exp
            ),
          };
        } else {
          return {
            ...course,
            files: [...(course.files || []), file],
          };
        }
      })
    );
  };

  const handleDeleteLabFile = (labId: string, fileId: string, experimentId?: string) => {
    setLabCourses((prev) =>
      prev.map((course) => {
        if (course.id !== labId) return course;
        if (experimentId) {
          return {
            ...course,
            experiments: course.experiments.map((exp) =>
              exp.id === experimentId
                ? { ...exp, files: (exp.files || []).filter((f) => f.id !== fileId) }
                : exp
            ),
          };
        } else {
          return {
            ...course,
            files: (course.files || []).filter((f) => f.id !== fileId),
          };
        }
      })
    );
  };

  const handleRenameLabFile = (labId: string, fileId: string, newName: string, experimentId?: string) => {
    setLabCourses((prev) =>
      prev.map((course) => {
        if (course.id !== labId) return course;
        if (experimentId) {
          return {
            ...course,
            experiments: course.experiments.map((exp) =>
              exp.id === experimentId
                ? {
                    ...exp,
                    files: (exp.files || []).map((f) =>
                      f.id === fileId ? { ...f, name: newName } : f
                    ),
                  }
                : exp
            ),
          };
        } else {
          return {
            ...course,
            files: (course.files || []).map((f) =>
              f.id === fileId ? { ...f, name: newName } : f
            ),
          };
        }
      })
    );
  };

  // Assignment Handlers
  const handleAddAssignment = (asgData: Omit<Assignment, 'id'>) => {
    const newAsg: Assignment = {
      ...asgData,
      id: `asg-${Date.now()}`,
    };
    setAssignments((prev) => [newAsg, ...prev]);
  };

  const handleUpdateAssignmentStatus = (id: string, status: AssignmentStatus) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  // Timer Session Handlers
  const handleLogTimerSession = (session: TimerSession) => {
    setTimerLogs((prev) => [...prev, session]);
  };

  // Attendance Handlers
  const handleUpdateAttendance = (id: string, attended: number, total: number) => {
    setAttendance((prev) =>
      prev.map((att) =>
        att.id === id
          ? {
              ...att,
              attended: Math.max(0, attended),
              total: Math.max(attended, total),
            }
          : att
      )
    );
  };

  // ================= COMMUNITY QUESTIONS HANDLERS =================
  const handleAddQuestion = (
    qData: Omit<CommunityQuestion, 'id' | 'createdAt' | 'answers' | 'reviews' | 'savedBy' | 'followers' | 'upvotes' | 'upvotedBy'>
  ) => {
    const newQ: CommunityQuestion = {
      ...qData,
      id: `q-${Date.now()}`,
      createdAt: new Date().toISOString(),
      answers: [],
      reviews: [],
      savedBy: [],
      followers: [currentUser.id],
      upvotes: 1,
      upvotedBy: [currentUser.id],
    };

    setQuestions((prev) => [newQ, ...prev]);

    // Notify any following students
    currentUser.following?.forEach((followedId) => {
      dispatchNotification(
        followedId,
        'question_reply',
        'New Peer Question',
        `${currentUser.name} asked: "${newQ.title}" in ${newQ.subject}`,
        'community',
        newQ.id
      );
    });
  };

  const handleUpdateQuestion = (updatedQ: CommunityQuestion) => {
    setQuestions((prev) => prev.map((q) => (q.id === updatedQ.id ? updatedQ : q)));
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleAddAnswer = (
    questionId: string,
    answerData: Omit<QuestionAnswer, 'id' | 'timestamp' | 'helpfulVotes' | 'votedBy' | 'isAccepted' | 'comments'>
  ) => {
    const newAns: QuestionAnswer = {
      ...answerData,
      id: `ans-${Date.now()}`,
      timestamp: new Date().toISOString(),
      helpfulVotes: 0,
      votedBy: [],
      isAccepted: false,
      comments: [],
    };

    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        const updatedAnswers = [...q.answers, newAns];
        return {
          ...q,
          status: q.status === 'unanswered' ? 'answered' : q.status,
          answers: updatedAnswers,
        };
      })
    );

    // Notify question owner
    const targetQ = questions.find((q) => q.id === questionId);
    if (targetQ && targetQ.authorId !== currentUser.id) {
      dispatchNotification(
        targetQ.authorId,
        'new_answer',
        'New Answer to Your Question',
        `${currentUser.name} posted an explanation on "${targetQ.title}"`,
        'community',
        targetQ.id
      );
    }
  };

  const handleUpvoteQuestion = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        const hasVoted = q.upvotedBy?.includes(currentUser.id);
        const upvotedBy = hasVoted
          ? q.upvotedBy.filter((id) => id !== currentUser.id)
          : [...(q.upvotedBy || []), currentUser.id];
        const upvotes = hasVoted ? q.upvotes - 1 : q.upvotes + 1;

        if (!hasVoted && q.authorId !== currentUser.id) {
          dispatchNotification(
            q.authorId,
            'question_upvoted',
            'Question Upvoted',
            `${currentUser.name} upvoted your question: "${q.title}"`,
            'community',
            q.id
          );
        }

        return { ...q, upvotes, upvotedBy };
      })
    );
  };

  const handleToggleSaveQuestion = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        const isSaved = q.savedBy?.includes(currentUser.id);
        const savedBy = isSaved
          ? q.savedBy.filter((id) => id !== currentUser.id)
          : [...(q.savedBy || []), currentUser.id];
        return { ...q, savedBy };
      })
    );
  };

  const handleToggleFollowQuestion = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        const isFollowing = q.followers?.includes(currentUser.id);
        const followers = isFollowing
          ? q.followers.filter((id) => id !== currentUser.id)
          : [...(q.followers || []), currentUser.id];
        return { ...q, followers };
      })
    );
  };

  const handleVoteAnswerHelpful = (questionId: string, answerId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        return {
          ...q,
          answers: q.answers.map((ans) => {
            if (ans.id !== answerId) return ans;
            const hasVoted = ans.votedBy?.includes(currentUser.id);
            const votedBy = hasVoted
              ? ans.votedBy.filter((id) => id !== currentUser.id)
              : [...(ans.votedBy || []), currentUser.id];
            const helpfulVotes = hasVoted ? ans.helpfulVotes - 1 : ans.helpfulVotes + 1;
            return { ...ans, helpfulVotes, votedBy };
          }),
        };
      })
    );
  };

  const handleAcceptAnswer = (questionId: string, answerId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        return {
          ...q,
          status: 'resolved',
          answers: q.answers.map((ans) => ({
            ...ans,
            isAccepted: ans.id === answerId,
          })),
        };
      })
    );

    const targetQ = questions.find((q) => q.id === questionId);
    const targetAns = targetQ?.answers.find((a) => a.id === answerId);
    if (targetAns && targetAns.authorId !== currentUser.id) {
      dispatchNotification(
        targetAns.authorId,
        'answer_accepted',
        'Answer Accepted as Best Solution ✓',
        `The author accepted your explanation for: "${targetQ?.title}"`,
        'community',
        questionId
      );
    }
  };

  const handleAddAnswerComment = (questionId: string, answerId: string, text: string) => {
    const newComment = {
      id: `comm-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatarUrl,
      text,
      timestamp: new Date().toISOString(),
    };

    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        return {
          ...q,
          answers: q.answers.map((ans) => {
            if (ans.id !== answerId) return ans;
            return {
              ...ans,
              comments: [...(ans.comments || []), newComment],
            };
          }),
        };
      })
    );
  };

  const handleSubmitReview = (
    questionId: string,
    reviewData: Omit<QuestionReview, 'id' | 'timestamp' | 'reviewerId' | 'reviewerName'>
  ) => {
    const newReview: QuestionReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      timestamp: new Date().toISOString(),
      reviewerId: currentUser.id,
      reviewerName: currentUser.name,
    };

    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        return {
          ...q,
          reviews: [...(q.reviews || []), newReview],
        };
      })
    );
  };

  // ================= DIRECT MESSAGES & SOCIAL =================
  const handleSendMessage = (recipientId: string, content: string, attachment?: AttachedFile) => {
    const newMsg: DirectMessage = {
      id: `dm-${Date.now()}`,
      senderId: currentUser.id,
      recipientId,
      content,
      timestamp: new Date().toISOString(),
      read: false,
      attachment,
    };
    setDirectMessages((prev) => [...prev, newMsg]);

    const recipient = studentProfiles.find((p) => p.id === recipientId);
    dispatchNotification(
      recipientId,
      'direct_message',
      `Message from ${currentUser.name}`,
      content.slice(0, 80),
      'students',
      currentUser.id
    );
  };

  const handleToggleFollowStudent = (targetStudentId: string) => {
    const isCurrentlyFollowing = currentUser.following?.includes(targetStudentId);
    const updatedFollowing = isCurrentlyFollowing
      ? currentUser.following.filter((id) => id !== targetStudentId)
      : [...(currentUser.following || []), targetStudentId];

    const updatedUser = { ...currentUser, following: updatedFollowing };
    setCurrentUser(updatedUser);

    // Update target student profile followers
    setStudentProfiles((prev) =>
      prev.map((p) => {
        if (p.id !== targetStudentId) return p;
        const followers = isCurrentlyFollowing
          ? p.followers.filter((id) => id !== currentUser.id)
          : [...(p.followers || []), currentUser.id];
        return { ...p, followers };
      })
    );

    if (!isCurrentlyFollowing) {
      dispatchNotification(
        targetStudentId,
        'new_follower',
        'New Student Follower',
        `${currentUser.name} started following your academic activity!`,
        'students',
        currentUser.id
      );
    }
  };

  // ================= NOTIFICATIONS HANDLERS =================
  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearReadNotifications = () => {
    setNotifications((prev) => prev.filter((n) => !n.read));
  };

  // ================= USER ACCOUNT SIGN IN / OUT =================
  const handleSignInSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    // Sync into studentProfiles
    setStudentProfiles((prev) => {
      const exists = prev.some((p) => p.id === user.id);
      if (exists) {
        return prev.map((p) => (p.id === user.id ? { ...p, name: user.name, avatarUrl: user.avatarUrl, branch: user.branch, semester: user.semester } : p));
      }
      const newP: StudentProfile = {
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
        branch: user.branch,
        semester: user.semester,
        bio: user.bio || 'B.Tech Student',
        interests: user.interests || ['Computer Science'],
        isPublic: true,
        tasksCompletedCount: 0,
        focusHours: 0,
        questionsAskedCount: 0,
        questionsAnsweredCount: 0,
        helpfulVotesCount: 0,
        followers: [],
        following: [],
        isOnline: true,
      };
      return [...prev, newP];
    });
    setCurrentTab('dashboard');
  };

  const handleSignOut = () => {
    if (window.confirm('Sign out of your account? Your local data will remain saved on this device.')) {
      const guestUser: UserAccount = {
        id: 'usr-guest',
        name: 'Guest Student',
        email: 'guest@btech.edu',
        branch: 'CSE',
        semester: 1,
        provider: 'guest',
        isPublicProfile: false,
        following: [],
        followersCount: 0,
        joinedAt: new Date().toISOString(),
      };
      setCurrentUser(guestUser);
      setCurrentTab('auth');
    }
  };

  const handleUpdateUser = (updatedUser: UserAccount) => {
    setCurrentUser(updatedUser);
    setStudentProfiles((prev) =>
      prev.map((p) => (p.id === updatedUser.id ? { ...p, name: updatedUser.name, avatarUrl: updatedUser.avatarUrl, branch: updatedUser.branch, semester: updatedUser.semester, bio: updatedUser.bio || p.bio } : p))
    );
  };

  // Open profile modal
  const handleOpenProfileModal = (mode: ProfileModalMode) => {
    setProfileModalMode(mode);
    setProfileModalOpen(true);
  };

  // Open direct student chat
  const handleOpenStudentChat = (studentId: string) => {
    setSelectedChatStudentId(studentId);
    setCurrentTab('students');
  };

  // AI Chat & Doubt Solver Handlers
  const handleSendMessageAI = async (
    userMessage: string,
    role: string,
    model: string,
    thinking: boolean
  ) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: userMessage,
      timestamp: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsAILoading(true);

    try {
      const history = chatMessages.slice(-10).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history,
          role,
          modelPreference: model,
          thinking,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reach Gemini API');

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        text: data.reply,
        timestamp: new Date().toISOString(),
        modelUsed: data.modelUsed,
        thinkingUsed: data.thinkingUsed,
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Error generating AI response:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: `⚠️ **Notice**: ${err.message || 'Unable to connect to Gemini API.'}\n\n*Make sure your GEMINI_API_KEY is configured in the AI Studio Secrets panel. The rest of the productivity app (Timetable, Focus Timer, 75% Attendance, Community, Labs) remains 100% functional!*`,
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsAILoading(false);
    }
  };

  // AI Image Understanding Handler
  const handleAnalyzeImage = async (
    imageBase64: string,
    mimeType: string,
    prompt: string,
    thinking: boolean
  ) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: prompt,
      timestamp: new Date().toISOString(),
      imageThumbnail: imageBase64,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsAILoading(true);

    try {
      const res = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, mimeType, prompt, thinking }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to analyze image');

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        text: data.analysis,
        timestamp: new Date().toISOString(),
        modelUsed: data.modelUsed,
        thinkingUsed: data.thinkingUsed,
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Image analysis error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: `⚠️ **Image Understanding Notice**: ${err.message || 'Unable to analyze image.'}`,
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsAILoading(false);
    }
  };

  const handleClearChatHistory = () => {
    if (window.confirm('Clear conversation history?')) {
      setChatMessages(INITIAL_CHAT);
    }
  };

  // Reload data from storage
  const handleRefreshAllData = () => {
    setTasks(loadFromStorage(STORAGE_KEYS.TASKS, INITIAL_TASKS));
    setTimetable(loadFromStorage(STORAGE_KEYS.TIMETABLE, INITIAL_TIMETABLE));
    setLabCourses(loadFromStorage(STORAGE_KEYS.LAB_COURSES, INITIAL_LAB_COURSES));
    setAssignments(loadFromStorage(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS));
    setTimerLogs(loadFromStorage(STORAGE_KEYS.TIMER_LOGS, INITIAL_TIMER_LOGS));
    setAttendance(loadFromStorage(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE));
    setQuestions(loadCommunityQuestions());
    setStudentProfiles(loadStudentProfiles());
    setDirectMessages(loadDirectMessages());
    setNotifications(loadNotifications());
    setTaxonomies(loadCustomTaxonomies());
  };

  // Quick Task Submit
  const handleQuickTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    let finalSubject = quickSubject;
    if (isQuickCustomSubject) {
      if (!quickCustomSubjectInput.trim()) return;
      finalSubject = quickCustomSubjectInput.trim();
      const updatedTax = addCustomSubject(finalSubject);
      setTaxonomies(updatedTax);
    }

    handleAddTask({
      title: quickTitle.trim(),
      subject: finalSubject,
      category: quickCategory,
      priority: quickPriority,
      dueDate: quickDueDate,
    });
    setQuickTitle('');
    setShowGlobalAddTask(false);
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const urgentDeadlinesCount = flatLabRecords.filter(l => l.status === 'pending' || l.status === 'written').length +
    assignments.filter(a => a.status === 'in-progress' || a.status === 'not-started').length;

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        taskCount={tasks.filter((t) => !t.completed).length}
        urgentDeadlinesCount={urgentDeadlinesCount}
        currentUser={currentUser}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenProfileModal={handleOpenProfileModal}
        onSignOut={handleSignOut}
        onOpenAuth={() => setCurrentTab('auth')}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'dashboard' && (
          <DashboardView
            tasks={tasks}
            timetable={timetable}
            labs={flatLabRecords}
            assignments={assignments}
            onToggleTask={handleToggleTask}
            onNavigateTab={(tab) => setCurrentTab(tab)}
            onOpenAddTask={() => setShowGlobalAddTask(true)}
          />
        )}

        {currentTab === 'timetable' && (
          <TimetableView
            timetable={timetable}
            onAddSlot={handleAddTimetableSlot}
            onDeleteSlot={handleDeleteTimetableSlot}
            onResetTimetable={handleResetTimetable}
          />
        )}

        {currentTab === 'tasks' && (
          <TaskChecklistView
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onClearCompleted={handleClearCompletedTasks}
            availableSubjects={taxonomies.subjects}
            onSubjectsChange={(subs) => setTaxonomies((prev) => ({ ...prev, subjects: subs }))}
          />
        )}

        {currentTab === 'timer' && (
          <StudyTimerView
            timerLogs={timerLogs}
            onLogSession={handleLogTimerSession}
            availableSubjects={taxonomies.subjects}
          />
        )}

        {currentTab === 'labs' && (
          <LabsAssignmentsView
            labCourses={labCourses}
            assignments={assignments}
            onAddLabCourse={handleAddLabCourse}
            onUpdateLabCourse={handleUpdateLabCourse}
            onDeleteLabCourse={handleDeleteLabCourse}
            onAddExperiment={handleAddExperiment}
            onUpdateExperiment={handleUpdateExperiment}
            onDeleteExperiment={handleDeleteExperiment}
            onAddLabFile={handleAddLabFile}
            onDeleteLabFile={handleDeleteLabFile}
            onRenameLabFile={handleRenameLabFile}
            onAddAssignment={handleAddAssignment}
            onUpdateAssignmentStatus={handleUpdateAssignmentStatus}
            onDeleteAssignment={handleDeleteAssignment}
            onOpenAIVivaPrompt={(subject, title) => {
              setCurrentTab('ai-mentor');
              handleSendMessageAI(
                `Generate 5 viva voce questions with concise answers for ${subject} practical: ${title}`,
                'viva',
                'gemini-3.5-flash',
                false
              );
            }}
          />
        )}

        {currentTab === 'community' && (
          <AskStudentsView
            currentUser={currentUser}
            questions={questions}
            onAddQuestion={handleAddQuestion}
            onUpdateQuestion={handleUpdateQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            onAddAnswer={handleAddAnswer}
            onUpvoteQuestion={handleUpvoteQuestion}
            onToggleSaveQuestion={handleToggleSaveQuestion}
            onToggleFollowQuestion={handleToggleFollowQuestion}
            onVoteAnswerHelpful={handleVoteAnswerHelpful}
            onAcceptAnswer={handleAcceptAnswer}
            onAddAnswerComment={handleAddAnswerComment}
            onSubmitReview={handleSubmitReview}
            onOpenStudentProfile={handleOpenStudentChat}
            availableSubjects={taxonomies.subjects}
          />
        )}

        {currentTab === 'inbox' && (
          <InboxView
            notifications={notifications}
            onMarkAsRead={handleMarkNotificationAsRead}
            onMarkAllAsRead={handleMarkAllNotificationsAsRead}
            onClearReadNotifications={handleClearReadNotifications}
            onNavigateTab={(tab, refId) => {
              if (tab === 'students' && refId) {
                setSelectedChatStudentId(refId);
              }
              setCurrentTab(tab);
            }}
          />
        )}

        {currentTab === 'students' && (
          <StudentChatView
            currentUser={currentUser}
            profiles={studentProfiles}
            messages={directMessages}
            onSendMessage={handleSendMessage}
            onToggleFollow={handleToggleFollowStudent}
            initialSelectedStudentId={selectedChatStudentId}
          />
        )}

        {currentTab === 'auth' && (
          <AuthView
            onSignInSuccess={handleSignInSuccess}
            onContinueAsGuest={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'progress' && (
          <ProgressDashboardView
            tasks={tasks}
            labs={flatLabRecords}
            assignments={assignments}
            timerLogs={timerLogs}
            attendance={attendance}
            onUpdateAttendance={handleUpdateAttendance}
          />
        )}

        {currentTab === 'ai-mentor' && (
          <AIAssistantView
            chatMessages={chatMessages}
            onSendMessage={handleSendMessageAI}
            onAnalyzeImage={handleAnalyzeImage}
            onClearHistory={handleClearChatHistory}
            isLoading={isAILoading}
          />
        )}

        {currentTab === 'docs' && (
          <ProjectDocsModal
            onRefreshData={handleRefreshAllData}
          />
        )}
      </main>

      {/* Global Quick Add Task Modal */}
      {showGlobalAddTask && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scaleIn">
            <h3 className="text-lg font-bold text-white mb-1">Quick Add Task</h3>
            <p className="text-xs text-slate-400 mb-4">Add deliverable to your priority checklist</p>

            <form onSubmit={handleQuickTaskSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Dijkstra Algorithm in C++"
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Subject Selection / Custom Entry */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-300">Subject</label>
                  <button
                    type="button"
                    onClick={() => setIsQuickCustomSubject(!isQuickCustomSubject)}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    {isQuickCustomSubject ? 'Select Standard' : '+ Type Custom'}
                  </button>
                </div>
                {!isQuickCustomSubject ? (
                  <select
                    value={quickSubject}
                    onChange={(e) => setQuickSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
                  >
                    {taxonomies.subjects.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    placeholder="Enter custom subject name..."
                    value={quickCustomSubjectInput}
                    onChange={(e) => setQuickCustomSubjectInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-cyan-500/50 text-white text-sm focus:border-cyan-400 focus:outline-none"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={quickCategory}
                    onChange={(e) => setQuickCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="assignment">Assignment</option>
                    <option value="lab">Lab Write-up</option>
                    <option value="coding">Coding & Algorithms</option>
                    <option value="exam">Exam Prep</option>
                    <option value="general">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
                  <select
                    value={quickPriority}
                    onChange={(e) => setQuickPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Due Date</label>
                <input
                  type="date"
                  value={quickDueDate}
                  onChange={(e) => setQuickDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGlobalAddTask(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Profile & Privacy Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        currentUser={currentUser}
        allProfiles={studentProfiles}
        initialMode={profileModalMode}
        onUpdateUser={handleUpdateUser}
        onSignOut={handleSignOut}
        onToggleFollow={handleToggleFollowStudent}
        onNavigateTab={(tab) => {
          setProfileModalOpen(false);
          setCurrentTab(tab);
        }}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-[#070a12] py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>B.Tech Buddy • Engineering Student Productivity & Community Suite</span>
          <div className="flex items-center space-x-3 text-[11px] text-slate-400">
            <span>Powered by Gemini 3.1 & 3.5</span>
            <span>•</span>
            <span>LocalStorage Persistence</span>
            <span>•</span>
            <button onClick={() => setCurrentTab('docs')} className="text-blue-400 hover:underline">
              Project Architecture
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
