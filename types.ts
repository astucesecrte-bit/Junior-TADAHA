
export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentId: string; // Matricule
  email: string;
  faceEmbeddings?: string[]; // Base64 reference images for Gemini comparison
  status: 'active' | 'inactive';
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  timestamp: string;
  sessionId: string;
  status: 'present' | 'absent';
  confidence: number;
}

export interface ClassSession {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  date: string;
}

export interface UserSession {
  role: UserRole;
  user: Student | null;
}
