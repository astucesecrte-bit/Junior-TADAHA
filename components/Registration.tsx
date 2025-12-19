
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
    <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-blue-600 p-8 text-white text-center">
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
          {step === 1 ? <UserPlus className="w-8 h-8" /> : <Fingerprint className="w-8 h-8" />}
        </div>
        <h2 className="text-2xl font-bold">{step === 1 ? 'Créer mon compte' : 'Enregistrement Facial'}</h2>
        <p className="text-blue-100 mt-1">
          {step === 1 ? 'Rejoignez le système de présence intelligent' : 'Capturez votre visage pour l\'authentification'}
        </p>
      </div>

      <div className="p-8">
        {step === 1 ? (
          <form onSubmit={handleSubmitInfo} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Prénom</label>
                <input
                  required
                  type="text"
                  value={formData.firstName}
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Jean"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Nom</label>
                <input
                  required
                  type="text"
                  value={formData.lastName}
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Dupont"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Matricule Étudiant</label>
              <input
                required
                type="text"
                value={formData.studentId}
                onChange={e => setFormData({...formData, studentId: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ex: 2024-STU-001"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Email Institutionnel</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="jean.dupont@universite.edu"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Mot de passe</label>
              <input
                required
                type="password"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            
            <div className="pt-4 flex items-center gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-[2] px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                Continuer
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6 text-center">
            {capturedFace ? (
              <div className="space-y-6">
                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-blue-500 shadow-xl">
                  <img src={capturedFace} alt="Face captured" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                     <CheckCircle2 className="w-12 h-12 text-blue-600" />
                  </div>
                </div>
                <p className="text-gray-600">Votre profil biométrique a été généré avec succès.</p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={completeRegistration}
                    className="w-full px-6 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg"
                  >
                    Terminer l'inscription
                  </button>
                  <button
                    onClick={() => setCapturedFace(null)}
                    className="text-sm text-gray-500 hover:text-blue-600 font-medium"
                  >
                    Reprendre la photo
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 text-blue-700 rounded-xl text-sm flex items-start gap-3 text-left">
                  <CameraIcon className="w-5 h-5 shrink-0" />
                  <p>Regardez l'objectif, évitez les lunettes de soleil ou les masques, et assurez-vous que votre visage est bien éclairé.</p>
                </div>
                <Camera onCapture={handleFaceCapture} />
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-gray-500 hover:text-blue-600 font-medium"
                >
                  Retour aux informations
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
