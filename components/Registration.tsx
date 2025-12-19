
import React, { useState } from 'react';
import { UserPlus, Mail, Fingerprint, Camera as CameraIcon, CheckCircle2 } from 'lucide-react';
import Camera from './Camera';
import { Student } from '../types';

interface RegistrationProps {
  onRegister: (student: Student) => void;
  onCancel: () => void;
}

const Registration: React.FC<RegistrationProps> = ({ onRegister, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    email: '',
    password: ''
  });
  const [capturedFace, setCapturedFace] = useState<string | null>(null);

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleFaceCapture = (base64: string) => {
    setCapturedFace(base64);
  };

  const completeRegistration = () => {
    if (!capturedFace) return;
    
    const newStudent: Student = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      faceEmbeddings: [capturedFace],
      status: 'active'
    };
    onRegister(newStudent);
  };

  return (
    <div className="max-w-xl mx-auto glass rounded-[3rem] shadow-2xl overflow-hidden border border-white/50">
      <div className="bg-slate-900 p-10 text-white text-center">
        <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/20">
          {step === 1 ? <UserPlus className="w-10 h-10" /> : <Fingerprint className="w-10 h-10" />}
        </div>
        <h2 className="text-3xl font-black tracking-tight">{step === 1 ? 'Inscription ENPD' : 'Scan Biométrique'}</h2>
        <p className="text-slate-400 mt-2 font-medium">
          {step === 1 ? 'Rejoignez le portail numérique de l\'école' : 'Sécurisez votre profil avec votre visage'}
        </p>
      </div>

      <div className="p-10">
        {step === 1 ? (
          <form onSubmit={handleSubmitInfo} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Prénom</label>
                <input
                  required
                  type="text"
                  value={formData.firstName}
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                  placeholder="Jean"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Nom</label>
                <input
                  required
                  type="text"
                  value={formData.lastName}
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                  placeholder="Dupont"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Matricule Polytechnique</label>
              <input
                required
                type="text"
                value={formData.studentId}
                onChange={e => setFormData({...formData, studentId: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold uppercase"
                placeholder="Ex: 21P2XX"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Email @enpd-douala.cm</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                  placeholder="nom.prenom@enpd-douala.cm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Mot de passe</label>
              <input
                required
                type="password"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
              />
            </div>
            
            <div className="pt-6 flex items-center gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-6 py-4 border border-slate-200 text-slate-600 rounded-2xl font-black hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-[2] px-6 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
              >
                Étape Suivante
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-8 text-center">
            {capturedFace ? (
              <div className="space-y-8">
                <div className="relative w-56 h-56 mx-auto rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl">
                  <img src={capturedFace} alt="Face captured" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-blue-600/10 flex items-center justify-center">
                     <CheckCircle2 className="w-16 h-16 text-white drop-shadow-lg" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900">Visage Identifié !</h3>
                  <p className="text-slate-500 font-medium">Votre empreinte faciale est prête à être enregistrée à l'ENPD.</p>
                </div>
                <div className="flex flex-col gap-4">
                  <button
                    onClick={completeRegistration}
                    className="w-full px-8 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-blue-600 transition-all shadow-2xl shadow-slate-200"
                  >
                    Valider mon Inscription
                  </button>
                  <button
                    onClick={() => setCapturedFace(null)}
                    className="text-sm text-slate-400 hover:text-blue-600 font-bold uppercase tracking-widest"
                  >
                    Reprendre la photo
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-5 glass border-blue-100 text-blue-700 rounded-[2rem] text-sm flex items-start gap-4 text-left">
                  <div className="p-3 bg-blue-600 rounded-2xl text-white">
                    <CameraIcon className="w-5 h-5 shrink-0" />
                  </div>
                  <p className="font-medium leading-relaxed">Positionnez-vous dans un endroit éclairé. Votre visage servira de clé d'accès unique.</p>
                </div>
                <Camera onCapture={handleFaceCapture} />
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-slate-400 hover:text-slate-900 font-bold uppercase tracking-widest"
                >
                  Modifier mes infos
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Registration;
