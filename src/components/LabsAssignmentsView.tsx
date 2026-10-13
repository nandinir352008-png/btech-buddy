import React, { useState, useMemo, useRef } from 'react';
import { 
  FlaskConical, 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Bot, 
  X, 
  Filter, 
  AlertCircle, 
  Upload, 
  Download, 
  Eye, 
  File, 
  Image as ImageIcon, 
  FileCode, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  BookOpen, 
  Layers, 
  Cpu, 
  Wrench, 
  HardHat, 
  Compass, 
  Atom, 
  FolderPlus,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { 
  LabCourse, 
  Experiment, 
  AttachedFile, 
  ExperimentStatus, 
  Assignment, 
  AssignmentStatus, 
  PriorityLevel 
} from '../types';

interface LabsAssignmentsViewProps {
  labCourses: LabCourse[];
  assignments: Assignment[];
  onAddLabCourse: (course: Omit<LabCourse, 'id' | 'createdAt'>) => void;
  onUpdateLabCourse: (course: LabCourse) => void;
  onDeleteLabCourse: (id: string) => void;
  onAddExperiment: (labId: string, experiment: Omit<Experiment, 'id' | 'labId'>) => void;
  onUpdateExperiment: (labId: string, experiment: Experiment) => void;
  onDeleteExperiment: (labId: string, experimentId: string) => void;
  onAddLabFile: (labId: string, file: AttachedFile, experimentId?: string) => void;
  onDeleteLabFile: (labId: string, fileId: string, experimentId?: string) => void;
  onRenameLabFile: (labId: string, fileId: string, newName: string, experimentId?: string) => void;
  onAddAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  onUpdateAssignmentStatus: (id: string, status: AssignmentStatus) => void;
  onDeleteAssignment: (id: string) => void;
  onOpenAIVivaPrompt: (subject: string, experimentTitle: string) => void;
}

const BRANCHES = [
  'All Branches',
  'CSE',
  'CSD',
  'Data Science',
  'AI & ML',
  'IT',
  'ECE',
  'EEE',
  'Mechanical',
  'Civil',
  'Chemical',
  'Biotechnology',
  'Common 1st Year',
  'Custom / Student Created',
];

const CATEGORIES = [
  'All Categories',
  'Computer & Software',
  'Design & Interactive Systems',
  'Electronics & Hardware',
  'Core Engineering',
  'Chemical Engineering & Process',
  'Bioengineering & Life Sciences',
  'Specialized & Emerging',
  'Basic Sciences & Workshop',
];

export const LabsAssignmentsView: React.FC<LabsAssignmentsViewProps> = ({
  labCourses,
  assignments,
  onAddLabCourse,
  onUpdateLabCourse,
  onDeleteLabCourse,
  onAddExperiment,
  onUpdateExperiment,
  onDeleteExperiment,
  onAddLabFile,
  onDeleteLabFile,
  onRenameLabFile,
  onAddAssignment,
  onUpdateAssignmentStatus,
  onDeleteAssignment,
  onOpenAIVivaPrompt,
}) => {
  // Navigation between Laboratories & Theory Assignments
  const [activeMainTab, setActiveMainTab] = useState<'labs' | 'assignments'>('labs');

  // Search and Filter States for Labs
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  // Active Selected Lab (Drawer/Detail view)
  const [selectedLabId, setSelectedLabId] = useState<string | null>(labCourses[0]?.id || null);

  // Modals
  const [showCreateLabModal, setShowCreateLabModal] = useState(false);
  const [editingLabCourse, setEditingLabCourse] = useState<LabCourse | null>(null);
  const [showAddExpModal, setShowAddExpModal] = useState(false);
  const [editingExperiment, setEditingExperiment] = useState<Experiment | null>(null);
  const [showAddAsgModal, setShowAddAsgModal] = useState(false);

  // File Preview / Modal
  const [previewFile, setPreviewFile] = useState<AttachedFile | null>(null);

  // File Upload State
  const [uploadTargetExpId, setUploadTargetExpId] = useState<string | undefined>(undefined);
  const [fileUploadError, setFileUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Rename File Modal
  const [renamingFile, setRenamingFile] = useState<{ labId: string; fileId: string; currentName: string; expId?: string } | null>(null);
  const [renameInput, setRenameInput] = useState('');

  // Form States for Custom Lab
  const [labName, setLabName] = useState('');
  const [labCode, setLabCode] = useState('');
  const [labBranch, setLabBranch] = useState('CSE');
  const [customBranchInput, setCustomBranchInput] = useState('');
  const [labCategory, setLabCategory] = useState('Computer & Software');
  const [labSemester, setLabSemester] = useState<number>(3);
  const [labAcademicYear, setLabAcademicYear] = useState('2026-2027');
  const [labDescription, setLabDescription] = useState('');
  const [labFaculty, setLabFaculty] = useState('');
  const [labFormError, setLabFormError] = useState('');

  // Form States for Experiment
  const [expNum, setExpNum] = useState<number>(1);
  const [expTitle, setExpTitle] = useState('');
  const [expAim, setExpAim] = useState('');
  const [expEquipment, setExpEquipment] = useState('');
  const [expProcedure, setExpProcedure] = useState('');
  const [expObservations, setExpObservations] = useState('');
  const [expResult, setExpResult] = useState('');
  const [expRemarks, setExpRemarks] = useState('');
  const [expDateConducted, setExpDateConducted] = useState(new Date().toISOString().split('T')[0]);
  const [expDeadline, setExpDeadline] = useState(new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]);
  const [expStatus, setExpStatus] = useState<ExperimentStatus>('in-progress');
  const [expFormError, setExpFormError] = useState('');

  // Form States for Theory Assignment
  const [asgSubject, setAsgSubject] = useState('Operating Systems');
  const [asgTitle, setAsgTitle] = useState('');
  const [asgDeadline, setAsgDeadline] = useState(new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0]);
  const [asgMarks, setAsgMarks] = useState<number>(20);
  const [asgPriority, setAsgPriority] = useState<PriorityLevel>('high');
  const [asgDesc, setAsgDesc] = useState('');
  const [asgFormError, setAsgFormError] = useState('');

  // Viva Voce Generation Modal
  const [vivaModalOpen, setVivaModalOpen] = useState(false);
  const [vivaLoading, setVivaLoading] = useState(false);
  const [vivaContent, setVivaContent] = useState('');
  const [vivaSubject, setVivaSubject] = useState('');
  const [vivaTitle, setVivaTitle] = useState('');

  // Currently active selected lab course
  const currentLab = useMemo(() => {
    return labCourses.find((c) => c.id === selectedLabId) || labCourses[0] || null;
  }, [labCourses, selectedLabId]);

  // Filtered Lab Courses
  const filteredLabCourses = useMemo(() => {
    return labCourses.filter((lab) => {
      // Search
      const searchMatch =
        !searchQuery.trim() ||
        lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lab.code && lab.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
        lab.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.experiments.some((e) =>
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (e.aim && e.aim.toLowerCase().includes(searchQuery.toLowerCase()))
        );

      // Branch filter
      let branchMatch = true;
      if (selectedBranch === 'Custom / Student Created') {
        branchMatch = lab.isCustom;
      } else if (selectedBranch !== 'All Branches') {
        branchMatch = lab.branch.toLowerCase() === selectedBranch.toLowerCase();
      }

      // Category filter
      let categoryMatch = true;
      if (selectedCategory !== 'All Categories') {
        categoryMatch = lab.category.toLowerCase() === selectedCategory.toLowerCase();
      }

      // Semester filter
      const semMatch = selectedSemester === 'all' || lab.semester === selectedSemester;

      // Status filter
      let statusMatch = true;
      if (selectedStatusFilter === 'custom') {
        statusMatch = lab.isCustom;
      } else if (selectedStatusFilter === 'pending') {
        statusMatch = lab.experiments.some((e) => e.status !== 'signed');
      } else if (selectedStatusFilter === 'completed') {
        statusMatch = lab.experiments.length > 0 && lab.experiments.every((e) => e.status === 'signed');
      }

      return searchMatch && branchMatch && categoryMatch && semMatch && statusMatch;
    });
  }, [labCourses, searchQuery, selectedBranch, selectedCategory, selectedSemester, selectedStatusFilter]);

  // Helper format file sizes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Helper file icon
  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return <FileText className="w-4 h-4 text-red-400" />;
    if (mimeType.includes('image')) return <ImageIcon className="w-4 h-4 text-cyan-400" />;
    if (mimeType.includes('word') || mimeType.includes('document')) return <File className="w-4 h-4 text-blue-400" />;
    if (mimeType.includes('text') || mimeType.includes('code')) return <FileCode className="w-4 h-4 text-amber-400" />;
    return <File className="w-4 h-4 text-slate-400" />;
  };

  // Handle File Upload from device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentLab) return;

    // Validate size (max 8MB per file for local storage safety)
    const MAX_SIZE = 8 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setFileUploadError('File size exceeds 8MB limit. Please upload a smaller file or compressed PDF.');
      return;
    }

    setFileUploadError('');
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const newFile: AttachedFile = {
        id: `file-${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        uploadedAt: new Date().toISOString(),
        dataUrl,
      };

      onAddLabFile(currentLab.id, newFile, uploadTargetExpId);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setUploadTargetExpId(undefined);
    };
    reader.onerror = () => {
      setFileUploadError('Failed to read file from device.');
    };
    reader.readAsDataURL(file);
  };

  // Trigger file upload for lab or specific experiment
  const triggerFileUpload = (expId?: string) => {
    setUploadTargetExpId(expId);
    setFileUploadError('');
    fileInputRef.current?.click();
  };

  // Open Create Custom Lab Modal
  const openCreateLabModal = () => {
    setEditingLabCourse(null);
    setLabName('');
    setLabCode('');
    setLabBranch('CSE');
    setCustomBranchInput('');
    setLabCategory('Computer & Software');
    setLabSemester(3);
    setLabAcademicYear('2026-2027');
    setLabDescription('');
    setLabFaculty('');
    setLabFormError('');
    setShowCreateLabModal(true);
  };

  // Open Edit Lab Modal
  const openEditLabModal = (lab: LabCourse) => {
    setEditingLabCourse(lab);
    setLabName(lab.name);
    setLabCode(lab.code || '');
    setLabBranch(lab.branch);
    setCustomBranchInput(lab.branch);
    setLabCategory(lab.category);
    setLabSemester(lab.semester);
    setLabAcademicYear(lab.academicYear || '2026-2027');
    setLabDescription(lab.description);
    setLabFaculty(lab.facultyInCharge || '');
    setLabFormError('');
    setShowCreateLabModal(true);
  };

  // Submit Custom / Edited Lab
  const handleSubmitLab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!labName.trim()) {
      setLabFormError('Lab name is required.');
      return;
    }

    const finalBranch = labBranch === 'Other / Custom' ? (customBranchInput.trim() || 'Custom') : labBranch;

    if (editingLabCourse) {
      onUpdateLabCourse({
        ...editingLabCourse,
        name: labName.trim(),
        code: labCode.trim() || undefined,
        branch: finalBranch,
        category: labCategory,
        semester: Number(labSemester) || 1,
        academicYear: labAcademicYear.trim() || undefined,
        description: labDescription.trim(),
        facultyInCharge: labFaculty.trim() || undefined,
      });
    } else {
      onAddLabCourse({
        name: labName.trim(),
        code: labCode.trim() || undefined,
        branch: finalBranch,
        category: labCategory,
        semester: Number(labSemester) || 1,
        academicYear: labAcademicYear.trim() || undefined,
        description: labDescription.trim() || 'Custom engineering laboratory.',
        facultyInCharge: labFaculty.trim() || undefined,
        isCustom: true,
        files: [],
        experiments: [],
      });
    }

    setShowCreateLabModal(false);
  };

  // Open Add Experiment Modal
  const openAddExperimentModal = (nextNum: number) => {
    setEditingExperiment(null);
    setExpNum(nextNum);
    setExpTitle('');
    setExpAim('');
    setExpEquipment('');
    setExpProcedure('');
    setExpObservations('');
    setExpResult('');
    setExpRemarks('');
    setExpDateConducted(new Date().toISOString().split('T')[0]);
    setExpDeadline(new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]);
    setExpStatus('in-progress');
    setExpFormError('');
    setShowAddExpModal(true);
  };

  // Open Edit Experiment Modal
  const openEditExperimentModal = (exp: Experiment) => {
    setEditingExperiment(exp);
    setExpNum(exp.experimentNumber);
    setExpTitle(exp.title);
    setExpAim(exp.aim || '');
    setExpEquipment(exp.equipment || '');
    setExpProcedure(exp.procedure || '');
    setExpObservations(exp.observations || '');
    setExpResult(exp.result || '');
    setExpRemarks(exp.remarks || '');
    setExpDateConducted(exp.dateConducted);
    setExpDeadline(exp.submissionDeadline || exp.dateConducted);
    setExpStatus(exp.status);
    setExpFormError('');
    setShowAddExpModal(true);
  };

  // Submit Experiment
  const handleSubmitExperiment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle.trim() || !currentLab) {
      setExpFormError('Experiment title is required.');
      return;
    }

    if (editingExperiment) {
      onUpdateExperiment(currentLab.id, {
        ...editingExperiment,
        experimentNumber: Number(expNum) || 1,
        title: expTitle.trim(),
        aim: expAim.trim() || undefined,
        equipment: expEquipment.trim() || undefined,
        procedure: expProcedure.trim() || undefined,
        observations: expObservations.trim() || undefined,
        result: expResult.trim() || undefined,
        remarks: expRemarks.trim() || undefined,
        dateConducted: expDateConducted,
        submissionDeadline: expDeadline,
        status: expStatus,
      });
    } else {
      onAddExperiment(currentLab.id, {
        experimentNumber: Number(expNum) || 1,
        title: expTitle.trim(),
        aim: expAim.trim() || undefined,
        equipment: expEquipment.trim() || undefined,
        procedure: expProcedure.trim() || undefined,
        observations: expObservations.trim() || undefined,
        result: expResult.trim() || undefined,
        remarks: expRemarks.trim() || undefined,
        dateConducted: expDateConducted,
        submissionDeadline: expDeadline,
        status: expStatus,
        vivaPrepared: false,
        files: [],
      });
    }

    setShowAddExpModal(false);
  };

  // Viva Voce Generator Trigger
  const handleGenerateViva = async (subject: string, title: string, expNumber: number) => {
    setVivaSubject(subject);
    setVivaTitle(`Exp #${expNumber}: ${title}`);
    setVivaModalOpen(true);
    setVivaLoading(true);
    setVivaContent('');

    try {
      const res = await fetch('/api/study-tools/viva-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          experimentTitle: title,
          experimentNumber: expNumber,
        }),
      });

      const data = await res.json();
      if (res.ok && data.vivaQnA) {
        setVivaContent(data.vivaQnA);
      } else {
        setVivaContent(`### Top Viva Voce Questions for ${subject} (${title}):

1. **What is the fundamental working principle of this experiment?**
   - *Model Answer*: The experiment validates state transition dynamics and verifies output parameters against theoretical boundary calculations.

2. **What are the common edge cases external university examiners test during evaluation?**
   - *Model Answer*: Zero inputs, negative indices, buffer overruns, race conditions, and precision tolerances.

3. **How does this concept apply in production engineering systems?**
   - *Model Answer*: Real-world production engines (Linux kernel, relational databases, industrial PLCs) utilize optimized variants for fault tolerance and high throughput.`);
      }
    } catch {
      setVivaContent(`### Recommended Viva Voce Preparation Guide:
1. Explain the step-by-step mathematical or algorithmic theory behind ${title}.
2. What are the time and space complexity or hardware tolerance trade-offs?
3. Which components or system calls are critical to this experiment?`);
    } finally {
      setVivaLoading(false);
    }
  };

  // Handle Download File
  const handleDownloadFile = (f: AttachedFile) => {
    const link = document.createElement('a');
    link.href = f.dataUrl;
    link.download = f.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Export Single Lab Data as JSON Backup
  const handleExportLab = (lab: LabCourse) => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(lab, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `lab-${(lab.code || lab.name).toLowerCase().replace(/[^a-z0-9]/g, '-')}-record.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error('Failed to export lab data:', err);
    }
  };

  // Helper experiment status badge
  const getExperimentStatusBadge = (status: ExperimentStatus) => {
    switch (status) {
      case 'signed':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Faculty Signed ✓</span>;
      case 'submitted':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">Submitted</span>;
      case 'completed':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Completed</span>;
      case 'in-progress':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">In Progress</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Pending</span>;
    }
  };

  // Handle Create Theory Assignment
  const handleCreateAsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asgTitle.trim()) {
      setAsgFormError('Assignment title is required.');
      return;
    }
    onAddAssignment({
      subject: asgSubject,
      title: asgTitle.trim(),
      deadline: asgDeadline,
      totalMarks: Number(asgMarks) || 20,
      status: 'in-progress',
      priority: asgPriority,
      description: asgDesc.trim() || undefined,
    });
    setAsgTitle('');
    setAsgDesc('');
    setAsgFormError('');
    setShowAddAsgModal(false);
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Hidden File Input for uploading to lab or experiment */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp,.txt,.csv,.c,.cpp,.py,.java,.sql,.v,.vhdl"
      />

      {/* Main Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <FlaskConical className="w-6 h-6 text-cyan-400" />
            <span>Engineering Laboratories & Experiments Suite</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Curated laboratory directory for Indian universities, custom lab creator, experiment logs & file upload manager
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={openCreateLabModal}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02]"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Create Custom Lab</span>
          </button>
        </div>
      </div>

      {/* Main Tabs (Laboratories vs Theory Assignments) */}
      <div className="flex items-center space-x-2 p-1.5 rounded-2xl bg-[#0f172a] border border-slate-800 w-fit">
        <button
          onClick={() => setActiveMainTab('labs')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeMainTab === 'labs'
              ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>Lab Directory & Records ({labCourses.length} Labs)</span>
        </button>
        <button
          onClick={() => setActiveMainTab('assignments')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeMainTab === 'assignments'
              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Theory Assignments ({assignments.length})</span>
        </button>
      </div>

      {/* ===================== LABS DIRECTORY SECTION ===================== */}
      {activeMainTab === 'labs' && (
        <div className="space-y-5">
          
          {/* Search, Branch Filter & Category & Semester Pills */}
          <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search labs, subjects, aims, experiment titles (e.g. Python, DBMS, CAD, Saponification, Circuit)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* Multi-Filters: Semester, Subject Category & Status Filter */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Category Dropdown */}
                <div className="flex items-center space-x-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Category:</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Semester Dropdown */}
                <div className="flex items-center space-x-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Semester:</span>
                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="all" className="bg-slate-900">All Semesters</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem} className="bg-slate-900">Sem {sem}</option>
                    ))}
                  </select>
                </div>

                {/* Status Dropdown */}
                <div className="flex items-center space-x-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400">Status:</span>
                  <select
                    value={selectedStatusFilter}
                    onChange={(e) => setSelectedStatusFilter(e.target.value)}
                    className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="all" className="bg-slate-900">All Labs</option>
                    <option value="pending" className="bg-slate-900">Has Pending Exps</option>
                    <option value="completed" className="bg-slate-900">All Signed ✓</option>
                    <option value="custom" className="bg-slate-900">Student Created ★</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Branch Pills Filter */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              <span className="text-slate-500 flex items-center space-x-1 flex-shrink-0 mr-1">
                <Filter className="w-3 h-3 text-cyan-400" />
                <span>Branch:</span>
              </span>
              {BRANCHES.map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBranch(b)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-xl font-medium transition-colors ${
                    selectedBranch === b
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm font-semibold'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Directory Disclaimer Notice */}
          <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-900/40 flex items-start space-x-2.5 text-xs text-slate-300">
            <BookOpen className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p>
                <strong>Indian Engineering Universities Curated Directory:</strong> Broad directory of practical courses covering standard curricula across AICTE, VTU, JNTU, Anna University, AKTU, Mumbai University, and autonomous colleges.
              </p>
              <p className="text-[11px] text-slate-400">
                Note: This is an extensible directory — colleges and universities in India prescribe varied elective labs and syllabi. Click <strong>Create Custom Lab</strong> anytime to add your specific college lab, custom experiments, and observation files!
              </p>
            </div>
          </div>

          {fileUploadError && (
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{fileUploadError}</span>
            </div>
          )}

          {/* Main 2-Column Layout: Left (Lab Cards Directory) | Right (Active Lab Detail & Experiments) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: List of Lab Courses (5 Columns) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Matching Labs ({filteredLabCourses.length})</span>
                <span>Select a lab to view details</span>
              </div>

              {filteredLabCourses.length === 0 ? (
                <div className="text-center py-12 rounded-2xl bg-[#0f172a]/50 border border-slate-800 p-6 space-y-3">
                  <FlaskConical className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-sm font-semibold text-white">No laboratories match your query</p>
                  <p className="text-xs text-slate-400">
                    Can't find your lab? Click below to create it right away!
                  </p>
                  <button
                    onClick={openCreateLabModal}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl inline-flex items-center space-x-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Custom Lab</span>
                  </button>
                </div>
              ) : (
                filteredLabCourses.map((lab) => {
                  const isSelected = selectedLabId === lab.id;
                  const totalExps = lab.experiments.length;
                  const signedExps = lab.experiments.filter((e) => e.status === 'signed').length;
                  const pct = totalExps > 0 ? Math.round((signedExps / totalExps) * 100) : 0;

                  return (
                    <div
                      key={lab.id}
                      onClick={() => setSelectedLabId(lab.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#111c33] to-[#0f172a] border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                          : 'bg-[#0f172a] border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300">
                              {lab.code || lab.branch}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                              Sem {lab.semester}
                            </span>
                            {lab.isCustom && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                Custom Lab ★
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-bold text-white line-clamp-1">
                            {lab.name}
                          </h3>
                        </div>

                        {/* Progress Badge */}
                        <div className="text-right flex-shrink-0">
                          <span className="text-xs font-bold text-cyan-400">
                            {signedExps}/{totalExps}
                          </span>
                          <span className="block text-[9px] text-slate-500">Signed</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 mt-1.5">
                        {lab.description}
                      </p>

                      {/* Mini Progress Bar */}
                      <div className="w-full bg-slate-800/80 rounded-full h-1.5 mt-3 overflow-hidden">
                        <div
                          className="bg-cyan-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-500">
                        <span>{lab.facultyInCharge || lab.branch}</span>
                        <span className="flex items-center text-cyan-400">
                          View details <ChevronRight className="w-3 h-3 ml-0.5" />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Column: Active Lab Detailed Inspection (7 Columns) */}
            <div className="lg:col-span-7 space-y-4">
              {currentLab ? (
                <div className="p-6 rounded-3xl bg-[#0f172a] border border-slate-800 shadow-xl space-y-6">
                  
                  {/* Top Bar of Selected Lab */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-1.5">
                        <span className="px-2 py-0.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono font-bold">
                          {currentLab.code || currentLab.branch}
                        </span>
                        <span className="text-xs text-slate-400">
                          Semester {currentLab.semester} • {currentLab.branch}
                        </span>
                        {currentLab.isCustom ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            Student Created
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
                            University Curriculum
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl font-bold text-white tracking-tight">
                        {currentLab.name}
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        {currentLab.description}
                      </p>
                      {currentLab.facultyInCharge && (
                        <p className="text-xs text-slate-400 mt-1">
                          Faculty In-Charge: <span className="text-slate-200 font-medium">{currentLab.facultyInCharge}</span>
                        </p>
                      )}
                    </div>

                    {/* Actions: Export / Edit / Delete / Add Experiment */}
                    <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleExportLab(currentLab)}
                        className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-all shadow-sm"
                        title="Download JSON backup of this laboratory with experiments and file metadata"
                      >
                        <Download className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Export Lab</span>
                      </button>

                      {currentLab.isCustom && (
                        <>
                          <button
                            onClick={() => openEditLabModal(currentLab)}
                            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800"
                            title="Edit Custom Lab Details"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete custom lab "${currentLab.name}"?`)) {
                                onDeleteLabCourse(currentLab.id);
                              }
                            }}
                            className="p-2 text-slate-400 hover:text-red-400 rounded-xl bg-slate-900 hover:bg-red-500/10 border border-slate-800"
                            title="Delete Custom Lab"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => openAddExperimentModal(currentLab.experiments.length + 1)}
                        className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/20"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Experiment</span>
                      </button>
                    </div>
                  </div>

                  {/* Experiments Progress Statistics Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-2xl bg-[#090d16] border border-slate-800/80">
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
                      <span className="text-[10px] text-slate-400 block font-medium">Total Experiments</span>
                      <span className="text-lg font-black text-white">{currentLab.experiments.length}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-950/25 border border-emerald-900/30">
                      <span className="text-[10px] text-emerald-400 block font-medium">Faculty Signed</span>
                      <span className="text-lg font-black text-emerald-300">
                        {currentLab.experiments.filter((e) => e.status === 'signed').length}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-purple-950/25 border border-purple-900/30">
                      <span className="text-[10px] text-purple-400 block font-medium">Submitted / Completed</span>
                      <span className="text-lg font-black text-purple-300">
                        {currentLab.experiments.filter((e) => e.status === 'submitted' || e.status === 'completed').length}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-950/25 border border-amber-900/30">
                      <span className="text-[10px] text-amber-400 block font-medium">Pending / In Progress</span>
                      <span className="text-lg font-black text-amber-300">
                        {currentLab.experiments.filter((e) => e.status === 'pending' || e.status === 'in-progress').length}
                      </span>
                    </div>

                    <div className="col-span-full pt-1">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-slate-400">Lab Experiments Completion Progress</span>
                        <span className="font-bold text-cyan-400">
                          {currentLab.experiments.length > 0
                            ? Math.round(
                                (currentLab.experiments.filter((e) => e.status === 'signed').length /
                                  currentLab.experiments.length) *
                                  100
                              )
                            : 0}
                          % Signed
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              currentLab.experiments.length > 0
                                ? Math.round(
                                    (currentLab.experiments.filter((e) => e.status === 'signed').length /
                                      currentLab.experiments.length) *
                                      100
                                  )
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Lab Documents & Photos Section */}
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Upload className="w-4 h-4 text-cyan-400" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                          Lab Manuals & Observation Files ({currentLab.files.length})
                        </h4>
                      </div>
                      <button
                        onClick={() => triggerFileUpload()}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Upload Files / Photos</span>
                      </button>
                    </div>

                    {/* Storage Limitation Notice */}
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                      <div className="flex items-center space-x-1.5 text-cyan-400 font-semibold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Storage & Backup Architecture Notice</span>
                      </div>
                      <p className="leading-relaxed">
                        Uploaded lab manuals, observation photos, and experiment files are securely stored in your browser's persistent local storage. Browsers allocate ~5MB–10MB per website. For permanent archival or device transfer, click <strong>Export Lab</strong> above or visit <strong>Docs & Backup</strong> in the menu.
                      </p>
                    </div>

                    {currentLab.files.length === 0 ? (
                      <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl text-xs text-slate-500 space-y-1">
                        <p>No general files uploaded yet for this laboratory.</p>
                        <p className="text-[11px] text-slate-600">Click "Upload Files / Photos" to attach PDF manuals, DOC notes, observation photos, or diagrams.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {currentLab.files.map((file) => (
                          <div
                            key={file.id}
                            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs group"
                          >
                            <div className="flex items-center space-x-2.5 truncate pr-2">
                              {getFileIcon(file.type)}
                              <div className="truncate">
                                <p className="font-semibold text-slate-200 truncate" title={file.name}>
                                  {file.name}
                                </p>
                                <span className="text-[10px] text-slate-500">
                                  {formatBytes(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-1 flex-shrink-0">
                              <button
                                onClick={() => setPreviewFile(file)}
                                className="p-1 text-slate-400 hover:text-white"
                                title="Open / Preview"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDownloadFile(file)}
                                className="p-1 text-slate-400 hover:text-cyan-400"
                                title="Download"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  setRenamingFile({ labId: currentLab.id, fileId: file.id, currentName: file.name });
                                  setRenameInput(file.name);
                                }}
                                className="p-1 text-slate-400 hover:text-amber-400"
                                title="Rename"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteLabFile(currentLab.id, file.id)}
                                className="p-1 text-slate-400 hover:text-red-400"
                                title="Delete file"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Experiments List */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                        <span>Prescribed Experiments ({currentLab.experiments.length})</span>
                      </h3>
                      <span className="text-xs text-slate-400">
                        {currentLab.experiments.filter((e) => e.status === 'signed').length} Signed •{' '}
                        {currentLab.experiments.filter((e) => e.status !== 'signed').length} Pending
                      </span>
                    </div>

                    {currentLab.experiments.length === 0 ? (
                      <div className="text-center py-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-500">
                        No experiments logged for this lab yet. Click "Add Experiment" above!
                      </div>
                    ) : (
                      currentLab.experiments.map((exp) => (
                        <div
                          key={exp.id}
                          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3"
                        >
                          {/* Experiment Header */}
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                                  Exp #{exp.experimentNumber}
                                </span>
                                {getExperimentStatusBadge(exp.status)}
                                <span className="text-xs text-slate-400">
                                  Date: {exp.dateConducted}
                                </span>
                              </div>
                              <h4 className="text-sm font-bold text-white">
                                {exp.title}
                              </h4>
                            </div>

                            {/* Experiment Action Tools */}
                            <div className="flex items-center space-x-1.5 flex-shrink-0 self-start">
                              <button
                                onClick={() => handleGenerateViva(currentLab.name, exp.title, exp.experimentNumber)}
                                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-semibold"
                                title="Generate Viva Questions with Gemini"
                              >
                                <Bot className="w-3 h-3" />
                                <span>Viva Prep</span>
                              </button>
                              <button
                                onClick={() => triggerFileUpload(exp.id)}
                                className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800"
                                title="Attach photo or scan to this experiment"
                              >
                                <Upload className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => openEditExperimentModal(exp)}
                                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                                title="Edit experiment record"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteExperiment(currentLab.id, exp.id)}
                                className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10"
                                title="Delete experiment"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Experiment Details Grid: Aim, Equipment, Observations */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-[#0b101c] p-3 rounded-xl border border-slate-800/80">
                            {exp.aim && (
                              <div className="col-span-full">
                                <span className="font-bold text-slate-300">Aim / Objective:</span>
                                <p className="text-slate-400 mt-0.5 leading-relaxed">{exp.aim}</p>
                              </div>
                            )}
                            {exp.equipment && (
                              <div>
                                <span className="font-bold text-slate-300">Equipment / Apparatus:</span>
                                <p className="text-slate-400 mt-0.5">{exp.equipment}</p>
                              </div>
                            )}
                            {exp.procedure && (
                              <div>
                                <span className="font-bold text-slate-300">Procedure / Method:</span>
                                <p className="text-slate-400 mt-0.5 whitespace-pre-line line-clamp-3">{exp.procedure}</p>
                              </div>
                            )}
                            {exp.observations && (
                              <div className="col-span-full">
                                <span className="font-bold text-slate-300">Observations / Sample Output:</span>
                                <p className="text-slate-400 mt-0.5 font-mono text-[11px] bg-slate-950 p-2 rounded border border-slate-800/60 whitespace-pre-wrap">{exp.observations}</p>
                              </div>
                            )}
                            {exp.result && (
                              <div className="col-span-full">
                                <span className="font-bold text-slate-300">Result:</span>
                                <p className="text-slate-400 mt-0.5">{exp.result}</p>
                              </div>
                            )}
                            {exp.remarks && (
                              <div className="col-span-full">
                                <span className="font-bold text-amber-400">Faculty Remarks:</span>
                                <p className="text-slate-300 mt-0.5 italic">{exp.remarks}</p>
                              </div>
                            )}
                          </div>

                          {/* Experiment Attached Files */}
                          {exp.files && exp.files.length > 0 && (
                            <div className="pt-2 border-t border-slate-800/60">
                              <span className="text-[11px] font-bold text-slate-400 mb-1.5 block">
                                Attached Experiment Scans / Outputs ({exp.files.length}):
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {exp.files.map((ef) => (
                                  <div
                                    key={ef.id}
                                    className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 flex items-center space-x-2 text-xs"
                                  >
                                    {getFileIcon(ef.type)}
                                    <span className="font-medium text-slate-300 truncate max-w-[140px]" title={ef.name}>
                                      {ef.name}
                                    </span>
                                    <button
                                      onClick={() => setPreviewFile(ef)}
                                      className="text-slate-400 hover:text-white"
                                      title="Preview"
                                    >
                                      <Eye className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => handleDownloadFile(ef)}
                                      className="text-slate-400 hover:text-cyan-400"
                                      title="Download"
                                    >
                                      <Download className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setRenamingFile({ labId: currentLab.id, fileId: ef.id, currentName: ef.name, expId: exp.id });
                                        setRenameInput(ef.name);
                                      }}
                                      className="text-slate-400 hover:text-amber-400"
                                      title="Rename"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => onDeleteLabFile(currentLab.id, ef.id, exp.id)}
                                      className="text-slate-400 hover:text-red-400"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Status Selector Bar */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                            <div className="flex items-center space-x-2">
                              <span className="text-slate-400 font-medium">Status:</span>
                              <select
                                value={exp.status}
                                onChange={(e) => {
                                  onUpdateExperiment(currentLab.id, {
                                    ...exp,
                                    status: e.target.value as ExperimentStatus,
                                  });
                                }}
                                className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                              >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="submitted">Submitted</option>
                                <option value="signed">Faculty Signed ✓</option>
                              </select>
                            </div>

                            <button
                              onClick={() => {
                                onUpdateExperiment(currentLab.id, {
                                  ...exp,
                                  vivaPrepared: !exp.vivaPrepared,
                                });
                              }}
                              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors ${
                                exp.vivaPrepared
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{exp.vivaPrepared ? 'Viva Prepared ✓' : 'Viva Not Prepared'}</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                </div>
              ) : (
                <div className="p-12 text-center rounded-3xl bg-[#0f172a] border border-slate-800 text-slate-400">
                  Select a lab from the directory on the left to view experiments and records.
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ===================== THEORY ASSIGNMENTS SUB-TAB ===================== */}
      {activeMainTab === 'assignments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Theory Assignments Tracker</h2>
              <p className="text-xs text-slate-400">Manage problem sets, numerical assignments, and term submissions</p>
            </div>
            <button
              onClick={() => setShowAddAsgModal(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Assignment</span>
            </button>
          </div>

          <div className="space-y-3">
            {assignments.length === 0 ? (
              <div className="text-center py-12 rounded-2xl bg-[#0f172a]/50 border border-slate-800">
                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                <h3 className="text-base font-semibold text-white">No theory assignments found</h3>
                <p className="text-xs text-slate-400 mt-1">Click "Add Assignment" to log your problem sets.</p>
              </div>
            ) : (
              assignments.map((asg) => (
                <div
                  key={asg.id}
                  className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {asg.totalMarks} Marks
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          {asg.subject}
                        </span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                            asg.priority === 'high'
                              ? 'bg-red-500/20 text-red-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {asg.priority} priority
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white pt-1">
                        {asg.title}
                      </h3>

                      {asg.description && (
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {asg.description}
                        </p>
                      )}

                      <div className="flex items-center space-x-2 text-xs text-slate-400 pt-0.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-amber-400 font-medium">Due Deadline: {asg.deadline}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteAssignment(asg.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors self-start"
                      title="Delete assignment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Submission State:</span>
                    <select
                      value={asg.status}
                      onChange={(e) => onUpdateAssignmentStatus(asg.id, e.target.value as AssignmentStatus)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none"
                    >
                      <option value="not-started">Not Started</option>
                      <option value="in-progress">In Progress</option>
                      <option value="submitted">Submitted to Faculty ✓</option>
                      <option value="evaluated">Graded / Evaluated</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ===================== MODAL: CREATE CUSTOM LAB ===================== */}
      {showCreateLabModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-scaleIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingLabCourse ? 'Edit Custom Lab' : 'Create Custom Engineering Lab'}
                </h3>
                <p className="text-xs text-slate-400">
                  Add any specific or elective laboratory used in your college
                </p>
              </div>
              <button
                onClick={() => setShowCreateLabModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {labFormError && (
              <div className="mt-3 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {labFormError}
              </div>
            )}

            <form onSubmit={handleSubmitLab} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Lab Name * (Free text - enter any lab)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autonomous Robotics & Drone Lab, Blockchain Lab, CAD Lab"
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Subject / Lab Code</label>
                  <input
                    type="text"
                    placeholder="e.g. CS502P, EC403L"
                    value={labCode}
                    onChange={(e) => setLabCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Engineering Branch</label>
                  <select
                    value={labBranch}
                    onChange={(e) => setLabBranch(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none"
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
                    <option value="Other / Custom">Other / Custom Branch</option>
                  </select>
                </div>
              </div>

              {labBranch === 'Other / Custom' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Custom Branch Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aerospace, Mechatronics, Mining Engineering"
                    value={customBranchInput}
                    onChange={(e) => setCustomBranchInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Subject Category</label>
                  <select
                    value={labCategory}
                    onChange={(e) => setLabCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Computer & Software">Computer & Software</option>
                    <option value="Design & Interactive Systems">Design & Interactive Systems</option>
                    <option value="Electronics & Hardware">Electronics & Hardware</option>
                    <option value="Core Engineering">Core Engineering</option>
                    <option value="Chemical Engineering & Process">Chemical Engineering & Process</option>
                    <option value="Bioengineering & Life Sciences">Bioengineering & Life Sciences</option>
                    <option value="Specialized & Emerging">Specialized & Emerging</option>
                    <option value="Basic Sciences & Workshop">Basic Sciences & Workshop</option>
                    <option value="General Engineering">General Engineering</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Academic Year</label>
                  <input
                    type="text"
                    placeholder="e.g. 2026-2027"
                    value={labAcademicYear}
                    onChange={(e) => setLabAcademicYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Semester</label>
                  <select
                    value={labSemester}
                    onChange={(e) => setLabSemester(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Faculty In-charge</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. A. Sharma / Prof. K. Iyer"
                    value={labFaculty}
                    onChange={(e) => setLabFaculty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description / Syllabus Overview</label>
                <textarea
                  rows={2}
                  placeholder="Briefly describe the lab syllabus, tools used, and course objectives..."
                  value={labDescription}
                  onChange={(e) => setLabDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateLabModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30"
                >
                  {editingLabCourse ? 'Update Lab Course' : 'Save Custom Lab'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: ADD / EDIT EXPERIMENT ===================== */}
      {showAddExpModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl animate-scaleIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingExperiment ? `Edit Experiment #${editingExperiment.experimentNumber}` : 'Add New Experiment'}
                </h3>
                <p className="text-xs text-slate-400">
                  {currentLab?.name}
                </p>
              </div>
              <button
                onClick={() => setShowAddExpModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {expFormError && (
              <div className="mt-3 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {expFormError}
              </div>
            )}

            <form onSubmit={handleSubmitExperiment} className="space-y-4 mt-4">
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Exp #</label>
                  <input
                    type="number"
                    min={1}
                    value={expNum}
                    onChange={(e) => setExpNum(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Experiment Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Implementation of Dijkstra's Algorithm"
                    value={expTitle}
                    onChange={(e) => setExpTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Aim / Objective</label>
                <textarea
                  rows={2}
                  placeholder="State the objective of this experiment..."
                  value={expAim}
                  onChange={(e) => setExpAim(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Required Equipment / Software / Apparatus</label>
                <input
                  type="text"
                  placeholder="e.g. GCC Compiler, Ubuntu 24.04, Breadboard, IC 7400, UTM machine"
                  value={expEquipment}
                  onChange={(e) => setExpEquipment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Procedure / Method</label>
                <textarea
                  rows={2}
                  placeholder="Step-by-step experiment instructions or algorithm logic..."
                  value={expProcedure}
                  onChange={(e) => setExpProcedure(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Observations / Calculations / Sample Output</label>
                <textarea
                  rows={2}
                  placeholder="Key reading values, terminal output, sample test run..."
                  value={expObservations}
                  onChange={(e) => setExpObservations(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Result Summary</label>
                  <input
                    type="text"
                    placeholder="e.g. Algorithm verified with O(N log N) time"
                    value={expResult}
                    onChange={(e) => setExpResult(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Faculty Remarks</label>
                  <input
                    type="text"
                    placeholder="e.g. Completed with full marks"
                    value={expRemarks}
                    onChange={(e) => setExpRemarks(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Date Conducted</label>
                  <input
                    type="date"
                    value={expDateConducted}
                    onChange={(e) => setExpDateConducted(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Submission Deadline</label>
                  <input
                    type="date"
                    value={expDeadline}
                    onChange={(e) => setExpDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
                  <select
                    value={expStatus}
                    onChange={(e) => setExpStatus(e.target.value as ExperimentStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="submitted">Submitted</option>
                    <option value="signed">Faculty Signed ✓</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddExpModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/30"
                >
                  {editingExperiment ? 'Update Experiment Record' : 'Save Experiment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: ADD THEORY ASSIGNMENT ===================== */}
      {showAddAsgModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scaleIn">
            <h3 className="text-lg font-bold text-white mb-1">Add Theory Assignment</h3>
            <p className="text-xs text-slate-400 mb-4">Record assignments, numericals, and term papers</p>

            {asgFormError && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {asgFormError}
              </div>
            )}

            <form onSubmit={handleCreateAsg} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Operating Systems / Computer Networks"
                  value={asgSubject}
                  onChange={(e) => setAsgSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Assignment 3: Relational Calculus & BCNF"
                  value={asgTitle}
                  onChange={(e) => setAsgTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={asgDeadline}
                    onChange={(e) => setAsgDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={asgMarks}
                    onChange={(e) => setAsgMarks(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAsgModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30"
                >
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: FILE PREVIEW ===================== */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl animate-scaleIn max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                {getFileIcon(previewFile.type)}
                <div>
                  <h3 className="text-sm font-bold text-white truncate max-w-md">{previewFile.name}</h3>
                  <span className="text-[10px] text-slate-400">
                    {formatBytes(previewFile.size)} • Uploaded {new Date(previewFile.uploadedAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 flex-1 overflow-y-auto flex items-center justify-center">
              {previewFile.type.includes('image') ? (
                <img
                  src={previewFile.dataUrl}
                  alt={previewFile.name}
                  className="max-h-[60vh] max-w-full rounded-xl object-contain border border-slate-800 shadow"
                />
              ) : previewFile.type.includes('pdf') ? (
                <div className="text-center p-8 space-y-3">
                  <FileText className="w-16 h-16 text-red-400 mx-auto" />
                  <p className="text-sm font-semibold text-white">PDF Document Ready</p>
                  <p className="text-xs text-slate-400">
                    PDF files can be downloaded directly to open in your system PDF reader.
                  </p>
                  <button
                    onClick={() => handleDownloadFile(previewFile)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold inline-flex items-center space-x-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download {previewFile.name}</span>
                  </button>
                </div>
              ) : (
                <div className="text-center p-8 space-y-3">
                  <File className="w-16 h-16 text-blue-400 mx-auto" />
                  <p className="text-sm font-semibold text-white">{previewFile.name}</p>
                  <button
                    onClick={() => handleDownloadFile(previewFile)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold inline-flex items-center space-x-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download File</span>
                  </button>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-500 text-[11px]">Stored locally in browser</span>
              <button
                onClick={() => handleDownloadFile(previewFile)}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL: RENAME FILE ===================== */}
      {renamingFile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-sm w-full p-5 shadow-2xl animate-scaleIn space-y-4">
            <h4 className="text-sm font-bold text-white">Rename File</h4>
            <input
              type="text"
              value={renameInput}
              onChange={(e) => setRenameInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setRenamingFile(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (renameInput.trim()) {
                    onRenameLabFile(renamingFile.labId, renamingFile.fileId, renameInput.trim(), renamingFile.expId);
                    setRenamingFile(null);
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 text-white text-xs font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL: VIVA VOCE Q&A ===================== */}
      {vivaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl animate-scaleIn max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{vivaSubject}</h3>
                  <p className="text-xs text-slate-400">{vivaTitle}</p>
                </div>
              </div>
              <button
                onClick={() => setVivaModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto py-4 flex-1 text-sm text-slate-200 space-y-3">
              {vivaLoading ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-purple-300 font-medium">
                    Generating top examiner viva questions with Gemini...
                  </p>
                </div>
              ) : (
                <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed text-slate-300">
                  {vivaContent}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setVivaModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
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
