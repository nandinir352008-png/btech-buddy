import { 
  Task, 
  TimetableSlot, 
  LabRecord, 
  Assignment, 
  TimerSession, 
  SubjectAttendance, 
  ChatMessage,
  LabCourse,
  Experiment,
  AttachedFile,
  ExperimentStatus,
  LabStatus,
  UserAccount,
  CustomTaxonomies,
  CommunityQuestion,
  QuestionAnswer,
  AnswerComment,
  QuestionReview,
  StudentProfile,
  DirectMessage,
  NotificationItem
} from '../types';

export const STORAGE_KEYS = {
  TASKS: 'btech_tasks_v1',
  TIMETABLE: 'btech_timetable_v1',
  LABS: 'btech_labs_v1',
  LAB_COURSES: 'btech_lab_courses_v2',
  ASSIGNMENTS: 'btech_assignments_v1',
  TIMER_LOGS: 'btech_timer_logs_v1',
  ATTENDANCE: 'btech_attendance_v1',
  CHAT: 'btech_chat_v1',
  SETTINGS: 'btech_settings_v1',
  TAXONOMIES: 'btech_taxonomies_v2',
  CURRENT_USER: 'btech_current_user_v2',
  ALL_USERS: 'btech_users_registry_v2',
  COMMUNITY_QUESTIONS: 'btech_questions_v2',
  STUDENT_PROFILES: 'btech_profiles_v2',
  DIRECT_MESSAGES: 'btech_messages_v2',
  NOTIFICATIONS: 'btech_notifications_v2',
};

// Initial Realistic B.Tech Sample Data
export const INITIAL_TASKS: Task[] = [
  {
    id: 't-1',
    title: 'Implement Dijkstra & Bellman-Ford algorithms in C++',
    category: 'coding',
    subject: 'Data Structures & Algorithms',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    completed: false,
    notes: 'Focus on min-heap priority queue implementation and negative edge detection.',
  },
  {
    id: 't-2',
    title: 'Write OS Lab Record #4: Banker’s Algorithm for Deadlock Avoidance',
    category: 'lab',
    subject: 'Operating Systems',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    completed: false,
    notes: 'Include resource allocation graph diagrams and sample test vectors.',
  },
  {
    id: 't-3',
    title: 'Solve DBMS Assignment 3: Relational Algebra & SQL Nested Subqueries',
    category: 'assignment',
    subject: 'Database Management Systems',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    completed: false,
    notes: 'Practice Correlated Subqueries and EXISTS / NOT EXISTS clauses.',
  },
  {
    id: 't-4',
    title: 'Prepare Viva questions for Computer Networks Wireshark Packet Sniffing',
    category: 'lab',
    subject: 'Computer Networks',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    completed: true,
    completedAt: new Date().toISOString(),
    notes: 'Review TCP 3-way handshake SYN, SYN-ACK, ACK packet headers.',
  },
  {
    id: 't-5',
    title: 'Revise Unit 2: Regular Expressions to DFA Minimization',
    category: 'exam',
    subject: 'Theory of Computation',
    priority: 'low',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    completed: false,
    notes: 'Myhill-Nerode theorem and Pumping Lemma for Regular Languages.',
  },
];

export const INITIAL_TIMETABLE: TimetableSlot[] = [
  // Monday
  {
    id: 'tt-m1',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:00',
    subject: 'Data Structures & Algorithms',
    room: 'Room 302 (CS Block)',
    faculty: 'Dr. V. Sharma',
    type: 'theory',
  },
  {
    id: 'tt-m2',
    day: 'Monday',
    startTime: '10:00',
    endTime: '11:00',
    subject: 'Operating Systems',
    room: 'Room 302 (CS Block)',
    faculty: 'Prof. K. Iyer',
    type: 'theory',
  },
  {
    id: 'tt-m3',
    day: 'Monday',
    startTime: '11:15',
    endTime: '13:15',
    subject: 'DBMS Practical Lab',
    room: 'Lab 4 (Ground Floor)',
    faculty: 'Prof. Ananya Sen',
    type: 'lab',
  },
  {
    id: 'tt-m4',
    day: 'Monday',
    startTime: '14:00',
    endTime: '15:00',
    subject: 'Computer Networks',
    room: 'Room 304',
    faculty: 'Dr. R. Nair',
    type: 'theory',
  },

  // Tuesday
  {
    id: 'tt-tu1',
    day: 'Tuesday',
    startTime: '09:00',
    endTime: '10:00',
    subject: 'Database Management Systems',
    room: 'Room 302',
    faculty: 'Prof. Ananya Sen',
    type: 'theory',
  },
  {
    id: 'tt-tu2',
    day: 'Tuesday',
    startTime: '10:00',
    endTime: '11:00',
    subject: 'Theory of Computation',
    room: 'Room 302',
    faculty: 'Dr. P. Deshmukh',
    type: 'theory',
  },
  {
    id: 'tt-tu3',
    day: 'Tuesday',
    startTime: '11:15',
    endTime: '13:15',
    subject: 'Data Structures Lab',
    room: 'Lab 2 (First Floor)',
    faculty: 'Dr. V. Sharma',
    type: 'lab',
  },
  {
    id: 'tt-tu4',
    day: 'Tuesday',
    startTime: '14:00',
    endTime: '15:30',
    subject: 'Competitive Programming Tutorial',
    room: 'Seminar Hall 1',
    faculty: 'Prof. A. Rao',
    type: 'tutorial',
  },

  // Wednesday
  {
    id: 'tt-w1',
    day: 'Wednesday',
    startTime: '09:00',
    endTime: '10:00',
    subject: 'Operating Systems',
    room: 'Room 302',
    faculty: 'Prof. K. Iyer',
    type: 'theory',
  },
  {
    id: 'tt-w2',
    day: 'Wednesday',
    startTime: '10:00',
    endTime: '11:00',
    subject: 'Computer Networks',
    room: 'Room 304',
    faculty: 'Dr. R. Nair',
    type: 'theory',
  },
  {
    id: 'tt-w3',
    day: 'Wednesday',
    startTime: '11:15',
    endTime: '13:15',
    subject: 'OS & Linux Kernel Lab',
    room: 'Lab 5 (Systems Lab)',
    faculty: 'Prof. K. Iyer',
    type: 'lab',
  },
  {
    id: 'tt-w4',
    day: 'Wednesday',
    startTime: '14:00',
    endTime: '15:00',
    subject: 'Web Technologies & Cloud',
    room: 'Room 302',
    faculty: 'Prof. M. Patel',
    type: 'theory',
  },

  // Thursday
  {
    id: 'tt-th1',
    day: 'Thursday',
    startTime: '09:00',
    endTime: '10:00',
    subject: 'Theory of Computation',
    room: 'Room 302',
    faculty: 'Dr. P. Deshmukh',
    type: 'theory',
  },
  {
    id: 'tt-th2',
    day: 'Thursday',
    startTime: '10:00',
    endTime: '11:00',
    subject: 'Data Structures & Algorithms',
    room: 'Room 302',
    faculty: 'Dr. V. Sharma',
    type: 'theory',
  },
  {
    id: 'tt-th3',
    day: 'Thursday',
    startTime: '11:15',
    endTime: '12:15',
    subject: 'Database Management Systems',
    room: 'Room 302',
    faculty: 'Prof. Ananya Sen',
    type: 'theory',
  },
  {
    id: 'tt-th4',
    day: 'Thursday',
    startTime: '13:30',
    endTime: '15:30',
    subject: 'Computer Networks Socket Lab',
    room: 'Lab 3 (Networking Lab)',
    faculty: 'Dr. R. Nair',
    type: 'lab',
  },

  // Friday
  {
    id: 'tt-f1',
    day: 'Friday',
    startTime: '09:00',
    endTime: '10:00',
    subject: 'Computer Networks',
    room: 'Room 304',
    faculty: 'Dr. R. Nair',
    type: 'theory',
  },
  {
    id: 'tt-f2',
    day: 'Friday',
    startTime: '10:00',
    endTime: '11:00',
    subject: 'Operating Systems',
    room: 'Room 302',
    faculty: 'Prof. K. Iyer',
    type: 'theory',
  },
  {
    id: 'tt-f3',
    day: 'Friday',
    startTime: '11:15',
    endTime: '13:15',
    subject: 'Project Work & Review',
    room: 'Innovation Lab',
    faculty: 'HOD & Guide',
    type: 'lab',
  },

  // Saturday
  {
    id: 'tt-s1',
    day: 'Saturday',
    startTime: '09:30',
    endTime: '11:00',
    subject: 'Industry Seminar & Placement Prep',
    room: 'Auditorium 2',
    faculty: 'Placement Cell',
    type: 'tutorial',
  },
  {
    id: 'tt-s2',
    day: 'Saturday',
    startTime: '11:15',
    endTime: '13:00',
    subject: 'Open Source Hackathon Hours',
    room: 'Lab 1',
    faculty: 'Coding Club',
    type: 'lab',
  },
];

