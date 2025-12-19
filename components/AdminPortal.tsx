
import React, { useState, useMemo } from 'react';
import { 
  Users, Calendar, CheckCircle, XCircle, 
  Download, Filter, Search, Trash2, TrendingUp,
  MoreHorizontal, ChevronRight
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Student, AttendanceRecord, ClassSession } from '../types';

interface AdminPortalProps {
  students: Student[];
  attendance: AttendanceRecord[];
  sessions: ClassSession[];
  onDeleteStudent: (id: string) => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ 
  students, 
  attendance, 
  sessions,
  onDeleteStudent
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'history'>('overview');

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const presentToday = attendance.filter(a => a.timestamp.startsWith(today) && a.status === 'present').length;
    const totalStudents = students.length;
    const rate = totalStudents > 0 ? (presentToday / totalStudents) * 100 : 0;

    return { totalStudents, presentToday, absentToday: totalStudents - presentToday, rate: rate.toFixed(1) };
  }, [students, attendance]);

  const chartData = sessions.map(session => ({
    name: session.name.split(' ').map(w => w[0]).join(''), // Initiales
    fullName: session.name,
    present: attendance.filter(a => a.sessionId === session.id && a.status === 'present').length
  }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Tableau de Bord</h1>
          <p className="text-slate-500 font-medium mt-1">Supervision globale et gestion des flux de présence.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold hover:bg-slate-50 transition-all shadow-sm">
            <Calendar className="w-4 h-4" /> Hebdomadaire
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            <Download className="w-4 h-4" /> Rapport PDF
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Effectif Total', value: stats.totalStudents, icon: Users, color: 'blue' },
          { label: 'Présents ce jour', value: stats.presentToday, icon: CheckCircle, color: 'emerald' },
          { label: 'Absences', value: stats.absentToday, icon: XCircle, color: 'rose' },
          { label: 'Taux Moyen', value: `${stats.rate}%`, icon: TrendingUp, color: 'indigo' },
        ].map((item, i) => (
          <div key={i} className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className={`w-14 h-14 rounded-2xl bg-${item.color}-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <item.icon className={`w-7 h-7 text-${item.color}-600`} />
            </div>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">{item.label}</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100 p-2">
          {['overview', 'students', 'history'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-8 py-4 text-sm font-black rounded-2xl transition-all
                ${activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}
              `}
            >
              {tab === 'overview' ? 'Statistiques' : tab === 'students' ? 'Étudiants' : 'Logs de Présence'}
            </button>
          ))}
        </div>

        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-lg font-black flex items-center gap-2">
                   <TrendingUp className="w-5 h-5 text-blue-600" /> Participation par cours
                </h3>
                <div className="h-80 w-full pt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '15px'}}
                        cursor={{fill: '#f8fafc'}}
                      />
                      <Bar dataKey="present" fill="#2563eb" radius={[10, 10, 0, 0]} barSize={40}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#2563eb' : '#3b82f6'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-slate-50 rounded-3xl p-6">
                <h3 className="font-black mb-6">Activités Récentes</h3>
                <div className="space-y-4">
                  {attendance.slice(-4).reverse().map((a, i) => {
                    const s = students.find(std => std.id === a.studentId);
                    return (
                      <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                           <CheckCircle className="w-5 h-5" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-bold truncate">{s?.firstName} {s?.lastName}</p>
                          <p className="text-xs text-slate-500">{new Date(a.timestamp).toLocaleTimeString()}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="space-y-6">
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Nom ou Matricule..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {students.filter(s => `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())).map(s => (
                  <div key={s.id} className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl hover:border-blue-200 transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {s.firstName[0]}{s.lastName[0]}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-bold text-slate-900 truncate">{s.firstName} {s.lastName}</p>
                      <p className="text-xs text-slate-500">{s.studentId}</p>
                    </div>
                    <button onClick={() => onDeleteStudent(s.id)} className="p-2 text-slate-300 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
             <div className="overflow-x-auto rounded-2xl border border-slate-100">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-widest font-black">
                    <tr>
                      <th className="px-6 py-4">Horodatage</th>
                      <th className="px-6 py-4">Étudiant</th>
                      <th className="px-6 py-4 text-center">IA Confidence</th>
                      <th className="px-6 py-4 text-right">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {attendance.slice().reverse().map(r => {
                      const s = students.find(std => std.id === r.studentId);
                      return (
                        <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-slate-600">
                            {new Date(r.timestamp).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-slate-900">{s?.firstName} {s?.lastName}</span>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex items-center justify-center gap-2">
                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full max-w-[60px] overflow-hidden">
                                  <div className="h-full bg-blue-600" style={{width: `${r.confidence*100}%`}}></div>
                                </div>
                                <span className="text-xs font-bold text-slate-400">{(r.confidence*100).toFixed(0)}%</span>
                             </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black">
                               <CheckCircle className="w-3 h-3" /> PRÉSENT
                             </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
