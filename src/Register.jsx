import React, { useState } from 'react';
import FondoApp from './assets/FondoApp.png';
import { toast } from 'react-hot-toast';
import { auth, db } from './firebase'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; 

const Register = ({ onBack }) => {
  // Estado para capturar los datos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: ''
  });

  // Manejador de cambios en los inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 2. Función de registro adaptada para Firebase
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Intentando registrar en Firebase a:", formData.email);

    try {
      // Paso A: Crear el usuario en el sistema de Autenticación de Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;

      // Paso B: Guardar los datos extra (Nombre y Teléfono) en Firestore Database usando el UID único
      await setDoc(doc(db, "users", user.uid), {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        createdAt: new Date()
      });

      toast.success("!Usuario creado con exito")
      onBack(); // Te regresa automáticamente al Login
      
    } catch (error) {
      console.error("Error detectado en el proceso:", error.code);
      
      // Control de errores comunes de Firebase
      if (error.code === 'auth/email-already-in-use') {
        alert("❌ Este correo electrónico ya está registrado.");
      } else if (error.code === 'auth/weak-password') {
        alert("❌ La contraseña debe tener mínimo 6 caracteres.");
      } else if (error.code === 'auth/invalid-email') {
        alert("❌ El formato del correo electrónico no es válido.");
      } else {
        alert("❌ Error: " + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans overflow-hidden">
      
      {/* --- COLUMNA IZQUIERDA: Visual Insight --- */}
      <div 
        className="hidden lg:flex lg:w-3/5 bg-cover bg-center relative items-center justify-center p-20 overflow-hidden"
        style={{ backgroundImage: `url(${FondoApp})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-teal-900/95 to-teal-800/90"></div>
        <div className="absolute w-[700px] h-[700px] border border-teal-500/10 rounded-full animate-ping duration-[5000ms]"></div>
        <div className="absolute w-[450px] h-[450px] border border-teal-400/20 rounded-full animate-pulse"></div>

        <div className="relative z-10 w-full max-w-2xl">
          <div className="inline-block px-4 py-1.5 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 rounded-full mb-8">
            <span className="text-emerald-300 text-[10px] font-black uppercase tracking-[0.4em]">Inicia tu Expansión</span>
          </div>
          
          <h1 className="text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9] mb-12">
            ÚNETE A LA<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300 text-8xl">RED ELITE</span>
          </h1>

          <div className="relative animate-in fade-in zoom-in duration-1000 delay-300">
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-[3rem] w-80 shadow-2xl transform -rotate-3 hover:rotate-0 transition-all duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 bg-rose-500 rounded-full animate-ping"></div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Zona de Alta Demanda</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={i} 
                    className="h-8 rounded-lg animate-pulse" 
                    style={{ 
                      backgroundColor: i % 3 === 0 ? '#14b8a6' : i % 2 === 0 ? '#0f766e' : '#134e4a',
                      opacity: Math.random() * 0.7 + 0.3 
                    }}
                  ></div>
                ))}
              </div>
              <p className="text-teal-200 text-[9px] mt-6 font-bold uppercase tracking-tighter italic">Analizando flujos comerciales en tiempo real...</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- COLUMNA DERECHA: Formulario --- */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 md:p-12 bg-white relative overflow-y-auto">
        <div className="w-full max-w-sm space-y-10 py-10">
          
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Registro.</h2>
            <p className="text-slate-400 font-medium">Crea tu cuenta corporativa y empieza a predecir.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              {/* Input Nombre */}
              <div className="group space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-teal-600">Nombre Completo</label>
                <input 
                  type="text" 
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Juan Pérez" 
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[12px] font-bold text-slate-800 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all" 
                  required 
                />
              </div>

              {/* Input Email */}
              <div className="group space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-teal-600">Correo electronico</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="juan@empresa.com" 
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[12px] font-bold text-slate-800 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all" 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Input Teléfono */}
                <div className="group space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-teal-600">Teléfono</label>
                  <input 
                    type="tel" 
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="33..." 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[12px] font-bold text-slate-800 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all" 
                    required 
                  />
                </div>
                {/* Input Password */}
                <div className="group space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-teal-600">Password</label>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••" 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[12px] font-bold text-slate-800 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all" 
                    required 
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-5 bg-teal-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] hover:bg-slate-900 shadow-xl shadow-teal-500/20 active:scale-95 transition-all mt-4">
              CREAR CUENTA AHORA
            </button>
          </form>

          <div className="pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">¿Ya tienes acceso?</p>
            <button 
              onClick={onBack} 
              className="w-full py-4 border-2 border-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all"
            >
              ← Iniciar Sesión con mi cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;