export const INITIAL_LAB_COURSES: LabCourse[] = [
  // --- Computer Science & Engineering (CSE) ---
  {
    id: 'labc-dsa',
    name: 'Data Structures & Algorithms Lab',
    code: 'CS301P',
    branch: 'CSE',
    category: 'Computer & Software',
    semester: 3,
    academicYear: '2026-2027',
    description: 'Implementation of fundamental linear and non-linear data structures, trees, graphs, and algorithms in C++ & Java.',
    facultyInCharge: 'Dr. V. Sharma',
    isCustom: false,
    createdAt: '2026-08-01',
    files: [
      {
        id: 'f-dsa-1',
        name: 'DSA_Lab_Manual_Syllabus.pdf',
        size: 142000,
        type: 'application/pdf',
        uploadedAt: '2026-08-05T10:00:00.000Z',
        dataUrl: 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+ZW5kb2JqCg==',
        description: 'Official department syllabus and list of 12 prescribed experiments.',
      },
      {
        id: 'f-dsa-2',
        name: 'Binary_Tree_Reference_Guide.png',
        size: 85000,
        type: 'image/png',
        uploadedAt: '2026-08-10T14:30:00.000Z',
        dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        description: 'Binary Tree traversal visualization chart.',
      }
    ],
    experiments: [
      {
        id: 'exp-dsa-1',
        labId: 'labc-dsa',
        experimentNumber: 1,
        title: 'Array Implementation of Stack and Queue',
        aim: 'To implement LIFO stack and FIFO queue operations (push, pop, enqueue, dequeue, peek, display) using fixed-size arrays.',
        equipment: 'GCC Compiler / Linux Terminal / Visual Studio Code',
        procedure: '1. Initialize top = -1 for stack and front = rear = -1 for queue.\n2. Implement overflow and underflow boundary checks.\n3. Execute push/pop operations and display output state.',
        observations: 'Stack correctly handled overflow at size N=5 and underflow at size 0.',
        result: 'Stack and Queue data structures were successfully implemented with O(1) time complexity per operation.',
        remarks: 'Code modularity is good. Well commented.',
        dateConducted: '2026-08-12',
        submissionDeadline: '2026-08-19',
        status: 'signed',
        vivaPrepared: true,
        files: [],
      },
      {
        id: 'exp-dsa-2',
        labId: 'labc-dsa',
        experimentNumber: 2,
        title: 'Infix to Postfix Expression Conversion using Stack',
        aim: 'To parse and convert arithmetic infix expressions containing operators (+, -, *, /, ^) and parentheses into postfix notation using operator precedence.',
        equipment: 'C++17 / Clang Compiler',
        procedure: '1. Scan expression left to right.\n2. Operands append directly to output.\n3. Operators pop stack based on precedence rules and associativity.',
        observations: 'Expression (A+B)*(C-D) parsed correctly to AB+CD-*',
        result: 'Infix to Postfix algorithm verified against standard benchmark expressions.',
        remarks: 'Verified by Prof. Sharma. Full marks awarded.',
        dateConducted: '2026-08-19',
        submissionDeadline: '2026-08-26',
        status: 'signed',
        vivaPrepared: true,
        files: [],
      },
      {
        id: 'exp-dsa-3',
        labId: 'labc-dsa',
        experimentNumber: 3,
        title: 'Binary Search Tree (BST) Operations',
        aim: 'To construct a Binary Search Tree and perform recursive Insertion, In-order, Pre-order, Post-order traversal, and node Deletion.',
        equipment: 'Linux GDB / C++ / Clion',
        procedure: '1. Create node structure with key, left, and right pointers.\n2. Insert nodes maintaining BST invariant (left < root < right).\n3. Implement in-order successor replacement for two-child deletion.',
        observations: 'In-order traversal yielded strictly sorted sequence.',
        result: 'BST implemented with O(log N) average search time and O(N) worst-case.',
        remarks: 'Observation verified. Faculty signature completed.',
        dateConducted: '2026-09-02',
        submissionDeadline: '2026-09-09',
        status: 'signed',
        vivaPrepared: true,
        files: [],
      },
      {
        id: 'exp-dsa-4',
        labId: 'labc-dsa',
        experimentNumber: 4,
        title: 'Shortest Path using Dijkstra Algorithm',
        aim: 'To find single-source shortest paths in a weighted directed graph with non-negative edge weights using a priority queue (Min-Heap).',
        equipment: 'C++ STL (priority_queue, vector, pair)',
        procedure: '1. Maintain distance array initialized to infinity, dist[source] = 0.\n2. Extract min-distance vertex from priority queue and relax adjacent edges.\n3. Repeat until priority queue is empty.',
        observations: 'Graph with 6 vertices and 9 edges computed shortest distances in 4ms.',
        result: 'Dijkstra algorithm achieved O((V + E) log V) time complexity.',
        remarks: 'Report written. Ready for submission.',
        dateConducted: '2026-10-02',
        submissionDeadline: '2026-10-18',
        status: 'submitted',
        vivaPrepared: false,
        files: [],
      },
    ],
  },

  {
    id: 'labc-dbms',
    name: 'Database Management Systems (DBMS) Lab',
    code: 'CS302P',
    branch: 'CSE',
    category: 'Computer & Software',
    semester: 4,
    academicYear: '2026-2027',
    description: 'Schema modeling, relational algebra, SQL DDL/DML, complex subqueries, indexing, and PL/SQL procedures using PostgreSQL / MySQL.',
    facultyInCharge: 'Prof. Ananya Sen',
    isCustom: false,
    createdAt: '2026-08-01',
    files: [
      {
        id: 'f-dbms-1',
        name: 'DBMS_Lab_Schema_Diagram.png',
        size: 92000,
        type: 'image/png',
        uploadedAt: '2026-08-15T11:20:00.000Z',
        dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        description: 'University relational schema ER diagram.',
      }
    ],
    experiments: [
      {
        id: 'exp-dbms-1',
        labId: 'labc-dbms',
        experimentNumber: 1,
        title: 'DDL & DML Schema Creation and Entity Constraints',
        aim: 'To design relational schemas for a University Database with Primary Key, Foreign Key (ON DELETE CASCADE), UNIQUE, NOT NULL, and CHECK constraints.',
        equipment: 'PostgreSQL 16 / pgAdmin 4 / Terminal psql',
        procedure: '1. Draft CREATE TABLE statements with appropriate domain types.\n2. Insert valid tuples and verify constraint rejection on invalid tuples.\n3. Execute ALTER TABLE and DROP TABLE commands.',
        observations: 'Foreign key cascade successfully purged dependent enrollment rows.',
        result: 'Relational database schema created and normalized to BCNF.',
        remarks: 'Full marks awarded. Faculty verified foreign key integrity.',
        dateConducted: '2026-09-15',
        submissionDeadline: '2026-09-22',
        status: 'signed',
        vivaPrepared: true,
        files: [],
      },
      {
        id: 'exp-dbms-2',
        labId: 'labc-dbms',
        experimentNumber: 2,
        title: 'Complex SQL Joins, Aggregate Functions & Group By Having',
        aim: 'To query data across multiple tables using INNER JOIN, LEFT OUTER JOIN, RIGHT JOIN, FULL OUTER JOIN, and GROUP BY with HAVING filter.',
        equipment: 'MySQL 8.0 Workbench / Terminal',
        procedure: '1. Execute query to find students with GPA above department average.\n2. Aggregate course enrollment counts per department using COUNT() and GROUP BY.\n3. Filter groups with HAVING COUNT(*) >= 3.',
        observations: 'Demonstrated difference between WHERE filter and post-aggregate HAVING clause.',
        result: 'Complex queries executed and optimized using query EXPLAIN plan.',
        remarks: 'Checked. Ready for viva examination.',
        dateConducted: '2026-09-29',
        submissionDeadline: '2026-10-06',
        status: 'signed',
        vivaPrepared: true,
        files: [],
      },
      {
        id: 'exp-dbms-3',
        labId: 'labc-dbms',
        experimentNumber: 3,
        title: 'PL/SQL Stored Procedures, Functions, and Triggers',
        aim: 'To write PL/SQL stored procedure to update student semester marks and a row-level BEFORE INSERT trigger to audit student grade updates.',
        equipment: 'PostgreSQL PL/pgSQL / Oracle SQL Developer',
        procedure: '1. Create audit_log table.\n2. Write trigger function returning NEW record.\n3. Attach trigger AFTER UPDATE OF marks ON student_results.',
        observations: 'Trigger successfully logged old_marks, new_marks, and timestamp.',
        result: 'PL/SQL procedures and triggers successfully implemented.',
        remarks: 'Observation write-up complete.',
        dateConducted: '2026-10-06',
        submissionDeadline: '2026-10-20',
        status: 'in-progress',
        vivaPrepared: false,
        files: [],
      },
    ],
  },

  {
    id: 'labc-os',
    name: 'Operating Systems & Linux Lab',
    code: 'CS303P',
    branch: 'CSE',
    category: 'Computer & Software',
    semester: 4,
    academicYear: '2026-2027',
    description: 'POSIX system calls, process scheduling, inter-process communication (IPC), concurrency semaphores, deadlock algorithms, and memory management.',
    facultyInCharge: 'Prof. K. Iyer',
    isCustom: false,
    createdAt: '2026-08-01',
    files: [],
    experiments: [
      {
        id: 'exp-os-1',
        labId: 'labc-os',
        experimentNumber: 1,
        title: 'Simulation of CPU Scheduling: FCFS, SJF, and Round Robin',
        aim: 'To implement and compare First-Come First-Served (FCFS), Shortest Job First (SJF Non-preemptive), and Round Robin (RR) with time quantum.',
        equipment: 'Ubuntu Linux 24.04 / GCC / C Programming',
        procedure: '1. Accept process arrival times and burst times.\n2. Compute turnaround time, waiting time, and average response time.\n3. Generate Gantt charts.',
        observations: 'Round Robin with Q=2 achieved lowest average response latency.',
        result: 'CPU scheduling algorithms simulated and performance metrics evaluated.',
        remarks: 'Signed by faculty.',
        dateConducted: '2026-09-17',
        submissionDeadline: '2026-09-24',
        status: 'signed',
        vivaPrepared: true,
        files: [],
      },
      {
        id: 'exp-os-2',
        labId: 'labc-os',
        experimentNumber: 2,
        title: 'POSIX Semaphores for Producer-Consumer Concurrency',
        aim: 'To solve the bounded-buffer Producer-Consumer problem avoiding race conditions using pthread mutex and counting semaphores.',
        equipment: 'C / pthread library / POSIX sem_init, sem_wait, sem_post',
        procedure: '1. Initialize empty=N, full=0, and mutex=1.\n2. Producer waits on empty, locks mutex, inserts item, releases mutex, signals full.\n3. Consumer waits on full, locks mutex, consumes item, signals empty.',
        observations: 'Buffer overflow and race condition prevented even under 10 concurrent threads.',
        result: 'Producer-Consumer synchronization successfully verified without deadlock.',
        remarks: 'Signed and approved.',
        dateConducted: '2026-10-01',
        submissionDeadline: '2026-10-08',
        status: 'signed',
        vivaPrepared: true,
        files: [],
      },
      {
        id: 'exp-os-3',
        labId: 'labc-os',
        experimentNumber: 3,
        title: 'Banker’s Algorithm for Deadlock Avoidance',
        aim: 'To verify whether an operating system resource allocation state is in a safe sequence and determine whether resource requests can be granted immediately.',
        equipment: 'C / Linux Terminal',
        procedure: '1. Compute Need Matrix = Max - Allocation.\n2. Find process where Need <= Available.\n3. Add allocation back to Available and repeat.',
        observations: 'Safe sequence found: <P1, P3, P4, P0, P2>. Request granted without deadlock.',
        result: 'Banker’s algorithm safety test and resource-request algorithm verified.',
        remarks: 'Ready for faculty review.',
        dateConducted: '2026-10-08',
        submissionDeadline: '2026-10-22',
        status: 'completed',
        vivaPrepared: false,
        files: [],
      },
    ],
  },

  {
    id: 'labc-python',
    name: 'Python Programming Lab',
    code: 'CS201P',
    branch: 'CSE',
    category: 'Computer & Software',
    semester: 2,
    academicYear: '2026-2027',
    description: 'Python fundamentals, data structures, functional programming, file processing, NumPy arrays, and Matplotlib data visualization.',
    facultyInCharge: 'Prof. Ananya Sen',
    isCustom: false,
    createdAt: '2026-08-01',
    files: [],
    experiments: [
      {
        id: 'exp-py-1',
        labId: 'labc-python',
        experimentNumber: 1,
        title: 'Matrix Operations and Linear Algebra using NumPy',
        aim: 'To perform matrix addition, dot product multiplication, determinant calculation, eigenvalues, and transpose using NumPy.',
        equipment: 'Python 3.12 / Jupyter Notebook / NumPy',
        procedure: '1. Construct multi-dimensional numpy ndarrays.\n2. Apply np.dot(), np.linalg.det(), and np.linalg.eig().\n3. Benchmark performance against native Python lists.',
        observations: 'NumPy vectorized C-backend executed 45x faster than native loops.',
        result: 'NumPy matrix manipulations successfully verified.',
        remarks: 'Full marks.',
        dateConducted: '2026-08-14',
        submissionDeadline: '2026-08-21',
        status: 'signed',
        vivaPrepared: true,
        files: [],
      },
      {
        id: 'exp-py-2',
        labId: 'labc-python',
        experimentNumber: 2,
        title: 'Exploratory Data Analysis with Pandas & Matplotlib',
        aim: 'To ingest CSV datasets, clean missing NaN values, compute summary statistics, and generate bar charts, histograms, and heatmaps.',
        equipment: 'Python / Pandas / Matplotlib / Seaborn',
        procedure: '1. Load dataset with pd.read_csv().\n2. Impute missing numeric values with median.\n3. Plot correlation heatmap and distribution plots.',
        observations: 'Identified key correlations across student test score features.',
        result: 'EDA workflow automated and visual reports generated.',
        remarks: 'Checked.',
        dateConducted: '2026-08-28',
        submissionDeadline: '2026-09-04',
        status: 'signed',
        vivaPrepared: true,
        files: [],
      },
    ],
  },

  {
    id: 'labc-c-prog',
    name: 'C Programming Lab',
    code: 'CS101P',
    branch: 'Common 1st Year',
    category: 'Basic Sciences & Workshop',
    semester: 1,
    academicYear: '2026-2027',
    description: 'Foundational problem solving using C: data types, control flow, functions, pointers, dynamic memory allocation, and file processing.',
    facultyInCharge: 'Dr. P. Deshmukh',
    isCustom: false,
    createdAt: '2026-08-01',
    files: [],
    experiments: [
      {
        id: 'exp-c-1',
        labId: 'labc-c-prog',
        experimentNumber: 1,
        title: 'Control Flow, Prime Numbers, and Palindrome Checker',
        aim: 'To write C programs implementing loops and conditional branches to check prime numbers, Armstrong numbers, and palindrome strings.',
        equipment: 'GCC Compiler / Code::Blocks',
        procedure: '1. Use iterative modulo checking up to sqrt(N).\n2. Reverse digits using arithmetic extraction.\n3. Output classification result.',
        observations: 'Handled edge cases like N=0, N=1, and negative numbers.',
        result: 'Basic control structures successfully verified.',
        remarks: 'Approved.',
        dateConducted: '2026-08-10',
        submissionDeadline: '2026-08-17',
        status: 'signed',
        vivaPrepared: true,
        files: [],
      },
      {
        id: 'exp-c-2',
        labId: 'labc-c-prog',
        experimentNumber: 2,
        title: 'Pointer Arithmetic & Dynamic Memory Allocation',
        aim: 'To demonstrate pointer dereferencing, pass-by-reference functions, and dynamic array allocation using malloc(), calloc(), and free().',
        equipment: 'GCC / Linux Terminal',
        procedure: '1. Allocate array of N integers dynamically.\n2. Find maximum, minimum, and average using pointer traversal.\n3. Free memory to avoid leaks.',
        observations: 'Valgrind reported 0 memory leaks.',
        result: 'Pointer arithmetic and heap allocation successfully demonstrated.',
        remarks: 'Signed.',
        dateConducted: '2026-08-24',
        submissionDeadline: '2026-08-31',
        status: 'signed',
        vivaPrepared: true,
        files: [],
      },
    ],
  },

  {
    id: 'labc-java',
    name: 'Java & Object-Oriented Programming Lab',
    code: 'CS202P',
    branch: 'CSE',
    category: 'Computer & Software',
    semester: 3,
    academicYear: '2026-2027',
    description: 'Core Java, OOP principles (Encapsulation, Inheritance, Polymorphism), interfaces, exception handling, multithreading, and Java Collections.',
    facultyInCharge: 'Prof. M. Patel',
    isCustom: false,
    createdAt: '2026-08-01',
    files: [],
    experiments: [
      {
        id: 'exp-java-1',
        labId: 'labc-java',
        experimentNumber: 1,
        title: 'Inheritance and Dynamic Method Dispatch',
        aim: 'To implement hierarchical inheritance with abstract Base Class Employee and subclasses Manager, Engineer, and Developer demonstrating runtime polymorphism.',
        equipment: 'JDK 21 / IntelliJ IDEA / Eclipse',
        procedure: '1. Define abstract method calculateSalary() in parent class.\n2. Override in subclasses with role-specific incentives.\n3. Invoke via parent references.',
        observations: 'Runtime JVM correctly resolved subclass implementation.',
        result: 'Dynamic method dispatch verified.',
        remarks: 'Good code structure.',
        dateConducted: '2026-09-05',
        submissionDeadline: '2026-09-12',
        status: 'signed',
        vivaPrepared: true,
        files: [],
      },
    ],
  },

  {
    id: 'labc-cn',
    name: 'Computer Networks Lab',
    code: 'CS304P',
    branch: 'CSE',
    category: 'Computer & Software',
    semester: 5,
    academicYear: '2026-2027',
    description: 'Network protocol analysis, Wireshark packet capture, TCP/UDP socket programming, CRC checksum error detection, and routing algorithms.',
    facultyInCharge: 'Dr. R. Nair',
    isCustom: false,
    createdAt: '2026-08-01',
    files: [],
    experiments: [
      {
        id: 'exp-cn-1',
        labId: 'labc-cn',
        experimentNumber: 1,
        title: 'Packet Sniffing and Protocol Header Analysis using Wireshark',
        aim: 'To capture and analyze live network traffic for HTTP, DNS, TCP (3-way handshake), and ICMP ping protocols using Wireshark.',
        equipment: 'Wireshark Network Analyzer / Linux ethtool',
        procedure: '1. Start capture on active Ethernet/WiFi interface.\n2. Filter traffic using tcp.flags.syn == 1 and dns.\n3. Inspect Ethernet, IP, and TCP header byte offsets.',
        observations: 'Observed SYN, SYN-ACK, ACK sequence numbers and window sizing.',
        result: 'Network protocols inspected at bit-level.',
        remarks: 'Signed by Dr. Nair.',
        dateConducted: '2026-10-08',
        submissionDeadline: '2026-10-18',
        status: 'signed',
        vivaPrepared: true,
        files: [],
      },
      {
        id: 'exp-cn-2',
        labId: 'labc-cn',
        experimentNumber: 2,
        title: 'TCP Client-Server Socket Communication in Python/C',
        aim: 'To write a concurrent TCP multi-client chat server using Berkeley sockets (socket, bind, listen, accept, send, recv).',
        equipment: 'Python socket library / Linux terminal',
        procedure: '1. Server binds to PORT 8080 and listens for connections.\n2. Spawn worker thread per incoming client.\n3. Broadcast messages across connected sockets.',
        observations: 'Supported 5 concurrent terminal clients with bidirectional messaging.',
        result: 'Reliable TCP socket communication successfully implemented.',
        remarks: 'Ready for demonstration.',
        dateConducted: '2026-10-12',
        submissionDeadline: '2026-10-25',
        status: 'in-progress',
        vivaPrepared: false,
        files: [],
      },
    ],
  },

  {
    id: 'labc-web',
    name: 'Web Technologies Lab',
    code: 'CS306P',
    branch: 'IT',
    category: 'Computer & Software',
    semester: 5,
    academicYear: '2026-2027',
    description: 'Modern full-stack web engineering: responsive HTML5/Tailwind, JavaScript ES6+, React, Node.js REST APIs, and database persistence.',
    facultyInCharge: 'Prof. M. Patel',
    isCustom: false,
    createdAt: '2026-08-01',
    files: [],
    experiments: [
      {
        id: 'exp-web-1',
        labId: 'labc-web',
        experimentNumber: 1,
        title: 'Responsive Web Design & Client-Side Form Validation',
        aim: 'To build a responsive college event registration portal with clean CSS grid layout and real-time JavaScript regular expression validation.',
        equipment: 'HTML5 / Tailwind CSS / Vanilla JS',
        procedure: '1. Create form with email, student ID, mobile number, and branch.\n2. Bind input blur events to regex validators.\n3. Provide accessible error tooltips.',
        observations: 'Validated edge cases: invalid email domains and non-digit phone numbers.',
        result: 'Mobile-responsive portal built and validated.',
        remarks: 'Signed.',
        dateConducted: '2026-09-10',
        submissionDeadline: '2026-09-17',
        status: 'signed',
        vivaPrepared: true,
        files: [],
      },
    ],
  },

  // --- Artificial Intelligence & Data Science ---
  {
    id: 'labc-aiml',
    name: 'Artificial Intelligence & Machine Learning Lab',
    code: 'AIML301P',
    branch: 'AI & ML',
    category: 'Specialized & Emerging',
    semester: 5,
    academicYear: '2026-2027',
    description: 'Heuristic search algorithms, supervised classification (Regression, Decision Trees, SVM), clustering, and deep neural networks in Python.',
    facultyInCharge: 'Dr. V. Sharma',
    isCustom: false,
    createdAt: '2026-08-01',
    files: [],
    experiments: [
      {
        id: 'exp-aiml-1',
        labId: 'labc-aiml',
        experimentNumber: 1,
        title: 'A* Search Algorithm for 8-Puzzle Problem',
        aim: 'To implement the A* heuristic search algorithm using Manhattan Distance and Misplaced Tiles heuristics to solve the 8-puzzle game.',
        equipment: 'Python 3 / PriorityQueue',
        procedure: '1. Define state representation and successor function.\n2. Compute evaluation function f(n) = g(n) + h(n).\n3. Expand minimal f(n) node until goal state reached.',
        observations: 'Manhattan distance explored 60% fewer states than misplaced tiles heuristic.',
        result: 'Optimal solution path found in 14 steps.',
        remarks: 'Signed by faculty.',
        dateConducted: '2026-09-18',
        submissionDeadline: '2026-09-25',
        status: 'signed',
        vivaPrepared: true,
        files: [],
      },
      {
        id: 'exp-aiml-2',
        labId: 'labc-aiml',
        experimentNumber: 2,
        title: 'Classification using Decision Tree and Random Forest',
        aim: 'To build and tune a Decision Tree and Random Forest classifier on Breast Cancer / Iris dataset and evaluate precision, recall, and F1-score.',
        equipment: 'Scikit-Learn / Matplotlib / Pandas',
        procedure: '1. Split dataset into 80% train and 20% test.\n2. Train DecisionTreeClassifier with entropy and gini criterion.\n3. Plot confusion matrix and ROC curve.',
        observations: 'Random Forest achieved 97.4% test accuracy, outperforming single tree.',
        result: 'Hyperparameter pruning prevented overfitting.',
        remarks: 'Completed. Viva ready.',
        dateConducted: '2026-10-04',
        submissionDeadline: '2026-10-18',
        status: 'completed',
        vivaPrepared: true,
        files: [],
      },
    ],
  },

  {
    id: 'labc-datasci',
    name: 'Data Science Lab',
    code: 'DS301P',
    branch: 'Data Science',
    category: 'Specialized & Emerging',
    semester: 5,
    academicYear: '2026-2027',
    description: 'Statistical modeling, exploratory data analysis, feature engineering, hypothesis testing, and dimensionality reduction (PCA).',
    facultyInCharge: 'Prof. Ananya Sen',
    isCustom: false,
    createdAt: '2026-08-01',
    files: [],
    experiments: [
      {
        id: 'exp-ds-1',
        labId: 'labc-datasci',
        experimentNumber: 1,
        title: 'Principal Component Analysis (PCA) for Dimensionality Reduction',
        aim: 'To project a high-dimensional dataset (30 features) down to 2 principal components while preserving maximum variance.',
        equipment: 'Python / Scikit-Learn / Matplotlib',
        procedure: '1. Standardize features with StandardScaler.\n2. Compute covariance matrix and extract eigenvectors.\n3. Transform data and plot 2D scatter visualization.',
        observations: 'First 2 components retained 84% of total dataset variance.',
        result: 'Dimensionality successfully reduced with minimal information loss.',
        remarks: 'Signed.',
        dateConducted: '2026-09-22',
        submissionDeadline: '2026-09-29',
        status: 'signed',
        vivaPrepared: true,
        files: [],
      },
    ],
  },

  {
    id: 'labc-cyber',
    name: 'Cybersecurity Lab',
    code: 'CS402P',
    branch: 'CSE',
    category: 'Specialized & Emerging',
    semester: 7,
    academicYear: '2026-2027',
    description: 'Symmetric & asymmetric cryptography, hash functions, penetration testing tools, port scanning with Nmap, and network vulnerability assessment.',
    facultyInCharge: 'Dr. R. Nair',
    isCustom: false,
    createdAt: '2026-08-01',
    files: [],
    experiments: [
      {
        id: 'exp-cyber-1',
        labId: 'labc-cyber',
        experimentNumber: 1,
        title: 'RSA Asymmetric Public Key Cryptosystem',
        aim: 'To implement the RSA algorithm: prime generation, compute modulus n and totient phi, determine public key e and private key d, and encrypt/decrypt messages.',
        equipment: 'Python / Cryptography Library',
        procedure: '1. Select large primes p and q.\n2. Compute n = p*q and phi = (p-1)*(q-1).\n3. Find modular inverse d = e^-1 mod phi.\n4. Encrypt: C = M^e mod n, Decrypt: M = C^d mod n.',
        observations: 'Verified mathematical inverse property M = (M^e)^d mod n.',
        result: 'RSA encryption and decryption successfully verified.',
        remarks: 'Signed by Dr. Nair.',
        dateConducted: '2026-09-14',
        submissionDeadline: '2026-09-21',
        status: 'signed',
        vivaPrepared: true,
        files: [],
      },
    ],
  },

  {
    id: 'labc-cloud',
    name: 'Cloud Computing Lab',
    code: 'CS403P',
    branch: 'CSE',
    category: 'Specialized & Emerging',
    semester: 7,
    academicYear: '2026-2027',
    description: 'Cloud service models (IaaS, PaaS, SaaS), Docker containerization, Kubernetes orchestration, and serverless compute.',
    facultyInCharge: 'Prof. M. Patel',
    isCustom: false,
    createdAt: '2026-08-01',
    files: [],
    experiments: [
      {
        id: 'exp-cloud-1',
        labId: 'labc-cloud',
        experimentNumber: 1,
        title: 'Dockerizing a Microservice Web Application',
        aim: 'To write a multi-stage Dockerfile, build an optimized image, and run isolated containerized services with port forwarding.',
        equipment: 'Docker Engine / Linux / Node.js',
        procedure: '1. Draft Dockerfile with build stage and Alpine runtime.\n2. Build image tag with docker build -t myapp:1.0 .\n3. Run container binding port 3000.',
        observations: 'Reduced image footprint from 850MB to 78MB using multi-stage build.',
        result: 'Application deployed inside Docker container successfully.',
        remarks: 'Completed.',
        dateConducted: '2026-10-02',
        submissionDeadline: '2026-10-16',
        status: 'completed',
        vivaPrepared: true,
        files: [],
      },
    ],
  },

  {
    id: 'labc-softeng',
    name: 'Software Engineering Lab',
    code: 'CS401P',
    branch: 'CSE',
    category: 'Computer & Software',
    semester: 6,
    academicYear: '2026-2027',
    description: 'Software requirements specification (SRS), UML diagrams (Use Case, Class, Sequence), test case design, and automated CI/CD pipelines.',
    facultyInCharge: 'Prof. K. Iyer',
    isCustom: false,
    createdAt: '2026-08-01',
    files: [],
    experiments: [
      {
        id: 'exp-se-1',
        labId: 'labc-softeng',
        experimentNumber: 1,
        title: 'UML Design Diagrams for Hospital Management System',
        aim: 'To create Use Case Diagrams, Class Diagrams with cardinality, and Sequence Diagrams for patient admission and doctor scheduling.',
        equipment: 'StarUML / Draw.io / PlantUML',
        procedure: '1. Identify actors and boundary classes.\n2. Model state transitions and message passes.\n3. Validate conformance with IEEE SRS standards.',
        observations: 'Modeled 6 actors, 12 use cases, and full sequence flow.',
        result: 'UML diagrams drafted and verified.',
        remarks: 'Signed.',
        dateConducted: '2026-09-08',
        submissionDeadline: '2026-09-15',
        status: 'signed',
        vivaPrepared: true,
        files: [],
      },
    ],
  },

  // --- Electronics & Communication (ECE) & Electrical (EEE) ---
  {
    id: 'labc-de',
    name: 'Digital Electronics Lab',
    code: 'EC201P',
    branch: 'ECE',
    category: 'Electronics & Hardware',
    semester: 3,
    academicYear: '2026-2027',
    description: 'Combinational and sequential logic design: logic gates, adders/subtractors, multiplexers, flip-flops, shift registers, and counters.',
    facultyInCharge: 'Dr. S. Kulkarni',
    isCustom: false,
    createdAt: '2026-08-01',
    files: [],
    experiments: [
      {
        id: 'exp-de-1',
        labId: 'labc-de',
        experimentNumber: 1,
        title: 'Verification of Logic Gates & Universal Gate Realization',
        aim: 'To verify truth tables of AND, OR, NOT, XOR gates and realize basic gates using only NAND and NOR universal ICs (7400, 7402).',
        equipment: 'Digital IC Trainer Kit, IC 7400, IC 7402, Patch Cords, DC Power Supply',
        procedure: '1. Mount IC on breadboard and connect Vcc (+5V) and GND.\n2. Apply logic inputs (0V and 5V) and observe output LEDs.\n3. Verify De Morgan’s Laws.',
        observations: 'Output logic high observed at > 2.4V and low at < 0.4V.',
        result: 'Universal gate realizations verified against boolean algebra truth tables.',
        remarks: 'Signed by faculty.',
        dateConducted: '2026-08-16',
        submissionDeadline: '2026-08-23',
        status: 'signed',
        vivaPrepared: true,
        files: [],
      },
      {
        id: 'exp-de-2',
        labId: 'labc-de',
        experimentNumber: 2,
        title: 'Design of 4-bit Binary Synchronous Up Counter',
        aim: 'To design and implement a 4-bit synchronous up counter using JK Flip-Flops (IC 7476) and AND gates.',
        equipment: 'IC 7476, IC 7408, Digital Trainer Kit, Function Generator (Clock Pulses)',
        procedure: '1. Formulate state transition table from 0000 to 1111.\n2. Obtain minimal excitation equations using K-Maps.\n3. Wire circuit and observe decimal count on 7-segment display.',
        observations: 'Counter cycled through states 0 to 15 smoothly without glitch states.',
        result: 'Synchronous 4-bit counter design successfully verified.',
        remarks: 'Checked.',
        dateConducted: '2026-08-30',
        submissionDeadline: '2026-09-06',
        status: 'signed',
        vivaPrepared: true,
        files: [],
      },
    ],
  },

  {
    id: 'labc-iot',
    name: 'IoT & Embedded Systems Lab',
    code: 'EC401P',
    branch: 'ECE',
    category: 'Electronics & Hardware',
    semester: 6,
    academicYear: '2026-2027',
    description: 'Embedded C programming, microcontroller interfacing (ESP32 / Arduino / Raspberry Pi), sensor integration, MQTT messaging, and cloud IoT dashboards.',
    facultyInCharge: 'Dr. S. Kulkarni',
    isCustom: false,
    createdAt: '2026-08-01',
    files: [],
    experiments: [
      {
        id: 'exp-iot-1',
        labId: 'labc-iot',
        experimentNumber: 1,
        title: 'Interfacing DHT11 Sensor with ESP32 and MQTT Cloud Publishing',
        aim: 'To read ambient temperature and humidity data using DHT11 with ESP32 microcontroller and publish readings via MQTT protocol to Adafruit IO / ThingsBoard.',
        equipment: 'ESP32 Dev Module, DHT11 Sensor, Breadboard, MicroUSB, WiFi Access Point',
        procedure: '1. Wire DHT11 signal pin to GPIO 4 with 10k pull-up resistor.\n2. Flash Arduino C++ firmware with WiFiClient and PubSubClient libraries.\n3. Publish JSON payloads to broker topic every 5 seconds.',
        observations: 'Live sensor telemetry received with < 200ms latency on cloud dashboard.',
        result: 'IoT telemetry pipeline successfully established.',
        remarks: 'Signed by faculty.',
        dateConducted: '2026-09-20',
        submissionDeadline: '2026-09-27',
        status: 'signed',
        vivaPrepared: true,
        files: [],
      },
    ],
  },

  {
    id: 'labc-machines',
    name: 'Electrical Machines Lab',
    code: 'EE201P',
    branch: 'EEE',
    category: 'Core Engineering',
    semester: 3,
    academicYear: '2026-2027',
    description: 'Testing and performance analysis of DC generators, DC shunt motors, single-phase & three-phase transformers, and synchronous alternators.',
    facultyInCharge: 'Prof. T. Venkatesh',
    isCustom: false,
    createdAt: '2026-08-01',
    files: [],
    experiments: [
      {
        id: 'exp-em-1',
        labId: 'labc-machines',
        experimentNumber: 1,
        title: 'Open Circuit (OC) and Short Circuit (SC) Test on 1-Phase Transformer',
        aim: 'To conduct OC and SC tests on a 1-kVA single-phase transformer to determine equivalent circuit parameters, core loss, copper loss, and efficiency.',
        equipment: '1-kVA Transformer, Autotransformer, Wattmeters (LPF & UPF), Voltmeter, Ammeters',
        procedure: '1. OC Test: Apply rated voltage on LV winding with HV open; record Vo, Io, Wo.\n2. SC Test: Circulate rated current on HV with LV shorted; record Vsc, Isc, Wsc.\n3. Compute Ro, Xo, Req, Xeq and predetermine efficiency at various power factors.',
        observations: 'Core loss Wo = 32W; Full-load copper loss Wsc = 48W; Max efficiency = 94.2% at 85% load.',
        result: 'Equivalent circuit parameters obtained and efficiency curve plotted.',
        remarks: 'Laboratory observations verified and signed.',
        dateConducted: '2026-09-12',
        submissionDeadline: '2026-09-19',
        status: 'signed',
        vivaPrepared: true,
        files: [],
      },
    ],
  },

  // --- Mechanical & Civil Engineering ---
  {
    id: 'labc-cad',
    name: 'Engineering Drawing & CAD Lab',
    code: 'ME101P',
    branch: 'Mechanical',
    category: 'Core Engineering',
    semester: 1,
    academicYear: '2026-2027',
    description: 'Engineering graphics principles, orthographic projections, isometric views, sectioning of solids, and 2D/3D mechanical drafting in AutoCAD.',
    facultyInCharge: 'Prof. B. Joshi',
    isCustom: false,
    createdAt: '2026-08-01',
    files: [],
    experiments: [
      {
        id: 'exp-cad-1',
        labId: 'labc-cad',
        experimentNumber: 1,
        title: 'Orthographic Projections of Machine Components',
        aim: 'To draw Front View, Top View, and Side View of a stepped shaft bearing bracket in First Angle projection using AutoCAD.',
        equipment: 'AutoCAD 2025 / PC Workstation',
        procedure: '1. Setup layers for visible outlines, hidden lines, and center lines.\n2. Project standard 3 views with accurate dimensions according to BIS standards.\n3. Add title block with projection symbol.',
        observations: 'Verified dimension tolerance annotations and hatch patterns.',
        result: '2D Orthographic engineering drawing drafted and exported to DXF/PDF.',
        remarks: 'Signed by Prof. Joshi.',
        dateConducted: '2026-08-25',
        submissionDeadline: '2026-09-01',
        status: 'signed',
        vivaPrepared: true,
        files: [],
      },
    ],
  },

  {
    id: 'labc-mfg',
    name: 'Manufacturing & Workshop Practice Lab',
    code: 'ME201P',
    branch: 'Mechanical',
    category: 'Core Engineering',
    semester: 2,
    academicYear: '2026-2027',
    description: 'Hands-on practice in machining (Lathe, Milling, Drilling), arc welding, fitting, carpentry, and sheet metal fabrication.',
    facultyInCharge: 'Prof. B. Joshi',
    isCustom: false,
    createdAt: '2026-08-01',
    files: [],
    experiments: [
      {
        id: 'exp-mfg-1',
        labId: 'labc-mfg',
        experimentNumber: 1,
        title: 'Lathe Machining: Facing, Step Turning, and Chamfering',
        aim: 'To machine a mild steel cylindrical workpiece to specified stepped diameters with smooth surface finish on a centre lathe.',
        equipment: 'All-geared Centre Lathe, HSS Single-point Cutting Tool, Vernier Caliper, Chuck Key',
        procedure: '1. Hold job in 3-jaw self-centering chuck and center-align.\n2. Perform facing operation at 450 RPM.\n3. Execute longitudinal step turning and 45-degree chamfering.',
        observations: 'Final diameter achieved within +/- 0.05mm tolerance.',
        result: 'Stepped shaft machined as per engineering drawing.',
        remarks: 'Job submitted and approved.',
        dateConducted: '2026-09-03',
        submissionDeadline: '2026-09-10',
        status: 'signed',
        vivaPrepared: true,
        files: [],
      },
    ],
  },

  {
    id: 'labc-materials',
    name: 'Materials Testing Lab',
    code: 'ME202P',
    branch: 'Mechanical',
    category: 'Core Engineering',
    semester: 3,
    academicYear: '2026-2027',
    description: 'Mechanical property determination: tensile testing on UTM, hardness testing (Brinell, Rockwell), impact toughness (Charpy, Izod), and torsion.',
    facultyInCharge: 'Dr. G. Patil',
    isCustom: false,
    createdAt: '2026-08-01',
    files: [],
    experiments: [
      {
        id: 'exp-mat-1',
        labId: 'labc-materials',
        experimentNumber: 1,
        title: 'Tension Test on Mild Steel using Universal Testing Machine (UTM)',
        aim: 'To plot stress-strain curve for a mild steel specimen and determine Yield Strength, Ultimate Tensile Strength (UTS), Young’s Modulus, and % Elongation.',
        equipment: 'Universal Testing Machine (400 kN), Extensometer, Vernier Caliper',
        procedure: '1. Measure initial gauge length and diameter.\n2. Grip specimen in UTM jaws and apply tensile load gradually.\n3. Record yield point, ultimate load, and necking point until rupture.',
        observations: 'Yield Strength = 265 N/mm²; UTS = 420 N/mm²; % Elongation = 23.5% (ductile cup-and-cone fracture).',
        result: 'Mechanical tensile properties determined successfully.',
        remarks: 'Signed by Dr. Patil.',
        dateConducted: '2026-09-16',
        submissionDeadline: '2026-09-23',
        status: 'signed',
        vivaPrepared: true,
        files: [],
      },
    ],
  },

  {
    id: 'labc-survey',
    name: 'Surveying & Geomatics Lab',
    code: 'CE201P',
    branch: 'Civil',
    category: 'Core Engineering',
    semester: 3,
    academicYear: '2026-2027',
    description: 'Field surveying methods: Chain surveying, Compass traversing, Dumpy level profile levelling, Theodolite angle measurement, and Total Station.',
    facultyInCharge: 'Prof. R. Hegde',
    isCustom: false,
    createdAt: '2026-08-01',
    files: [],
    experiments: [
      {
        id: 'exp-surv-1',
        labId: 'labc-survey',
        experimentNumber: 1,
        title: 'Differential Levelling using Dumpy Level',
        aim: 'To determine reduced levels (RL) of given ground benchmark points using Height of Collimation and Rise and Fall methods.',
        equipment: 'Dumpy Level, Levelling Staff, Tripod, Chain, Ranging Rods',
        procedure: '1. Setup and level instrument with three footscrews.\n2. Take Backsight (BS) reading on known Benchmark (RL=100.000m).\n3. Record intermediate sights (IS) and Foresight (FS) to compute elevations.',
        observations: 'Arithmetical check: Sigma BS - Sigma FS = Last RL - First RL verified.',
        result: 'Ground profile RLs computed with zero closing error.',
        remarks: 'Field book verified and signed.',
        dateConducted: '2026-09-11',
        submissionDeadline: '2026-09-18',
        status: 'signed',
        vivaPrepared: true,
        files: [],
      },
    ],
  },

  {
    id: 'labc-env',
    name: 'Environmental Engineering Lab',
    code: 'CE301P',
    branch: 'Civil',
    category: 'Core Engineering',
    semester: 5,
    academicYear: '2026-2027',
    description: 'Physico-chemical analysis of water and wastewater samples: pH, Turbidity, Total Dissolved Solids (TDS), BOD, COD, and Chlorides.',
    facultyInCharge: 'Prof. R. Hegde',
    isCustom: false,
    createdAt: '2026-08-01',
    files: [],
    experiments: [
      {
        id: 'exp-env-1',
        labId: 'labc-env',
        experimentNumber: 1,
        title: 'Determination of pH, Turbidity, and Total Dissolved Solids (TDS)',
        aim: 'To test given water sample suitability for drinking as per IS 10500 drinking water standards using digital pH meter, Nephelo-turbidimeter, and TDS meter.',
        equipment: 'Digital pH Meter, Nephelometric Turbidity Meter, TDS Meter, Buffer Solutions',
        procedure: '1. Calibrate pH meter using standard pH 4.0 and 7.0 buffer tablets.\n2. Measure sample turbidity in NTU.\n3. Measure TDS in mg/L (ppm).',
        observations: 'Sample pH = 7.2; Turbidity = 2.1 NTU; TDS = 240 mg/L.',
        result: 'Tested parameters are well within permissible limits for potable water.',
        remarks: 'Report checked and signed.',
        dateConducted: '2026-09-24',
        submissionDeadline: '2026-10-01',
        status: 'signed',
        vivaPrepared: true,
        files: [],
      },
    ],
  },

  // --- Common 1st Year Labs ---
  {
    id: 'labc-physics',
    name: 'Engineering Physics Lab',
    code: 'PH101P',
    branch: 'Common 1st Year',
    category: 'Basic Sciences & Workshop',
    semester: 1,
    academicYear: '2026-2027',
    description: 'Experimental optics, lasers, fiber optics numerical aperture, Hall effect, dielectric constant, and semiconductor bandgap determination.',
    facultyInCharge: 'Dr. N. Sengupta',
    isCustom: false,
    createdAt: '2026-08-01',
    files: [],
    experiments: [
      {
        id: 'exp-phy-1',
        labId: 'labc-physics',
        experimentNumber: 1,
        title: 'Determination of Laser Wavelength using Diffraction Grating',
        aim: 'To determine the wavelength of Semiconductor Diode Laser light using transmission diffraction grating (500 lines/mm).',
        equipment: 'Semiconductor Laser Source (He-Ne / Red Diode), Diffraction Grating, Screen, Scale',
        procedure: '1. Mount laser on optical bench perpendicular to grating.\n2. Measure distance D from grating to screen.\n3. Measure separation xm for m=1 and m=2 diffraction spots and apply grating formula d*sin(theta) = m*lambda.',
        observations: 'Calculated wavelength lambda = 652 nm (Red Laser).',
        result: 'Laser wavelength determined with 0.8% experimental error margin.',
        remarks: 'Signed by faculty.',
        dateConducted: '2026-08-18',
        submissionDeadline: '2026-08-25',
        status: 'signed',
        vivaPrepared: true,
        files: [],
      },
      {
        id: 'exp-phy-2',
        labId: 'labc-physics',
        experimentNumber: 2,
        title: 'Newton’s Rings: Radius of Curvature of Plano-Convex Lens',
        aim: 'To observe interference fringes and determine the radius of curvature (R) of a plano-convex lens using sodium vapor monochromatic light.',
        equipment: 'Travelling Microscope, Plano-Convex Lens, Optical Flat Glass Plate, Sodium Vapor Lamp',
        procedure: '1. Focus microscope crosswire on circular interference fringes.\n2. Measure diameters Dn+m and Dn of m-th and n-th dark rings.\n3. Calculate R = (D²n+m - D²n) / (4*m*lambda).',
        observations: 'Calculated Radius of Curvature R = 98.4 cm.',
        result: 'Radius of curvature of lens calculated accurately.',
        remarks: 'Completed.',
        dateConducted: '2026-09-01',
        submissionDeadline: '2026-09-08',
        status: 'signed',
        vivaPrepared: true,
        files: [],
      },
    ],
  },

  {
    id: 'labc-chem',
    name: 'Engineering Chemistry Lab',
    code: 'CH101P',
    branch: 'Common 1st Year',
    category: 'Basic Sciences & Workshop',
    semester: 2,
    academicYear: '2026-2027',
    description: 'Volumetric titrations, water hardness by EDTA, conductometric and potentiometric titrations, viscosity of lubricants, and flash point determination.',
    facultyInCharge: 'Dr. M. Banerjee',
    isCustom: false,
    createdAt: '2026-08-01',
    files: [],
    experiments: [
      {
        id: 'exp-ch-1',
        labId: 'labc-chem',
        experimentNumber: 1,
        title: 'Estimation of Total Hardness of Water by EDTA Titration',
        aim: 'To determine temporary, permanent, and total hardness of a given water sample using standard 0.01M EDTA solution with Eriochrome Black T (EBT) indicator.',
        equipment: 'Burette, Pipette, Conical Flask, Standard EDTA, pH 10 Buffer, EBT Indicator',
        procedure: '1. Pipette 50ml water sample, add 2ml pH 10 ammonia buffer and 2 drops EBT.\n2. Titrate against EDTA until wine-red color transitions sharply to sky blue.\n3. Calculate hardness expressed in mg/L (ppm) as CaCO3 equivalent.',
        observations: 'Titre value V = 18.4 ml EDTA; Calculated Hardness = 368 ppm.',
        result: 'Total hardness of given sample estimated as 368 mg/L CaCO3 equivalent.',
        remarks: 'Sharp endpoint achieved. Signed.',
        dateConducted: '2026-08-22',
        submissionDeadline: '2026-08-29',
        status: 'signed',
        vivaPrepared: true,
        files: [],
      },
    ],
  },

  // --- Computer Science & Design (CSD) ---
  {
    id: 'labc-csd',
    name: 'UI/UX & Interactive Design Lab',
    code: 'CSD301P',
    branch: 'CSD',
    category: 'Design & Interactive Systems',
    semester: 4,
    academicYear: '2026-2027',
    description: 'Design thinking, user journey mapping, design systems, Figma interactive component prototyping, usability heuristics, and 3D Canvas / WebGL interaction.',
    facultyInCharge: 'Prof. N. Kothari',
    isCustom: false,
    createdAt: '2026-08-01',
    files: [],
    experiments: [
      {
        id: 'exp-csd-1',
        labId: 'labc-csd',
        experimentNumber: 1,
        title: 'Design System Architecture & Interactive Prototyping in Figma',
        aim: 'To establish an atomic design system with typography scale, WCAG AAA compliant color tokens, responsive auto-layout components, and micro-interactions.',
        equipment: 'Figma Professional / FigJam / Contrast Checker Plugin',
        procedure: '1. Build master components with variable variant properties (Default, Hover, Active, Disabled).\n2. Construct responsive layouts utilizing nested auto-layout frames.\n3. Wire smart-animate transitions for navigation drawers and modals.',
        observations: 'Prototyped 16 interactive screens with consistent 8pt grid spacing and token variables.',
        result: 'High-fidelity interactive prototype created and validated with user flow inspection.',
        remarks: 'Creative layout and design token discipline. Signed.',
        dateConducted: '2026-09-15',
        submissionDeadline: '2026-09-22',
        status: 'signed',
        vivaPrepared: true,
        files: [],
      },
      {
        id: 'exp-csd-2',
        labId: 'labc-csd',
        experimentNumber: 2,
        title: 'Usability Heuristic Evaluation & WCAG 2.1 Accessibility Audit',
        aim: 'To perform Nielsen-Norman 10 Heuristic evaluation and color contrast compliance testing on university student portals.',
        equipment: 'Lighthouse / WAVE Accessibility Evaluation Tool / Screen Reader',
        procedure: '1. Conduct systematic heuristic checklist inspection across 5 student journey workflows.\n2. Record severity ratings (0=none to 4=catastrophic usability barrier).\n3. Propose ergonomic redesign recommendations with revised contrast ratios.',
        observations: 'Resolved 3 major contrast issues and improved form validation error affordance.',
        result: 'Usability audit report drafted with System Usability Scale (SUS) score 86.',
        remarks: 'Report checked and approved.',
        dateConducted: '2026-10-05',
        submissionDeadline: '2026-10-19',
        status: 'completed',
        vivaPrepared: true,
        files: [],
      },
    ],
  },

  // --- Chemical Engineering ---
  {
    id: 'labc-chem-eng',
    name: 'Chemical Reaction Engineering & Heat Transfer Lab',
    code: 'CH301P',
    branch: 'Chemical',
    category: 'Chemical Engineering & Process',
    semester: 5,
    academicYear: '2026-2027',
    description: 'Reaction kinetics in isothermal batch reactors, CSTR and PFR systems, overall heat transfer coefficient determination in shell-and-tube exchangers, and fractional distillation.',
    facultyInCharge: 'Dr. K. S. Raman',
    isCustom: false,
    createdAt: '2026-08-01',
    files: [],
    experiments: [
      {
        id: 'exp-ce-1',
        labId: 'labc-chem-eng',
        experimentNumber: 1,
        title: 'Saponification Kinetics in an Isothermal Batch Reactor',
        aim: 'To determine the second-order reaction rate constant for alkaline hydrolysis of ethyl acetate using sodium hydroxide via electrical conductivity monitoring.',
        equipment: 'Batch Reactor Vessel with Water Bath Thermostat, Digital Conductivity Meter, Magnetic Stirrer, Reagents (NaOH, CH3COOC2H5)',
        procedure: '1. Equilibrate equimolar 0.05M solutions of NaOH and ethyl acetate to 30°C.\n2. Mix reactants and record conductivity at 30-second intervals for 20 minutes.\n3. Plot (X_A / (1 - X_A)) vs time to derive rate constant k from the slope.',
        observations: 'Conductivity decreased as highly conductive hydroxyl ions were converted to acetate ions.',
        result: 'Second-order rate constant determined as k = 0.114 L/(mol·s) with correlation coefficient R² = 0.992.',
        remarks: 'Accurate titration calibration and clear kinetic plot. Signed.',
        dateConducted: '2026-09-18',
        submissionDeadline: '2026-09-25',
        status: 'signed',
        vivaPrepared: true,
        files: [],
      },
      {
        id: 'exp-ce-2',
        labId: 'labc-chem-eng',
        experimentNumber: 2,
        title: 'Overall Heat Transfer Coefficient in Shell and Tube Heat Exchanger',
        aim: 'To calculate the overall heat transfer coefficient (U) and compare thermal efficiency under parallel flow and counter flow arrangements.',
        equipment: 'Shell and Tube Heat Exchanger Unit, Thermocouple Temperature Indicators, Rotameters for Hot and Cold Water',
        procedure: '1. Establish steady state hot water flow through inner tubes and cold water in outer shell.\n2. Record inlet and outlet temperatures (T_h1, T_h2, T_c1, T_c2) for co-current and counter-current flows.\n3. Compute Log Mean Temperature Difference (LMTD) and overall heat transfer coefficient.',
        observations: 'Counter flow yielded 31% higher LMTD effectiveness than parallel flow.',
        result: 'Overall heat transfer coefficient U = 642 W/(m²·K) determined for counter-current flow.',
        remarks: 'Verified by Dr. Raman.',
        dateConducted: '2026-10-09',
        submissionDeadline: '2026-10-23',
        status: 'completed',
        vivaPrepared: false,
        files: [],
      },
    ],
  },

  // --- Biotechnology ---
  {
    id: 'labc-biotech',
    name: 'Bioprocess & Genetic Engineering Lab',
    code: 'BT301P',
    branch: 'Biotechnology',
    category: 'Bioengineering & Life Sciences',
    semester: 5,
    academicYear: '2026-2027',
    description: 'Microbial fermentation kinetics, recombinant plasmid DNA isolation, restriction digestion, agarose gel electrophoresis, and protein purification.',
    facultyInCharge: 'Dr. S. Chatterjee',
    isCustom: false,
    createdAt: '2026-08-01',
    files: [],
    experiments: [
      {
        id: 'exp-bt-1',
        labId: 'labc-biotech',
        experimentNumber: 1,
        title: 'Isolation and Agarose Gel Electrophoresis of Plasmid DNA',
        aim: 'To extract recombinant plasmid pUC19 from E. coli host cells by alkaline lysis and analyze supercoiled DNA molecular weight by 0.8% agarose gel electrophoresis.',
        equipment: 'Microcentrifuge, Horizontal Submarine Electrophoresis Unit, UV Transilluminator, Micropipettes, Lysozyme, Solution I/II/III',
        procedure: '1. Pellet bacterial cells and resuspend in Tris-EDTA-glucose buffer.\n2. Lyse with SDS-NaOH to denature genomic DNA and neutralize with potassium acetate.\n3. Precipitate plasmid with isopropanol and resolve on agarose gel stained with ethidium bromide.',
        observations: 'Distinct bright band observed at 2.68 kb corresponding to intact supercoiled plasmid.',
        result: 'High-purity plasmid DNA successfully isolated and resolved.',
        remarks: 'Purity ratio A260/A280 = 1.84. Signed by faculty.',
        dateConducted: '2026-09-21',
        submissionDeadline: '2026-09-28',
        status: 'signed',
        vivaPrepared: true,
        files: [],
      },
      {
        id: 'exp-bt-2',
        labId: 'labc-biotech',
        experimentNumber: 2,
        title: 'Microbial Growth Kinetics in Batch Stirred Fermenter',
        aim: 'To cultivate Saccharomyces cerevisiae yeast in a 3-liter stirred tank bioreactor and determine specific growth rate (μ) and substrate yield coefficient (Y_X/S).',
        equipment: 'Benchtop Stirred Tank Bioreactor, Dissolved Oxygen (DO) Probe, Spectrophotometer (OD 600nm), Glucose Assay Kit',
        procedure: '1. Inoculate sterilized growth media with 5% active yeast inoculum.\n2. Maintain temperature at 30°C, pH at 5.5, and aeration at 1.0 vvm.\n3. Sample hourly to record cell optical density and residual glucose concentration.',
        observations: 'Exponential growth phase observed between 3h and 9h with doubling time of 92 minutes.',
        result: 'Maximum specific growth rate μ_max = 0.45 h⁻¹ and biomass yield Y_X/S = 0.51 g cells/g glucose obtained.',
        remarks: 'Observation calculations verified.',
        dateConducted: '2026-10-07',
        submissionDeadline: '2026-10-21',
        status: 'completed',
        vivaPrepared: false,
        files: [],
      },
    ],
  },
];

