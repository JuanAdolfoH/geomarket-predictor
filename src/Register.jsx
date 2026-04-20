import React from 'react';
import FondoApp from './assets/FondoApp.png';

const Register = ({ onBack, onRegisterSuccess }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center font-sans p-4" style={{ backgroundImage: `url(${FondoApp})` }}>
      <div className="bg-white/90 backdrop-blur-2xl p-10 md:p-12 rounded-[3.5rem] shadow-2xl w-full max-w-md border border-white text-center animate-in fade-in zoom-in duration-500">
        
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">
            NUEVO <span className="text-teal-600">USUARIO</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-3">
            CREA TU CUENTA GRATIS
          </p>
        </div>

        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); onRegisterSuccess(); }}>
          <input 
            type="text" 
            placeholder="NOMBRE COMPLETO" 
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-teal-500/10 transition-all" 
            required 
          />
          <input 
            type="email" 
            placeholder="EMAIL" 
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-teal-500/10 transition-all" 
            required 
          />
          <input 
            type="tel" 
            placeholder="TELÉFONO" 
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-teal-500/10 transition-all" 
            required 
          />
          <input 
            type="password" 
            placeholder="PASSWORD" 
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-teal-500/10 transition-all" 
            required 
          />

          <button className="w-full py-5 bg-teal-600 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl active:scale-95 mt-4">
            REGISTRARME AHORA
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <button 
            onClick={onBack} 
            className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
          >
            ← YA TENGO CUENTA, VOLVER
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;