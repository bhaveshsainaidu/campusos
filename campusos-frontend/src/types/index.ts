export type Role = 'ROLE_ADMIN' | 'ROLE_FACULTY' | 'ROLE_STUDENT';

export interface User {
  id: number;
  email: string;
  role: Role;
  fullName: string;
  phone?: string;
  active: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  expiresIn?: number;
  user?: User;
  role?: string;
  fullName?: string;
  userId?: number;
}

export interface Department {
  id: number;
  code: string;
  name: string;
  headOfDepartment?: string;
  description?: string;
}

export interface Course {
  id: number;
  code: string;
  title: string;
  departmentId: number;
  departmentName?: string;
  credits: number;
  type: 'THEORY' | 'PRACTICAL' | 'HYBRID';
  semester: number;
  description?: string;
}

export interface Classroom {
  id: number;
  roomNumber: string;
  building: string;
  capacity: number;
  hasProjector?: boolean;
  hasLabEquipment?: boolean;
}

export interface TimetableSlot {
  id: number;
  sectionId: number;
  courseId: number;
  courseTitle?: string;
  courseCode?: string;
  facultyId: number;
  facultyName?: string;
  classroomId: number;
  classroomNumber?: string;
  dayOfWeek: number; // 1 = Monday, 7 = Sunday
  startTime: string; // HH:mm:ss
  endTime: string;   // HH:mm:ss
}

export interface AttendanceSession {
  id: number;
  courseId: number;
  courseTitle?: string;
  facultyId: number;
  facultyName?: string;
  classDate: string;
  sessionType: 'LECTURE' | 'LAB' | 'TUTORIAL';
  totalStudents: number;
  presentCount: number;
  absentCount: number;
}

export interface AttendanceRecord {
  id: number;
  sessionId: number;
  studentId: number;
  studentName?: string;
  enrollmentNumber?: string;
  classDate: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  remarks?: string;
}

export interface StudentAttendanceSummary {
  overallPercentage: number;
  totalClasses: number;
  attendedClasses: number;
  courses: {
    courseId: number;
    courseCode: string;
    courseTitle: string;
    total: number;
    attended: number;
    percentage: number;
  }[];
}

export interface ShortageStudent {
  studentId: number;
  studentName: string;
  enrollmentNumber: string;
  departmentName: string;
  percentage: number;
  totalClasses: number;
  attendedClasses: number;
}

export interface Exam {
  id: number;
  name: string;
  semester: number;
  academicYear: string;
  startDate: string;
  endDate: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'RESULTS_PUBLISHED';
}

export interface ExamScheduleItem {
  id: number;
  examId: number;
  courseId: number;
  courseCode?: string;
  courseTitle?: string;
  examDate: string;
  startTime: string;
  endTime: string;
  maxMarks: number;
}

export interface MarkRecord {
  id: number;
  studentId: number;
  studentName: string;
  enrollmentNumber: string;
  marksObtained: number;
  maxMarks: number;
  grade?: string;
}

export interface Marksheet {
  id: number;
  studentId: number;
  studentName: string;
  enrollmentNumber: string;
  semester: number;
  academicYear: string;
  sgpa: number;
  cgpa: number;
  status: 'GENERATING' | 'READY' | 'FAILED';
  pdfUrl?: string;
  generatedAt: string;
  subjects?: {
    courseCode: string;
    courseTitle: string;
    credits: number;
    marksObtained: number;
    maxMarks: number;
    grade: string;
    gradePoints: number;
  }[];
}

export interface FeeStructure {
  id: number;
  name: string;
  academicYear: string;
  semester: number;
  amount: number;
  dueDate: string;
  departmentId?: number;
  description?: string;
}

export interface StudentFee {
  id: number;
  studentId: number;
  feeStructureId: number;
  feeStructureName: string;
  amount: number;
  paidAmount: number;
  status: 'PENDING' | 'PAID' | 'PARTIAL' | 'OVERDUE';
  dueDate: string;
  paymentReference?: string;
  paidAt?: string;
}

export interface RazorpayOrder {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  targetAudience: 'ALL' | 'STUDENT' | 'FACULTY';
  publishedAt: string;
  authorName?: string;
}

export interface AdminDashboardKPI {
  totalStudents: number;
  totalFaculty: number;
  totalDepartments: number;
  activeCourses: number;
  pendingFees: number;
  attendanceTrend: {
    date: string;
    attendanceRate: number;
  }[];
}

export interface FacultyDashboardData {
  classesToday: {
    id: number;
    courseCode: string;
    courseTitle: string;
    roomNumber: string;
    startTime: string;
    endTime: string;
    isAttendanceMarked: boolean;
  }[];
  activeCourses: {
    id: number;
    code: string;
    title: string;
    credits: number;
    studentCount: number;
  }[];
}

export interface StudentDashboardData {
  student: {
    id: number;
    name: string;
    enrollmentNumber: string;
    department: string;
    semester: number;
  };
  todayClasses: {
    courseCode: string;
    courseTitle: string;
    roomNumber: string;
    startTime: string;
    endTime: string;
  }[];
  overallAttendancePercentage: number;
  pendingFeeAmount: number;
  cgpa: number;
}