// Helper to derive legacy LabRecord[] from INITIAL_LAB_COURSES for seamless backward compatibility
export const INITIAL_LABS: LabRecord[] = INITIAL_LAB_COURSES.flatMap((course) =>
  course.experiments.map((exp) => ({
    id: exp.id,
    subject: course.name,
    experimentNumber: exp.experimentNumber,
    title: exp.title,
    dateConducted: exp.dateConducted,
    submissionDeadline: exp.submissionDeadline || exp.dateConducted,
    faculty: course.facultyInCharge || 'Faculty',
    status: (exp.status === 'in-progress' ? 'pending' : exp.status === 'completed' ? 'written' : exp.status) as LabStatus,
    vivaPrepared: exp.vivaPrepared,
    remarks: exp.remarks,
  }))
).slice(0, 7); // keep top 7 active for immediate dashboard highlight

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    subject: 'Operating Systems',
    title: 'Assignment 2: Virtual Memory Management & Page Replacement (FIFO, LRU, Optimal)',
    deadline: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    totalMarks: 20,
    status: 'in-progress',
    priority: 'high',
    description: 'Calculate Belady anomaly examples and page fault rates for 12 reference strings.',
  },
  {
    id: 'asg-2',
    subject: 'Database Management Systems',
    title: 'Assignment 3: Relational Calculus & BCNF Normalization Decompositions',
    deadline: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    totalMarks: 25,
    status: 'not-started',
    priority: 'high',
    description: 'Lossless join and dependency preservation verification for 5 relational tables.',
  },
  {
    id: 'asg-3',
    subject: 'Computer Networks',
    title: 'Assignment 1: Subnetting Numerical Problems and CIDR Prefix Notation',
    deadline: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    totalMarks: 15,
    status: 'in-progress',
    priority: 'medium',
    description: 'Determine network addresses, broadcast addresses, and valid host ranges.',
  },
  {
    id: 'asg-4',
    subject: 'Data Structures & Algorithms',
    title: 'Assignment 1: Asymptotic Time Analysis of Divide-and-Conquer Recurrences',
    deadline: '2026-09-30',
    totalMarks: 20,
    status: 'submitted',
    priority: 'medium',
    description: 'Master Theorem cases and substitution proofs.',
  },
];

