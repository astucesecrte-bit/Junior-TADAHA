
import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  UserCircle, 
  LogIn, 
  LogOut, 
  LayoutDashboard, 
  Menu,
  X,
  Plus,
  ArrowRight,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { UserRole, Student, AttendanceRecord, ClassSession, UserSession } from './types.ts';
import AdminPortal from './components/AdminPortal.tsx';
import StudentPortal from './components/StudentPortal.tsx';
import Registration from './components/Registration.tsx';

const today = new Date();
const INITIAL_SESSIONS: ClassSession[] = [
  { id: '1', name: 'Algorithmique & Structures de Données', startTime: '08:00', endTime: '10:00', date: today.toISOString() },
  { id: '2', name: 'Intelligence Artificielle', startTime: '10:15', endTime: '12:15', date: today.toISOString() },
  { id: '3', name: 'Développement Web Moderne', startTime: '14:00', endTime: '16:00', date: today.toISOString() },
];

const App: React.FC = () => {
  const [session, setSession] = useState<UserSession>({ role: UserRole.STUDENT, user: null });
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('face_attendance_students');
    return saved ? JSON.parse(saved) : [];
  });
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('face_attendance_records');
    return saved ? JSON.parse(saved) : [];
  });
  const [view, setView] = useState<'home' | 'login' | 'register' | 'portal'>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('face_attendance_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('face_attendance_records', JSON.stringify(attendance));
  }, [attendance]);

  const toggleRole = () => {
    const newRole = session.role === UserRole.ADMIN ? UserRole.STUDENT : UserRole.ADMIN;
    setSession({ role: newRole, user: newRole === UserRole.ADMIN ? null : session.user });
    if (newRole === UserRole.ADMIN || session.user) setView('portal');
    else setView('home');
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="blob top-[-10%] left-[-10%]" />
      <div className="blob bottom-[-10%] right-[-10%]" />

      <nav className="glass sticky top-0 z-50 px-6 py-4 mx-4 my-2 rounded-3xl mt-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('home')}>
            <div className="bg-slate-900 p-2.5 rounded-2xl group-hover:rotate-12 transition-transform duration-300 shadow-xl shadow-slate-200">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">ENPD<span className="text-blue-600">.</span>FaceID</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={toggleRole} className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-2">
              {session.role === UserRole.ADMIN ? <UserCircle className="w-4 h-4" /> : <LayoutDashboard className="w-4 h-4" />}
              Espace {session.role === UserRole.ADMIN ? 'Étudiant' : 'Admin'}
            </button>
            
            {session.user || session.role === UserRole.ADMIN ? (
              <button onClick={() => {setSession({role: UserRole.STUDENT, user: null}); setView('home');}} className="px-5 py-2.5 bg-slate-100 rounded-xl text-sm font-black hover:bg-slate-200 transition-all text-slate-700">Déconnexion</button>
            ) : (
              <div className="flex items-center gap-4">
                <button onClick={() => setView('login')} className="text-sm font-bold text-slate-600">Connexion</button>
                <button onClick={() => setView('register')} className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-black hover:bg-blue-600 shadow-xl shadow-slate-200 transition-all active:scale-95">Rejoindre</button>
              </div>
            )}
          </div>
          
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2"><Menu className="w-6 h-6" /></button>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 relative">
        {view === 'home' && (
          <div className="flex flex-col items-center justify-center min-h-[65vh] text-center space-y-12 animate-in fade-in zoom-in duration-1000">
            <div className="space-y-8 max-w-4xl">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass text-blue-700 text-xs font-black uppercase tracking-[0.2em] shadow-sm mx-auto">
                <GraduationCap className="w-4 h-4" /> Ecole Nationale Polytechnique de Douala
              </div>
              <h1 className="text-6xl md:text-9xl font-black text-slate-900 leading-[0.9] tracking-tighter">
                La présence <br/> devance le <span className="text-blue-600">temps.</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                Système intelligent de gestion de présence biométrique développé par <span className="text-slate-900 font-bold">Junior Tadaha</span> pour l'ENPD.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button onClick={() => setView('register')} className="group px-12 py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all hover:-translate-y-1 flex items-center gap-3">
                Commencer <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
              <button onClick={() => setView('login')} className="px-12 py-6 glass text-slate-700 rounded-[2rem] font-black text-xl hover:bg-white/80 transition-all">Connexion</button>
            </div>
            
            <div className="w-full max-w-5xl mt-24">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { label: "Vérification IA", icon: "✨", desc: "Précision de 99% grâce aux modèles Gemini de Google." },
                    { label: "ENPD Standard", icon: "🛡️", desc: "Conforme aux exigences de l'Ecole Polytechnique." },
                    { label: "Data Insight", icon: "📈", desc: "Analyses temps-réel pour l'administration." }
                  ].map((f, i) => (
                    <div key={i} className="glass p-10 rounded-[2.5rem] text-left hover:border-blue-200 transition-all">
                      <div className="text-4xl mb-6">{f.icon}</div>
                      <h3 className="text-xl font-black mb-2">{f.label}</h3>
                      <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {view === 'register' && <Registration onRegister={(s) => {setStudents([...students, s]); setSession({role: UserRole.STUDENT, user: s}); setView('portal');}} onCancel={() => setView('home')} />}
        {view === 'login' && (
          <div className="max-w-md mx-auto pt-10">
            <div className="glass p-10 rounded-[3rem] shadow-2xl space-y-8">
              <div className="text-center">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Bonjour !</h2>
                <p className="text-slate-500 font-medium mt-2">Accès au portail ENPD.</p>
              </div>
              <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault();
                const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
                const found = students.find(s => s.email === email);
                if (found) { setSession({role: UserRole.STUDENT, user: found}); setView('portal'); }
                else alert("Compte non trouvé à l'ENPD.");
              }}>
                <input name="email" type="email" placeholder="Email institutionnel" className="w-full px-6 py-5 glass border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" required />
                <input type="password" placeholder="Mot de passe" className="w-full px-6 py-5 glass border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" required />
                <button type="submit" className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">Connexion ENPD</button>
              </form>
            </div>
          </div>
        )}
        {view === 'portal' && (
          session.role === UserRole.ADMIN 
          ? <AdminPortal students={students} attendance={attendance} sessions={INITIAL_SESSIONS} onDeleteStudent={(id) => setStudents(students.filter(s => s.id !== id))} />
          : <StudentPortal student={session.user!} sessions={INITIAL_SESSIONS} onMarkPresence={(r) => setAttendance([...attendance, r])} attendanceHistory={attendance} />
        )}
      </main>

      <footer className="py-12 mt-20 border-t border-slate-100 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center font-black text-white">E</div>
             <div>
               <p className="text-slate-900 font-black text-sm uppercase tracking-widest">ENPD Douala</p>
               <p className="text-slate-400 text-xs font-bold">Par Junior Tadaha</p>
             </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
              © 2024 Junior Tadaha - Tous droits réservés
            </p>
            <p className="text-slate-400 text-[10px] mt-1">
              Ecole Nationale Polytechnique de Douala (ENPD)
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
