import React from 'react';
import FondoApp from './assets/FondoApp.png';

const Login = ({ onLogin, onBack, onGoToRegister }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center font-sans p-4" style={{ backgroundImage: `url(${FondoApp})` }}>
      {/* Reduje el padding de p-16 a p-10 para que la tarjeta no sea tan alta */}
      <div className="bg-white/95 backdrop-blur-2xl p-8 md:p-10 rounded-[3rem] shadow-2xl w-full max-w-md border border-white text-center animate-in zoom-in-95 duration-300">
        
        <div className="mb-6">
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">
            GEOMARKET <span className="text-teal-600">PREDICTOR</span>
          </h1>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">
            ACCESO A LA PLATAFORMA
          </p>
        </div>

        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
          <input 
            type="email" 
            placeholder="EMAIL" 
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-teal-500/10 transition-all" 
            required 
          />
          <input 
            type="password" 
            placeholder="PASSWORD" 
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-teal-500/10 transition-all" 
            required 
          />
          
          <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-[1.2rem] font-black text-[11px] uppercase tracking-widest hover:bg-teal-600 transition-all shadow-xl active:scale-95 mt-2">
            ENTRAR AL PANEL
          </button>
        </form>

        {/* --- SECCIÓN DE REGISTRO: Subida y con el color Teal --- */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <button 
            type="button"
            onClick={onGoToRegister}
            className="w-full py-4 bg-white border-2 border-teal-600 text-teal-600 rounded-[1.2rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-teal-600 hover:text-white transition-all active:scale-95 shadow-sm mb-4"
          >
            ¿NUEVO? REGÍSTRATE AQUÍ
          </button>

          <button 
            onClick={onBack} 
            className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
          >
            ← VOLVER AL MAPA PRINCIPAL
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;