export const INITIAL_ATTENDANCE: SubjectAttendance[] = [
  {
    id: 'att-1',
    subject: 'Data Structures & Algorithms',
    code: 'CS301',
    attended: 31,
    total: 35,
    credits: 4,
    targetGrade: 'A+',
  },
  {
    id: 'att-2',
    subject: 'Database Management Systems',
    code: 'CS302',
    attended: 28,
    total: 33,
    credits: 4,
    targetGrade: 'A',
  },
  {
    id: 'att-3',
    subject: 'Operating Systems',
    code: 'CS303',
    attended: 21,
    total: 30, // 70% -> triggers B.Tech 75% warning!
    credits: 4,
    targetGrade: 'A',
  },
  {
    id: 'att-4',
    subject: 'Computer Networks',
    code: 'CS304',
    attended: 27,
    total: 32,
    credits: 3,
    targetGrade: 'A+',
  },
  {
    id: 'att-5',
    subject: 'Theory of Computation',
    code: 'CS305',
    attended: 25,
    total: 28,
    credits: 3,
    targetGrade: 'B+',
  },
  {
    id: 'att-6',
    subject: 'Web Technologies Lab',
    code: 'CS306L',
    attended: 12,
    total: 12,
    credits: 2,
    targetGrade: 'O',
  },
];

