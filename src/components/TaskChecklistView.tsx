import React, { useState, useMemo } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Search, 
  Code, 
  FlaskConical, 
  GraduationCap, 
  FileText, 
  Sparkles,
  Edit3,
  BookOpen,
  X,
  Settings,
  AlertCircle
} from 'lucide-react';
import { Task, TaskCategory, PriorityLevel } from '../types';
import { loadCustomTaxonomies, addCustomSubject, renameCustomSubject, deleteCustomSubject, addCustomCategory } from '../utils/storage';

interface TaskChecklistViewProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  onUpdateTask?: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onClearCompleted: () => void;
  availableSubjects?: string[];
  onSubjectsChange?: (subjects: string[]) => void;
}

export const TaskChecklistView: React.FC<TaskChecklistViewProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onClearCompleted,
  availableSubjects,
  onSubjectsChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'completed'>('all');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showManageSubjectsModal, setShowManageSubjectsModal] = useState(false);

  // Subject List State
  const [taxonomies, setTaxonomies] = useState(() => loadCustomTaxonomies());
  const subjectsList = availableSubjects || taxonomies.subjects;

  // Add Task Form states
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(subjectsList[0] || 'Data Structures & Algorithms');
  const [isDirectSubjectEntry, setIsDirectSubjectEntry] = useState(false);
  const [customSubjectInput, setCustomSubjectInput] = useState('');
  const [category, setCategory] = useState<string>('assignment');
  const [isCustomCategoryEntry, setIsCustomCategoryEntry] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Subject Management States
  const [renamingSubjectOld, setRenamingSubjectOld] = useState<string | null>(null);
  const [renameSubjectInput, setRenameSubjectInput] = useState('');
  const [newSubjectToManage, setNewSubjectToManage] = useState('');

  // Sync internal subject list
  const refreshSubjects = () => {
    const updated = loadCustomTaxonomies();
    setTaxonomies(updated);
    if (onSubjectsChange) {
      onSubjectsChange(updated.subjects);
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.notes && task.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category filter
      const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;

      // Subject filter
      const matchesSubject = selectedSubjectFilter === 'all' || task.subject === selectedSubjectFilter;

      // Status filter
      const matchesStatus =
        selectedStatus === 'all'
          ? true
          : selectedStatus === 'pending'
          ? !task.completed
          : task.completed;

      return matchesSearch && matchesCategory && matchesSubject && matchesStatus;
    });
  }, [tasks, searchQuery, selectedCategory, selectedSubjectFilter, selectedStatus]);

  // Handle Save New Subject explicitly
  const handleExplicitSaveSubject = () => {
    const trimmed = customSubjectInput.trim();
    if (!trimmed) return;
    const updated = addCustomSubject(trimmed);
    setTaxonomies(updated);
    setSubject(trimmed);
    setIsDirectSubjectEntry(false);
    setCustomSubjectInput('');
    if (onSubjectsChange) onSubjectsChange(updated.subjects);
  };

  // Open Add Modal
  const openAddModal = () => {
    setEditingTask(null);
    setTitle('');
    setSubject(subjectsList[0] || 'Data Structures & Algorithms');
    setIsDirectSubjectEntry(false);
    setCustomSubjectInput('');
    setCategory('assignment');
    setIsCustomCategoryEntry(false);
    setCustomCategoryInput('');
    setPriority('medium');
    setDueDate(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
    setNotes('');
    setFormError('');
    setShowAddModal(true);
  };

  // Open Edit Modal
  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setSubject(task.subject);
    setIsDirectSubjectEntry(false);
    setCustomSubjectInput('');
    setCategory(task.category);
    setIsCustomCategoryEntry(false);
    setCustomCategoryInput('');
    setPriority(task.priority);
    setDueDate(task.dueDate);
    setNotes(task.notes || '');
    setFormError('');
    setShowAddModal(true);
  };

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Task title is required.');
      return;
    }

    // Determine finalized subject name
    let finalSubject = subject;
    if (isDirectSubjectEntry) {
      if (!customSubjectInput.trim()) {
        setFormError('Please enter your custom subject name.');
        return;
      }
      finalSubject = customSubjectInput.trim();
      // Auto-save this custom subject to taxonomy
      const updated = addCustomSubject(finalSubject);
      setTaxonomies(updated);
      if (onSubjectsChange) onSubjectsChange(updated.subjects);
    }

    // Determine finalized category name
    let finalCategory = category;
    if (isCustomCategoryEntry) {
      if (!customCategoryInput.trim()) {
        setFormError('Please enter your custom category name.');
        return;
      }
      finalCategory = customCategoryInput.trim();
      const updated = addCustomCategory(finalCategory);
      setTaxonomies(updated);
    }

    if (editingTask && onUpdateTask) {
      onUpdateTask({
        ...editingTask,
        title: title.trim(),
        subject: finalSubject,
        category: finalCategory as TaskCategory,
        priority,
        dueDate: dueDate || new Date().toISOString().split('T')[0],
        notes: notes.trim() || undefined,
      });
    } else {
      onAddTask({
        title: title.trim(),
        subject: finalSubject,
        category: finalCategory as TaskCategory,
        priority,
        dueDate: dueDate || new Date().toISOString().split('T')[0],
        notes: notes.trim() || undefined,
      });
    }

    setShowAddModal(false);
  };

  // Subject Management Handlers
  const handleAddNewSubjectFromManager = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSubjectToManage.trim();
    if (!trimmed) return;
    const updated = addCustomSubject(trimmed);
    setTaxonomies(updated);
    setNewSubjectToManage('');
    if (onSubjectsChange) onSubjectsChange(updated.subjects);
  };

  const handleApplyRenameSubject = (oldName: string) => {
    const trimmed = renameSubjectInput.trim();
    if (!trimmed || trimmed === oldName) {
      setRenamingSubjectOld(null);
      return;
    }
    const updated = renameCustomSubject(oldName, trimmed);
    setTaxonomies(updated);
    setRenamingSubjectOld(null);
    setRenameSubjectInput('');
    if (onSubjectsChange) onSubjectsChange(updated.subjects);
    // Update affected tasks
    if (onUpdateTask) {
      tasks.forEach((t) => {
        if (t.subject === oldName) {
          onUpdateTask({ ...t, subject: trimmed });
        }
      });
    }
  };

  const handleDeleteSubject = (subToDelete: string) => {
    const tasksUsingSubject = tasks.filter((t) => t.subject === subToDelete);
    const confirmMessage = tasksUsingSubject.length > 0
      ? `"${subToDelete}" is used by ${tasksUsingSubject.length} active task(s). Deleting will keep those tasks safe under "${subToDelete}". Are you sure you want to remove it from your subjects list?`
      : `Remove "${subToDelete}" from your custom subjects list?`;
      
    if (window.confirm(confirmMessage)) {
      const updated = deleteCustomSubject(subToDelete);
      setTaxonomies(updated);
      if (selectedSubjectFilter === subToDelete) {
        setSelectedSubjectFilter('all');
      }
      if (onSubjectsChange) onSubjectsChange(updated.subjects);
    }
  };

  const getCategoryIcon = (cat: TaskCategory) => {
    switch (cat.toLowerCase()) {
      case 'coding':
        return <Code className="w-3.5 h-3.5 text-cyan-400" />;
      case 'lab':
        return <FlaskConical className="w-3.5 h-3.5 text-amber-400" />;
      case 'exam':
        return <GraduationCap className="w-3.5 h-3.5 text-purple-400" />;
      case 'assignment':
        return <FileText className="w-3.5 h-3.5 text-blue-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <CheckSquare className="w-6 h-6 text-emerald-400" />
            <span>Engineering Task Checklist</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Organize assignments, lab write-ups, custom subjects, and semester goals
          </p>
        </div>

        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          <button
            onClick={() => setShowManageSubjectsModal(true)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors border border-slate-700"
            title="Manage, create, rename, and delete custom subjects"
          >
            <Settings className="w-3.5 h-3.5 text-cyan-400" />
            <span>Manage Subjects ({subjectsList.length})</span>
          </button>

          {completedCount > 0 && (
            <button
              onClick={onClearCompleted}
              className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-semibold transition-colors"
            >
              Clear Completed ({completedCount})
            </button>
          )}

          <button
            onClick={openAddModal}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by task title, topic, or custom subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Subject Filter Dropdown (Supports All Custom Subjects) */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">Subject:</span>
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:border-emerald-500 focus:outline-none max-w-[200px] truncate"
            >
              <option value="all">All Subjects ({subjectsList.length})</option>
              {subjectsList.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* Status selector */}
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedStatus === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({tasks.length})
            </button>
            <button
              onClick={() => setSelectedStatus('pending')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedStatus === 'pending' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Pending ({tasks.length - completedCount})
            </button>
            <button
              onClick={() => setSelectedStatus('completed')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedStatus === 'completed' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Done ({completedCount})
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All Categories
          </button>
          {taxonomies.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat.toLowerCase())}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedCategory === cat.toLowerCase()
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 rounded-2xl bg-[#0f172a]/50 border border-slate-800">
            <CheckSquare className="w-12 h-12 text-slate-600 mx-auto mb-2" />
            <h3 className="text-base font-semibold text-white">No tasks match your filters</h3>
            <p className="text-xs text-slate-400 mt-1">Try clearing your filters or create a new task with your custom subject!</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-xl border transition-all ${
                task.completed
                  ? 'bg-[#0f172a]/40 border-slate-800/60 opacity-60'
                  : 'bg-[#0f172a] border-slate-800 hover:border-slate-700 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-3.5 flex-1">
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors focus:outline-none flex-shrink-0"
                    title={task.completed ? 'Mark pending' : 'Mark completed'}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <p
                      className={`text-sm font-semibold ${
                        task.completed ? 'line-through text-slate-400' : 'text-slate-100'
                      }`}
                    >
                      {task.title}
                    </p>

                    {task.notes && (
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {task.notes}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-900 border border-slate-800 text-slate-300">
                        {getCategoryIcon(task.category)}
                        <span className="capitalize">{task.category}</span>
                      </span>

                      {/* Subject Badge */}
                      <span className="text-[11px] text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-800/40">
                        {task.subject}
                      </span>

                      <span className="text-[10px] text-slate-600">•</span>

                      <span className="text-[11px] text-slate-400 flex items-center">
                        <Clock className="w-3 h-3 mr-1 text-slate-500" />
                        Due: {task.dueDate}
                      </span>

                      <span
                        className={`px-1.5 py-0.2 text-[10px] font-bold rounded uppercase ${
                          task.priority === 'high'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : task.priority === 'medium'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-green-500/20 text-green-300 border border-green-500/30'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openEditModal(task)}
                    className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    title="Edit task"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ==================== ADD / EDIT TASK MODAL ==================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-scaleIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingTask ? 'Edit Engineering Task' : 'Add Engineering Task'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-3 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitTask} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Dijkstra Algorithm, Study Operating Systems Unit 3"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* SUBJECT SELECTION & CUSTOM CREATION */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-200">
                    Subject Name *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDirectSubjectEntry(!isDirectSubjectEntry);
                      setCustomSubjectInput('');
                    }}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                  >
                    <span>{isDirectSubjectEntry ? '← Choose from Existing List' : '+ Create New Subject'}</span>
                  </button>
                </div>

                {!isDirectSubjectEntry ? (
                  <div className="space-y-2">
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none"
                    >
                      {subjectsList.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                    <p className="text-[11px] text-slate-500">
                      Need a subject not listed? Click <strong>+ Create New Subject</strong> to type any subject name!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 animate-fadeIn">
                    <label className="block text-[11px] font-medium text-cyan-300">
                      Enter Your Own Subject Name:
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        autoFocus
                        required
                        placeholder="e.g. Python Programming, Engineering Mathematics, My Personal Project, English Practice"
                        value={customSubjectInput}
                        onChange={(e) => setCustomSubjectInput(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-cyan-500/50 text-white text-sm focus:border-cyan-400 focus:outline-none font-medium"
                      />
                      <button
                        type="button"
                        onClick={handleExplicitSaveSubject}
                        disabled={!customSubjectInput.trim()}
                        className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-semibold transition-all"
                      >
                        Save Subject
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      This custom subject will be saved into your permanent curriculum and will appear in focus timers, filters, and reports.
                    </p>
                  </div>
                )}
              </div>

              {/* CATEGORY SELECTION & CUSTOM CREATION */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-300">Category</label>
                    <button
                      type="button"
                      onClick={() => setIsCustomCategoryEntry(!isCustomCategoryEntry)}
                      className="text-[10px] text-emerald-400 hover:underline"
                    >
                      {isCustomCategoryEntry ? 'Existing' : '+ Custom'}
                    </button>
                  </div>
                  {!isCustomCategoryEntry ? (
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none capitalize"
                    >
                      <option value="assignment">Assignment</option>
                      <option value="lab">Lab Write-up</option>
                      <option value="coding">Coding & Algorithms</option>
                      <option value="exam">Exam Prep</option>
                      <option value="general">General</option>
                      {taxonomies.categories.filter(c => !['assignment', 'lab', 'coding', 'exam', 'general'].includes(c.toLowerCase())).map((c) => (
                        <option key={c} value={c.toLowerCase()}>{c}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="e.g. Hackathon, Mini Project"
                      value={customCategoryInput}
                      onChange={(e) => setCustomCategoryInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none capitalize"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Due Deadline</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Notes / Key Concepts (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Key theorems, algorithm notes, submission requirements..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30"
                >
                  {editingTask ? 'Update Task' : 'Save Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MANAGE SUBJECTS MODAL ==================== */}
      {showManageSubjectsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-scaleIn max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  <span>Curriculum Subjects Directory</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Add, rename, or delete subjects across your entire B.Tech workspace
                </p>
              </div>
              <button
                onClick={() => setShowManageSubjectsModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Add New Subject */}
            <form onSubmit={handleAddNewSubjectFromManager} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
              <label className="block text-xs font-semibold text-slate-200">
                + Add Another Custom Subject
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="e.g. Python Programming, English Practice, Cloud Architecture"
                  value={newSubjectToManage}
                  onChange={(e) => setNewSubjectToManage(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!newSubjectToManage.trim()}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-semibold shadow-sm"
                >
                  Add Subject
                </button>
              </div>
            </form>

            {/* List of Subjects */}
            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
              {subjectsList.map((sub) => {
                const count = tasks.filter((t) => t.subject === sub).length;
                const isRenaming = renamingSubjectOld === sub;

                return (
                  <div
                    key={sub}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    {isRenaming ? (
                      <div className="flex items-center space-x-2 flex-1 mr-2">
                        <input
                          type="text"
                          value={renameSubjectInput}
                          onChange={(e) => setRenameSubjectInput(e.target.value)}
                          className="flex-1 px-2.5 py-1 rounded-lg bg-slate-950 border border-cyan-500 text-white text-xs focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => handleApplyRenameSubject(sub)}
                          className="px-2.5 py-1 rounded-lg bg-cyan-600 text-white font-semibold text-[11px]"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setRenamingSubjectOld(null)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 text-[11px]"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="truncate pr-2">
                          <span className="font-semibold text-slate-200 block truncate">{sub}</span>
                          <span className="text-[10px] text-slate-500">
                            {count} active task{count === 1 ? '' : 's'} assigned
                          </span>
                        </div>

                        <div className="flex items-center space-x-1 flex-shrink-0">
                          <button
                            onClick={() => {
                              setRenamingSubjectOld(sub);
                              setRenameSubjectInput(sub);
                            }}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                            title="Rename Subject"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSubject(sub)}
                            className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10"
                            title="Delete Subject"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-800 text-right">
              <button
                onClick={() => setShowManageSubjectsModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
