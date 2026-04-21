import React from 'react';
import FondoApp from './assets/FondoApp.png';

const Login = ({ onLogin, onBack, onGoToRegister }) => {
  return (
    <div className="min-h-screen w-full flex bg-white font-sans overflow-hidden">
      
      {/* --- COLUMNA IZQUIERDA: Data Analytics Experience --- */}
      <div 
        className="hidden lg:flex lg:w-3/5 bg-cover bg-center relative items-center justify-center p-20 overflow-hidden"
        style={{ backgroundImage: `url(${FondoApp})` }}
      >
        {/* Overlay con gradiente profundo */}
        <div className="absolute inset-0 bg-gradient-to-tr from-teal-900 via-teal-800/95 to-slate-900/90"></div>
        
        {/* ELEMENTOS GRÁFICOS CREATIVOS */}
        <div className="relative z-10 w-full max-w-2xl">
          
          {/* Badge de Versión */}
          <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="text-teal-300 text-[10px] font-black uppercase tracking-[0.4em]">Engine v3.2 Active</span>
          </div>
          
          <h1 className="text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9] mb-12">
            GEOMARKET<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-200">PREDICTOR</span>
          </h1>

          {/* CONTENEDOR DE GRÁFICAS DE REFERENCIA */}
          <div className="relative flex gap-6 mt-12 animate-in fade-in slide-in-from-left-8 duration-1000 delay-300">
            
            {/* Card de Gráfica de Barras (Simulada) */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[2.5rem] w-64 shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-bold text-teal-300 uppercase tracking-widest">Competencia</span>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-teal-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-teal-400/50 rounded-full"></div>
                </div>
              </div>
              <div className="flex items-end gap-3 h-24">
                <div className="bg-teal-500/40 w-full rounded-t-lg" style={{ height: '40%' }}></div>
                <div className="bg-teal-500 w-full rounded-t-lg" style={{ height: '80%' }}></div>
                <div className="bg-teal-400 w-full rounded-t-lg" style={{ height: '60%' }}></div>
                <div className="bg-emerald-400 w-full rounded-t-lg" style={{ height: '95%' }}></div>
              </div>
              <p className="text-white/40 text-[8px] mt-4 font-medium uppercase text-center tracking-tighter">Análisis de saturación por zona</p>
            </div>

            {/* Card de Métrica ISO */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-[2.5rem] w-48 shadow-2xl mt-12 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="text-teal-400 text-3xl font-black mb-1">92.4<small className="text-sm">%</small></div>
              <div className="text-white/70 text-[9px] font-black uppercase tracking-widest leading-tight">Índice de Viabilidad</div>
              <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 w-[92%]"></div>
              </div>
            </div>

          </div>
        </div>

        {/* Efecto decorativo de Radar */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-teal-500/10 rounded-full animate-pulse"></div>
      </div>

      {/* --- COLUMNA DERECHA: Interface --- */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 md:p-16 bg-white relative">
        
        <div className="w-full max-w-sm space-y-12">
          <div className="space-y-2">
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Bienvenido.</h2>
            <p className="text-slate-400 font-medium">Inicia sesión para acceder a tus reportes territoriales.</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Credencial de Acceso</label>
              <input 
                type="email" 
                placeholder="usuario@empresa.com" 
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-[12px] font-bold text-slate-800 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all" 
                required 
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Clave Secreta</label>
              <input 
                type="password" 
                placeholder="••••••••••••" 
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-[12px] font-bold text-slate-800 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all" 
                required 
              />
            </div>

            <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] hover:bg-teal-600 shadow-xl active:scale-95 transition-all">
              DESBLOQUEAR PANEL
            </button>
          </form>

          <div className="pt-8 border-t border-slate-100 space-y-4">
            <button 
              type="button"
              onClick={onGoToRegister}
              className="w-full py-4 bg-teal-50 text-teal-700 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-teal-600 hover:text-white transition-all active:scale-95"
            >
              SOLICITAR ACCESO NUEVO
            </button>
            <button 
              onClick={onBack} 
              className="w-full text-center text-[10px] font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
            >
              ← SALIR AL VISOR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;