export const INITIAL_TIMER_LOGS: TimerSession[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    durationMinutes: 50,
    subject: 'Data Structures & Algorithms',
    mode: 'deep-work',
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    durationMinutes: 25,
    subject: 'Operating Systems',
    mode: 'pomodoro',
  },
  {
    id: 'log-3',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    durationMinutes: 25,
    subject: 'Operating Systems',
    mode: 'pomodoro',
  },
];

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'c-welcome',
    role: 'assistant',
    text: `Hello Engineer! 🎓 I am your **B.Tech Academic & Doubt Solving Copilot**.

I can help you with:
• **Algorithm & Code Debugging** (C++, Java, Python, SQL, OS semaphores)
• **Lab Viva Preparation** (instant viva questions & answers for your experiments)
• **Engineering Math Derivations** (Time complexity proofs, Automata, Digital Logic)
• **Photo Analysis** (Upload handwritten circuit sketches, textbook problems, or code on screen using **Gemini 3.1 Pro**)
• **High Thinking Reasoning** (Activate the toggle for deep step-by-step proofs)

How can I help you accelerate your semester productivity today?`,
    timestamp: new Date().toISOString(),
    modelUsed: 'gemini-3.5-flash',
  },
];

// -------------------------------------------------------------
// INITIAL PERSONALIZATION TAXONOMIES
// -------------------------------------------------------------
export const INITIAL_TAXONOMIES: CustomTaxonomies = {
  subjects: [
    'Data Structures & Algorithms',
    'Operating Systems',
    'Database Management Systems',
    'Computer Networks',
    'Theory of Computation',
    'Web Technologies',
    'Artificial Intelligence & ML',
    'Data Science',
    'Cybersecurity',
    'Cloud Computing',
    'Digital Logic Design',
    'Software Engineering',
    'UI/UX & Interactive Design',
    'Electrical Machines',
    'Engineering Physics',
    'Engineering Chemistry',
    'CAD & Engineering Drawing',
    'General Engineering',
  ],
  categories: [
    'Assignment',
    'Lab Prep',
    'Exam Revision',
    'Coding & Projects',
    'Placement & Interview',
    'GATE Prep',
    'Research & Paper Reading',
    'General',
  ],
  topics: [
    'Dynamic Programming & Memoization',
    'Virtual Memory & Page Replacement',
    'Relational Algebra & Normalization',
    'TCP/IP 3-Way Handshake & Socket APIs',
    'Pumping Lemma & DFA Minimization',
    'React Hooks & State Architecture',
    'A* Heuristic Search & Alpha-Beta Pruning',
    'Binary Search Trees & AVL Rotations',
    'Semaphore Synchronization & Deadlock',
    'Wireshark Protocol Packet Sniffing',
  ],
  branches: [
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
  ],
  semesters: [
    'Semester 1',
    'Semester 2',
    'Semester 3',
    'Semester 4',
    'Semester 5',
    'Semester 6',
    'Semester 7',
    'Semester 8',
  ],
};

