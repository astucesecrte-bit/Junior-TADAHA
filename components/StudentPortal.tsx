
import React, { useState } from 'react';
import { User, ShieldCheck, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import Camera from './Camera';
import { Student, AttendanceRecord, ClassSession } from '../types';
import { verifyFace } from '../services/geminiService';

interface StudentPortalProps {
  student: Student;
  sessions: ClassSession[];
  onMarkPresence: (record: AttendanceRecord) => void;
  attendanceHistory: AttendanceRecord[];
}

const StudentPortal: React.FC<StudentPortalProps> = ({ 
  student, 
  sessions, 
  onMarkPresence,
  attendanceHistory
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  const activeSession = sessions.find(s => {
    const now = new Date();
    const sessionDate = new Date(s.date);
    return sessionDate.toDateString() === now.toDateString(); // Simplified for demo
  });

  const hasAlreadyMarked = attendanceHistory.some(a => 
    a.studentId === student.id && 
    a.sessionId === activeSession?.id &&
    a.status === 'present'
  );

  const handleCapture = async (base64: string) => {
    if (!student.faceEmbeddings || student.faceEmbeddings.length === 0) {
      setFeedback({ type: 'error', message: "Profil facial non enregistré. Contactez l'admin." });
      return;
    }

    setIsProcessing(true);
    setFeedback({ type: null, message: '' });

    // In a real app, we might compare against multiple embeddings or use a vector search.
    // For this demo, we compare with the first registered image.
    const result = await verifyFace(student.faceEmbeddings[0], base64);

    setIsProcessing(false);

    if (result.verified && result.confidence > 0.6) {
      const newRecord: AttendanceRecord = {
        id: Math.random().toString(36).substr(2, 9),
        studentId: student.id,
        sessionId: activeSession?.id || 'manual',
        timestamp: new Date().toISOString(),
        status: 'present',
        confidence: result.confidence
      };
      onMarkPresence(newRecord);
      setFeedback({ 
        type: 'success', 
        message: `Présence validée pour ${student.firstName} ! (Confiance: ${(result.confidence*100).toFixed(1)}%)` 
      });
    } else {
      setFeedback({ 
        type: 'error', 
        message: "Visage non reconnu. Veuillez réessayer dans un environnement bien éclairé." 
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
          <User className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Bienvenue, {student.firstName} {student.lastName}</h2>
          <p className="text-gray-500">Matricule: {student.studentId} • {student.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Attendance Action */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold">Marquer ma présence</h3>
          </div>

          {hasAlreadyMarked ? (
            <div className="bg-green-50 p-6 rounded-xl border border-green-100 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-green-800 font-medium">Votre présence est déjà enregistrée pour aujourd'hui.</p>
              <p className="text-green-600 text-sm mt-1">Session: {activeSession?.name}</p>
            </div>
          ) : activeSession ? (
            <div className="space-y-4">
              <p className="text-gray-600">Positionnez votre visage face à la caméra pour vous authentifier.</p>
              <Camera onCapture={handleCapture} isProcessing={isProcessing} />
              
              {feedback.type && (
                <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2
                  ${feedback.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}
                `}>
                  {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                  <span className="text-sm font-medium">{feedback.message}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 bg-gray-50 rounded-xl text-center border border-gray-100">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Aucune session active en ce moment.</p>
            </div>
          )}
        </div>

        {/* History */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold">Historique récent</h3>
          </div>
          
          <div className="space-y-3">
            {attendanceHistory.filter(a => a.studentId === student.id).slice(0, 5).map(record => {
              const session = sessions.find(s => s.id === record.sessionId);
              return (
                <div key={record.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">{session?.name || 'Session'}</p>
                    <p className="text-xs text-gray-500">{new Date(record.timestamp).toLocaleString()}</p>
                  </div>
                  <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                    Présent
                  </span>
                </div>
              );
            })}
            {attendanceHistory.filter(a => a.studentId === student.id).length === 0 && (
              <p className="text-center py-8 text-gray-400 italic">Aucun historique disponible.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;