// -------------------------------------------------------------
// INITIAL USER ACCOUNT
// -------------------------------------------------------------
export const INITIAL_CURRENT_USER: UserAccount = {
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

// -------------------------------------------------------------
// INITIAL COMMUNITY STUDENT PROFILES
// -------------------------------------------------------------
export const INITIAL_STUDENT_PROFILES: StudentProfile[] = [
  {
    id: 'usr-student-me',
    name: 'Nandini R.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    branch: 'CSE',
    semester: 5,
    bio: '3rd Year B.Tech CSE student passionate about Operating Systems, Distributed Systems, and Competitive Programming.',
    interests: ['Data Structures', 'Linux Kernel', 'Web Engineering', 'Competitive Coding'],
    college: 'National Institute of Technology',
    isPublic: true,
    tasksCompletedCount: 38,
    focusHours: 72,
    questionsAskedCount: 4,
    questionsAnsweredCount: 11,
    helpfulVotesCount: 29,
    followers: ['usr-priya', 'usr-aditya', 'usr-ananya'],
    following: ['usr-priya', 'usr-aditya'],
    isOnline: true,
  },
  {
    id: 'usr-priya',
    name: 'Priya Patel',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    branch: 'CSE',
    semester: 7,
    bio: 'Senior Year CSE. Specializing in Systems Programming, Distributed Databases & Cloud Computing. Happy to help junior engineers!',
    interests: ['Operating Systems', 'System Design', 'Kubernetes', 'Go'],
    college: 'IIT / NIT Engineering Faculty',
    isPublic: true,
    tasksCompletedCount: 94,
    focusHours: 184,
    questionsAskedCount: 6,
    questionsAnsweredCount: 42,
    helpfulVotesCount: 118,
    followers: ['usr-student-me', 'usr-aditya', 'usr-karthik'],
    following: ['usr-student-me'],
    isOnline: true,
  },
  {
    id: 'usr-aditya',
    name: 'Aditya Verma',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    branch: 'AI & ML',
    semester: 5,
    bio: 'Machine Learning engineer. Kaggle Competitions master. Let’s collaborate on deep learning, mathematics & optimization.',
    interests: ['Deep Learning', 'PyTorch', 'Linear Algebra', 'Computer Vision'],
    college: 'University College of Engineering',
    isPublic: true,
    tasksCompletedCount: 52,
    focusHours: 110,
    questionsAskedCount: 8,
    questionsAnsweredCount: 24,
    helpfulVotesCount: 67,
    followers: ['usr-student-me', 'usr-priya'],
    following: ['usr-student-me', 'usr-priya'],
    isOnline: false,
  },
  {
    id: 'usr-ananya',
    name: 'Ananya Roy',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
    branch: 'ECE',
    semester: 4,
    bio: 'Electronics & Embedded systems enthusiast. Arduino, ESP32, FPGA verilog designer and signal processing enthusiast.',
    interests: ['VLSI', 'Digital Electronics', 'IoT Sensors', 'Verilog'],
    college: 'State Technical University',
    isPublic: true,
    tasksCompletedCount: 31,
    focusHours: 65,
    questionsAskedCount: 5,
    questionsAnsweredCount: 14,
    helpfulVotesCount: 36,
    followers: ['usr-student-me'],
    following: ['usr-priya'],
    isOnline: true,
  },
  {
    id: 'usr-karthik',
    name: 'Karthik Menon',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    branch: 'CSD',
    semester: 4,
    bio: 'Computer Science & Design (CSD). Frontend architecture, Figma interactive systems, and WebGL 3D canvas interaction.',
    interests: ['UI/UX Design', 'Design Systems', 'Three.js', 'Tailwind CSS'],
    college: 'Autonomous Engineering Institute',
    isPublic: true,
    tasksCompletedCount: 44,
    focusHours: 88,
    questionsAskedCount: 3,
    questionsAnsweredCount: 16,
    helpfulVotesCount: 49,
    followers: ['usr-priya'],
    following: ['usr-priya', 'usr-student-me'],
    isOnline: false,
  },
];

// -------------------------------------------------------------
// INITIAL COMMUNITY QUESTIONS & ANSWERS
// -------------------------------------------------------------
export const INITIAL_COMMUNITY_QUESTIONS: CommunityQuestion[] = [
  {
    id: 'q-1',
    title: 'How does Bellman-Ford reliably detect negative weight cycles in O(V · E)?',
    description: `I understand that running relaxation V-1 times guarantees the single-source shortest path in DAGs and graphs with positive edges. 

However, in our internal test, an external examiner asked: "Why does running the relaxation loop exactly one extra time (the V-th pass) prove the existence of a negative cycle, and can that cycle be reached from the source?" Could someone please provide a clear mathematical proof and sample edge case?`,
    authorId: 'usr-student-me',
    authorName: 'Nandini R.',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    authorBranch: 'CSE',
    semester: 5,
    subject: 'Data Structures & Algorithms',
    topic: 'Graph Theory & Shortest Paths',
    difficulty: 'Intermediate',
    tags: ['Graph Theory', 'Bellman-Ford', 'Shortest Paths', 'Algorithms'],
    isAnonymous: false,
    status: 'resolved',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    attachments: [],
    savedBy: ['usr-priya'],
    followers: ['usr-student-me', 'usr-aditya'],
    upvotes: 14,
    upvotedBy: ['usr-priya', 'usr-aditya', 'usr-ananya'],
    answers: [
      {
        id: 'ans-1',
        questionId: 'q-1',
        authorId: 'usr-priya',
        authorName: 'Priya Patel',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
        authorBranch: 'CSE',
        authorSemester: 7,
        content: `Great question! Here is the exact proof examiners look for:

### 1. The Simple Path Invariant
In any graph with $V$ vertices, any simple path (a path with no repeated vertices) contains at most $V - 1$ edges.
Therefore, after $V - 1$ iterations of edge relaxation, the shortest path distance to every vertex reachable from source $S$ must have stabilized, assuming NO negative weight cycles exist.

### 2. The $V$-th Pass Check
If on the $V$-th pass, there is still ANY edge $(u, v)$ such that:
$$dist[u] + weight(u, v) < dist[v]$$
then $v$'s shortest distance can be reduced even further. Because the path to $v$ now contains at least $V$ edges, by the **Pigeonhole Principle**, at least one vertex must be repeated.

A repeated vertex in a path that *decreases* total cost proves the presence of a **negative weight cycle reachable from $S$**.

### 3. Practical Tip for Viva
If the cycle exists in a disconnected component unreachable from $S$, standard Bellman-Ford starting with $dist[S]=0$ and $dist[\\text{others}]=\\infty$ will NOT detect it. To detect all negative cycles in any component, connect a dummy super-source node with 0-weight edges to every vertex!`,
        attachments: [],
        timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(),
        helpfulVotes: 9,
        votedBy: ['usr-student-me', 'usr-aditya'],
        isAccepted: true,
        comments: [
          {
            id: 'comm-1',
            authorId: 'usr-student-me',
            authorName: 'Nandini R.',
            authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
            text: 'Thank you Priya! The dummy super-source node point was exactly what my professor was asking.',
            timestamp: new Date(Date.now() - 86400000 * 1.2).toISOString(),
          },
        ],
      },
    ],
    reviews: [
      {
        id: 'rev-1',
        questionId: 'q-1',
        answerId: 'ans-1',
        reviewerId: 'usr-student-me',
        reviewerName: 'Nandini R.',
        rating: 5,
        understandable: 'yes',
        feedback: 'Extremely clear explanation with Pigeonhole Principle and practical exam tips!',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
  },
  {
    id: 'q-2',
    title: 'Why does Banker’s Algorithm safe state NOT guarantee deadlock cannot occur later?',
    description: `Our OS textbook says: "A safe state is not a deadlock state, and deadlocks cannot happen as long as the system stays safe."

However, in our tutorial, the professor asked: "Can a process misbehave or request more than its stated maximum and plunge the system into deadlock, or what assumptions does the Banker algorithm make that fail in production Linux kernels?" Could someone break down the real OS perspective?`,
    authorId: 'usr-aditya',
    authorName: 'Aditya Verma',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    authorBranch: 'AI & ML',
    semester: 5,
    subject: 'Operating Systems',
    topic: 'Deadlock Avoidance',
    difficulty: 'Intermediate',
    tags: ['Operating Systems', 'Bankers Algorithm', 'Deadlock', 'Concurrency'],
    isAnonymous: false,
    status: 'answered',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    attachments: [],
    savedBy: [],
    followers: ['usr-aditya', 'usr-student-me'],
    upvotes: 8,
    upvotedBy: ['usr-student-me', 'usr-priya'],
    answers: [
      {
        id: 'ans-2',
        questionId: 'q-2',
        authorId: 'usr-student-me',
        authorName: 'Nandini R.',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        authorBranch: 'CSE',
        authorSemester: 5,
        content: `Here is the explanation from our OS Lab and modern Linux kernel design:

1. **The Theoretical Assumption:** Banker's Algorithm assumes every process declares its **maximum need a priori** (before executing) and that resources are fixed and never fail.
2. **Why Linux does not use it:** In real operating systems, processes (like web browsers or compilers) allocate dynamic heap memory on the fly. A process cannot predict how much RAM it will allocate 10 minutes from now.
3. **If a process exceeds declared Max:** If a process asks for more than declared Max, Banker's Algorithm immediately rejects the request with an error. But if resources crash or hardware fails, a safe sequence can collapse into an unsafe state.
4. **Conclusion:** An unsafe state is not guaranteed to deadlock, but deadlock can only occur from an unsafe state.`,
        attachments: [],
        timestamp: new Date(Date.now() - 86400000 * 3.5).toISOString(),
        helpfulVotes: 6,
        votedBy: ['usr-aditya', 'usr-priya'],
        isAccepted: false,
        comments: [],
      },
    ],
    reviews: [],
  },
  {
    id: 'q-3',
    title: 'How to differentiate between 3NF and BCNF with a realistic student database example?',
    description: `I am confused by the BCNF rule: "For every functional dependency X -> Y, X must be a superkey."
Can someone give an example of a relation that IS in 3NF, but VIOLATES BCNF, and explain how to decompose it losslessly?`,
    authorId: 'usr-ananya',
    authorName: 'Ananya Roy',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
    authorBranch: 'ECE',
    semester: 4,
    subject: 'Database Management Systems',
    topic: 'Relational Schema Normalization',
    difficulty: 'Beginner',
    tags: ['DBMS', 'Normalization', '3NF', 'BCNF'],
    isAnonymous: false,
    status: 'resolved',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    attachments: [],
    savedBy: ['usr-student-me'],
    followers: ['usr-ananya'],
    upvotes: 11,
    upvotedBy: ['usr-student-me', 'usr-priya', 'usr-karthik'],
    answers: [
      {
        id: 'ans-3',
        questionId: 'q-3',
        authorId: 'usr-priya',
        authorName: 'Priya Patel',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
        authorBranch: 'CSE',
        authorSemester: 7,
        content: `Here is the classic textbook case that external examiners love:

Consider relation: **Student_Advisor(Student_ID, Subject, Advisor)**
Rules:
1. Each student can take multiple subjects.
2. For each subject, a student has only 1 advisor: \`(Student_ID, Subject) -> Advisor\`
3. Each advisor teaches only 1 subject: \`Advisor -> Subject\`

**Candidate Keys:** \`(Student_ID, Subject)\` and \`(Student_ID, Advisor)\`
Prime attributes: \`Student_ID, Subject, Advisor\`

### Why it is in 3NF:
For \`Advisor -> Subject\`:
- Is \`Advisor\` a superkey? No.
- But is \`Subject\` a prime attribute? **YES!**
Under 3NF, a dependency is allowed if the RHS is a prime attribute.

### Why it violates BCNF:
BCNF removes the prime attribute loophole. For \`Advisor -> Subject\`, \`Advisor\` is NOT a superkey. Therefore, it VIOLATES BCNF!

**Lossless Decomposition:**
Decompose into:
1. \`Advisor_Subject(Advisor, Subject)\` with PK = \`Advisor\`
2. \`Student_Advisor(Student_ID, Advisor)\` with PK = \`(Student_ID, Advisor)\``,
        attachments: [],
        timestamp: new Date(Date.now() - 86400000 * 4.8).toISOString(),
        helpfulVotes: 10,
        votedBy: ['usr-ananya', 'usr-student-me', 'usr-karthik'],
        isAccepted: true,
        comments: [],
      },
    ],
    reviews: [
      {
        id: 'rev-2',
        questionId: 'q-3',
        answerId: 'ans-3',
        reviewerId: 'usr-ananya',
        reviewerName: 'Ananya Roy',
        rating: 5,
        understandable: 'yes',
        feedback: 'The Student_Advisor relation example made it click instantly! Thank you.',
        timestamp: new Date(Date.now() - 86400000 * 4.5).toISOString(),
      },
    ],
  },
];

// -------------------------------------------------------------
// INITIAL DIRECT MESSAGES
// -------------------------------------------------------------
export const INITIAL_DIRECT_MESSAGES: DirectMessage[] = [
  {
    id: 'dm-1',
    senderId: 'usr-priya',
    recipientId: 'usr-student-me',
    content: 'Hey Nandini! Saw your solution on the OS Semaphore producer-consumer problem. Very neatly organized with counting semaphores.',
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
    read: true,
  },
  {
    id: 'dm-2',
    senderId: 'usr-student-me',
    recipientId: 'usr-priya',
    content: 'Thanks Priya! Are you preparing for the upcoming campus recruitment mock tests this Saturday?',
    timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
    read: true,
  },
  {
    id: 'dm-3',
    senderId: 'usr-priya',
    recipientId: 'usr-student-me',
    content: 'Yes! I have a set of previous year placement questions on Dynamic Programming and SQL Subqueries. I can share the observation notes with you.',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    read: false,
  },
];

// -------------------------------------------------------------
// INITIAL NOTIFICATIONS
// -------------------------------------------------------------
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'usr-student-me',
    type: 'new_answer',
    title: 'New Community Answer',
    message: 'Priya Patel submitted an in-depth explanation on your question "How does Bellman-Ford reliably detect negative weight cycles?".',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    read: false,
    linkTab: 'community',
    referenceId: 'q-1',
    senderName: 'Priya Patel',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 'notif-2',
    userId: 'usr-student-me',
    type: 'direct_message',
    title: 'New Direct Message',
    message: 'Priya Patel sent you a message: "Yes! I have a set of previous year placement questions..."',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    read: false,
    linkTab: 'students',
    referenceId: 'usr-priya',
    senderName: 'Priya Patel',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 'notif-3',
    userId: 'usr-student-me',
    type: 'question_upvoted',
    title: 'Question Upvoted',
    message: 'Aditya Verma and 2 others upvoted your question on Bellman-Ford Negative Cycles.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    read: true,
    linkTab: 'community',
    referenceId: 'q-1',
    senderName: 'Aditya Verma',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  },
];

// Helper functions for safe LocalStorage access
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to load ${key} from storage:`, err);
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to save ${key} to storage:`, err);
  }
}

export function loadLabCoursesFromStorage(): LabCourse[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LAB_COURSES);
    if (!raw) return INITIAL_LAB_COURSES;
    const parsed: LabCourse[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_LAB_COURSES;

    // Check if new official curriculum courses exist in parsed
    const existingIds = new Set(parsed.map((c) => c.id));
    const missingOfficialCourses = INITIAL_LAB_COURSES.filter((c) => !existingIds.has(c.id));
    
    if (missingOfficialCourses.length > 0) {
      const merged = [...parsed, ...missingOfficialCourses];
      saveToStorage(STORAGE_KEYS.LAB_COURSES, merged);
      return merged;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to load lab courses from storage:', err);
    return INITIAL_LAB_COURSES;
  }
}

// Custom Taxonomies (Personalization Everywhere)
export function loadCustomTaxonomies(): CustomTaxonomies {
  const loaded = loadFromStorage<CustomTaxonomies>(STORAGE_KEYS.TAXONOMIES, INITIAL_TAXONOMIES);
  // Ensure default arrays exist
  return {
    subjects: Array.from(new Set([...INITIAL_TAXONOMIES.subjects, ...(loaded.subjects || [])])),
    categories: Array.from(new Set([...INITIAL_TAXONOMIES.categories, ...(loaded.categories || [])])),
    topics: Array.from(new Set([...INITIAL_TAXONOMIES.topics, ...(loaded.topics || [])])),
    branches: Array.from(new Set([...INITIAL_TAXONOMIES.branches, ...(loaded.branches || [])])),
    semesters: Array.from(new Set([...INITIAL_TAXONOMIES.semesters, ...(loaded.semesters || [])])),
  };
}

export function saveCustomTaxonomies(taxonomies: CustomTaxonomies): void {
  saveToStorage(STORAGE_KEYS.TAXONOMIES, taxonomies);
}

export function addCustomSubject(subject: string): CustomTaxonomies {
  const current = loadCustomTaxonomies();
  const trimmed = subject.trim();
  if (trimmed && !current.subjects.includes(trimmed)) {
    const updated: CustomTaxonomies = {
      ...current,
      subjects: [...current.subjects, trimmed],
    };
    saveCustomTaxonomies(updated);
    return updated;
  }
  return current;
}

export function renameCustomSubject(oldName: string, newName: string): CustomTaxonomies {
  const current = loadCustomTaxonomies();
  const trimmed = newName.trim();
  if (!trimmed || oldName === trimmed) return current;
  const updated: CustomTaxonomies = {
    ...current,
    subjects: current.subjects.map(s => s === oldName ? trimmed : s),
  };
  saveCustomTaxonomies(updated);
  return updated;
}

export function deleteCustomSubject(subject: string): CustomTaxonomies {
  const current = loadCustomTaxonomies();
  const updated: CustomTaxonomies = {
    ...current,
    subjects: current.subjects.filter(s => s !== subject),
  };
  saveCustomTaxonomies(updated);
  return updated;
}

export function addCustomCategory(category: string): CustomTaxonomies {
  const current = loadCustomTaxonomies();
  const trimmed = category.trim();
  if (trimmed && !current.categories.includes(trimmed)) {
    const updated: CustomTaxonomies = {
      ...current,
      categories: [...current.categories, trimmed],
    };
    saveCustomTaxonomies(updated);
    return updated;
  }
  return current;
}

// User Accounts
export function loadCurrentUser(): UserAccount {
  return loadFromStorage<UserAccount>(STORAGE_KEYS.CURRENT_USER, INITIAL_CURRENT_USER);
}

export function saveCurrentUser(user: UserAccount): void {
  saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
}

// Community Questions
export function loadCommunityQuestions(): CommunityQuestion[] {
  return loadFromStorage<CommunityQuestion[]>(STORAGE_KEYS.COMMUNITY_QUESTIONS, INITIAL_COMMUNITY_QUESTIONS);
}

export function saveCommunityQuestions(questions: CommunityQuestion[]): void {
  saveToStorage(STORAGE_KEYS.COMMUNITY_QUESTIONS, questions);
}

// Student Profiles
export function loadStudentProfiles(): StudentProfile[] {
  return loadFromStorage<StudentProfile[]>(STORAGE_KEYS.STUDENT_PROFILES, INITIAL_STUDENT_PROFILES);
}

export function saveStudentProfiles(profiles: StudentProfile[]): void {
  saveToStorage(STORAGE_KEYS.STUDENT_PROFILES, profiles);
}

// Direct Messages
export function loadDirectMessages(): DirectMessage[] {
  return loadFromStorage<DirectMessage[]>(STORAGE_KEYS.DIRECT_MESSAGES, INITIAL_DIRECT_MESSAGES);
}

export function saveDirectMessages(messages: DirectMessage[]): void {
  saveToStorage(STORAGE_KEYS.DIRECT_MESSAGES, messages);
}

// Notifications
export function loadNotifications(): NotificationItem[] {
  return loadFromStorage<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
}

export function saveNotifications(notifications: NotificationItem[]): void {
  saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
}

export function exportAllDataAsJSON(): string {
  const payload = {
    exportDate: new Date().toISOString(),
    app: 'B.Tech Buddy',
    version: '3.0.0',
    currentUser: loadCurrentUser(),
    taxonomies: loadCustomTaxonomies(),
    tasks: loadFromStorage(STORAGE_KEYS.TASKS, INITIAL_TASKS),
    timetable: loadFromStorage(STORAGE_KEYS.TIMETABLE, INITIAL_TIMETABLE),
    labs: loadFromStorage(STORAGE_KEYS.LABS, INITIAL_LABS),
    labCourses: loadFromStorage(STORAGE_KEYS.LAB_COURSES, INITIAL_LAB_COURSES),
    assignments: loadFromStorage(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS),
    timerLogs: loadFromStorage(STORAGE_KEYS.TIMER_LOGS, INITIAL_TIMER_LOGS),
    attendance: loadFromStorage(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE),
    questions: loadCommunityQuestions(),
    profiles: loadStudentProfiles(),
    messages: loadDirectMessages(),
    notifications: loadNotifications(),
  };
  return JSON.stringify(payload, null, 2);
}

export function importAllDataFromJSON(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.tasks) saveToStorage(STORAGE_KEYS.TASKS, data.tasks);
    if (data.timetable) saveToStorage(STORAGE_KEYS.TIMETABLE, data.timetable);
    if (data.labs) saveToStorage(STORAGE_KEYS.LABS, data.labs);
    if (data.labCourses) saveToStorage(STORAGE_KEYS.LAB_COURSES, data.labCourses);
    if (data.assignments) saveToStorage(STORAGE_KEYS.ASSIGNMENTS, data.assignments);
    if (data.timerLogs) saveToStorage(STORAGE_KEYS.TIMER_LOGS, data.timerLogs);
    if (data.attendance) saveToStorage(STORAGE_KEYS.ATTENDANCE, data.attendance);
    if (data.currentUser) saveToStorage(STORAGE_KEYS.CURRENT_USER, data.currentUser);
    if (data.taxonomies) saveToStorage(STORAGE_KEYS.TAXONOMIES, data.taxonomies);
    if (data.questions) saveToStorage(STORAGE_KEYS.COMMUNITY_QUESTIONS, data.questions);
    if (data.profiles) saveToStorage(STORAGE_KEYS.STUDENT_PROFILES, data.profiles);
    if (data.messages) saveToStorage(STORAGE_KEYS.DIRECT_MESSAGES, data.messages);
    if (data.notifications) saveToStorage(STORAGE_KEYS.NOTIFICATIONS, data.notifications);
    return true;
  } catch (err) {
    console.error('Failed to parse backup JSON:', err);
    return false;
  }
}

export function resetAllDataToDefault(): void {
  saveToStorage(STORAGE_KEYS.TASKS, INITIAL_TASKS);
  saveToStorage(STORAGE_KEYS.TIMETABLE, INITIAL_TIMETABLE);
  saveToStorage(STORAGE_KEYS.LABS, INITIAL_LABS);
  saveToStorage(STORAGE_KEYS.LAB_COURSES, INITIAL_LAB_COURSES);
  saveToStorage(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
  saveToStorage(STORAGE_KEYS.TIMER_LOGS, INITIAL_TIMER_LOGS);
  saveToStorage(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
  saveToStorage(STORAGE_KEYS.CHAT, INITIAL_CHAT);
  saveToStorage(STORAGE_KEYS.TAXONOMIES, INITIAL_TAXONOMIES);
  saveToStorage(STORAGE_KEYS.CURRENT_USER, INITIAL_CURRENT_USER);
  saveToStorage(STORAGE_KEYS.COMMUNITY_QUESTIONS, INITIAL_COMMUNITY_QUESTIONS);
  saveToStorage(STORAGE_KEYS.STUDENT_PROFILES, INITIAL_STUDENT_PROFILES);
  saveToStorage(STORAGE_KEYS.DIRECT_MESSAGES, INITIAL_DIRECT_MESSAGES);
  saveToStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
}
