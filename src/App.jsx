import React, { useState, useEffect, useRef } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Radar as RadarRecharts, Tooltip } from 'recharts';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import FondoApp from './assets/FondoApp.png';

import Login from './Login';
import Register from './Register';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const datosJalisco = {
  "GUADALAJARA": ["Colonia Americana", "Santa Tere", "Providencia", "Centro", "Ladrón de Guevara", "Oblatos", "Huentitán", "Chapalita", "Monraz", "Arcos Vallarta"],
  "ZAPOPAN": ["Puerta de Hierro", "Real de Valdepeñas", "Ciudad del Sol", "Tabachines", "Bugambilias", "Arcos de Zapopan", "Valle Real", "La Estancia"],
  "TLAQUEPAQUE": ["Centro Histórico", "Alamo Industrial", "Lomas de Tlaquepaque", "Tlaquepaque Park", "Miravalle", "Cerro del Cuatro"],
  "TONALÁ": ["Loma Dorada", "Centro", "Colinas de Tonalá", "Ciudad Aztlán", "Jauja", "Santa Cruz de las Huertas"],
  "TLAJOMULCO": ["Santa Fe", "San Agustín", "La Rioja", "El Punto", "Solares", "San Sebastián"],
  "PUERTO VALLARTA": ["Marina Vallarta", "Olas Altas", "Conchas Chinas", "Versalles", "Pitillal", "Zona Romántica"]
};

const opcionesGiros = {
  "GASTRONOMÍA": ["Restaurante", "Sushi & Teriyaki", "Taquería", "Pizzería", "Cafetería", "Cocina Económica", "Snacks y Alitas", "Food Truck"],
  "COMERCIO MINORISTA": ["Abarrotes", "Boutique", "Zapatería", "Ferretería", "Farmacia", "Papelería", "Electrónica"],
  "SERVICIOS": ["Consultorio Médico", "Despacho Jurídico", "Agencia Marketing", "Veterinaria", "Gimnasio", "Estética"]
};

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [view, setView] = useState('app'); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('variables');
  const [municipio, setMunicipio] = useState("GUADALAJARA");
  const [colonia, setColonia] = useState("Colonia Americana");
  const [giro, setGiro] = useState("GASTRONOMÍA");
  const [subGiro, setSubGiro] = useState("Restaurante");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [poblacion, setPoblacion] = useState(85000);
  const [saturacion, setSaturacion] = useState(40);
  const [movilidad, setMovilidad] = useState(85);
  const [presupuesto, setPresupuesto] = useState("Medio");
  const [target, setTarget] = useState("Media Alta");
  const [agresividad, setAgresividad] = useState("Normal");
  const [horario, setHorario] = useState("Vespertino");

  const [momentum, setMomentum] = useState(75); 
  const [insatisfaccion, setInsatisfaccion] = useState(65); 
  const [estiloConsumo, setEstiloConsumo] = useState("Aspiracional");

  const reportRef = useRef();

  useEffect(() => { if (datosJalisco[municipio]) setColonia(datosJalisco[municipio]); }, [municipio]);
  useEffect(() => { if (opcionesGiros[giro]) setSubGiro(opcionesGiros[giro]); }, [giro]);

  const ISO_VAL = 77.5; 

  const handleAudit = () => {
    setIsAnalyzing(true);
    setActiveTab('mapa'); 
    setTimeout(() => setIsAnalyzing(false), 2500);
  };

  const descargarReporte = async () => {
    if (!isLoggedIn) { setView('login'); return; }
    const element = reportRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Reporte_ISO_${colonia}.pdf`);
  };

  const radarData = [
    { subject: 'Población', A: (poblacion / 200000) * 100 },
    { subject: 'Saturación', A: 100 - saturacion },
    { subject: 'Movilidad', A: movilidad },
    { subject: 'Digital', A: momentum }, 
    { subject: 'ISO', A: ISO_VAL },
  ];

  if (view === 'login') return <Login onLogin={() => { setIsLoggedIn(true); setView('app'); }} onBack={() => setView('app')} onGoToRegister={() => setView('register')} />;
  if (view === 'register') return <Register onBack={() => setView('login')} onRegisterSuccess={() => { setIsLoggedIn(true); setView('app'); }} />;

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-10 font-sans bg-cover bg-fixed bg-center relative transition-all duration-500" style={{ backgroundImage: `url(${FondoApp})` }}>
      
      {/* Superposición Oscura Dinámica */}
      {darkMode && <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-[2px] z-0 pointer-events-none" />}

      {/* Header Adaptativo */}
      <header className={`relative z-10 w-full max-w-7xl ${darkMode ? 'bg-slate-900/90 border-slate-700 shadow-black/40' : 'bg-white/90 border-white/50 shadow-2xl'} backdrop-blur-md p-6 rounded-[2.5rem] flex justify-between items-center mb-8 border transition-all duration-500`}>
        <div className="flex flex-col">
          <h1 className={`text-2xl font-black tracking-tighter uppercase italic leading-none ${darkMode ? 'text-white' : 'text-slate-800'}`}>
            GEOMARKET <span className="text-teal-600">PREDICTOR</span>
          </h1>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1.5 ml-0.5">Inteligencia Geográfica Prescriptiva</p>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${darkMode ? 'bg-slate-800 border-slate-600 text-yellow-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`}
          >
            <span className="text-xs">{darkMode ? '🌙' : '☀️'}</span>
            <span className="text-[9px] font-black uppercase tracking-widest">{darkMode ? 'Oscuro' : 'Claro'}</span>
          </button>

          {!isLoggedIn ? (
            <button onClick={() => setView('login')} className="text-[11px] font-black text-slate-500 uppercase tracking-widest hover:text-teal-600 transition-colors">Acceso Clientes</button>
          ) : (
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-black text-teal-600 bg-teal-50 px-3 py-1 rounded-full uppercase tracking-widest">Premium</span>
               <button onClick={descargarReporte} className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest transition-all ${darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}>PDF</button>
               <button onClick={() => setIsLoggedIn(false)} className="text-[10px] font-black text-rose-400 uppercase tracking-widest hover:text-rose-600 transition-colors">Salir</button>
            </div>
          )}
          <div className="bg-teal-500 text-white px-8 py-3 rounded-2xl font-black text-xl shadow-[0_10px_20px_rgba(20,184,166,0.3)]">
            ISO: {ISO_VAL}%
          </div>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start animate-in fade-in duration-500">
        
        {/* ASIDE Adaptativo */}
        <aside className={`backdrop-blur-md p-8 rounded-[3.5rem] shadow-2xl border space-y-8 overflow-hidden relative transition-all duration-500 ${darkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-white'}`}>
          <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl ${darkMode ? 'bg-teal-500/5' : 'bg-teal-500/10'}`}></div>
          <div className={`absolute -bottom-24 -left-24 w-48 h-48 rounded-full blur-3xl ${darkMode ? 'bg-indigo-500/5' : 'bg-indigo-500/10'}`}></div>

          <section className="space-y-4 relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className={`p-1.5 rounded-lg text-[10px] ${darkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-600'}`}>📍</span>
              <h2 className={`text-[11px] font-black uppercase tracking-widest italic ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Selección de zona</h2>
            </div>
            <div className={`space-y-3 p-4 rounded-[2rem] border ${darkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-indigo-50/30 border-indigo-100/50'}`}>
              <SelectBox label="Municipio" value={municipio} onChange={setMunicipio} options={Object.keys(datosJalisco)} darkMode={darkMode} />
              <SelectBox label="Colonia" value={colonia} onChange={setColonia} options={datosJalisco[municipio] || []} darkMode={darkMode} />
              <SelectBox label="Giro" value={giro} onChange={setGiro} options={Object.keys(opcionesGiros)} darkMode={darkMode} />
              <SelectBox label="Subgiro" value={subGiro} onChange={setSubGiro} options={opcionesGiros[giro] || []} darkMode={darkMode} />
            </div>
          </section>

          <section className={`space-y-4 pt-4 border-t relative z-10 ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`p-1.5 rounded-lg text-[10px] ${darkMode ? 'bg-teal-900/50 text-teal-300' : 'bg-teal-100 text-teal-600'}`}>⚙️</span>
              <h2 className={`text-[11px] font-black uppercase tracking-widest italic ${darkMode ? 'text-teal-400' : 'text-teal-600'}`}>Estrategia de negocio</h2>
            </div>
            <div className={`space-y-4 p-4 rounded-[2rem] border ${darkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-teal-50/30 border-teal-100/50'}`}>
              <SelectBox label="Presupuesto" value={presupuesto} onChange={setPresupuesto} options={["Bajo", "Medio", "Alto", "Franquicia"]} darkMode={darkMode} />
              <SelectBox label="Target" value={target} onChange={setTarget} options={["Popular", "Media", "Media Alta", "Lujo"]} darkMode={darkMode} />

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-3 tracking-widest">Agresividad Local</label>
                <div className={`flex gap-2 p-1.5 rounded-2xl border shadow-sm ${darkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white/50 border-teal-100'}`}>
                  {['Baja', 'Normal', 'Alta'].map((lvl) => (
                    <button key={lvl} type="button" onClick={() => setAgresividad(lvl)} className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${agresividad === lvl ? 'bg-teal-500 text-white shadow-md' : darkMode ? 'text-slate-500 hover:bg-slate-800' : 'text-slate-400 hover:bg-teal-50'}`}>
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-3 tracking-widest">Horarios Operativos</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Matutino', 'Vespertino', 'Nocturno', '24 Horas'].map((turno) => (
                    <div key={turno} onClick={() => setHorario(turno)} className={`flex items-center gap-2 p-2 rounded-xl border transition-all cursor-pointer ${horario === turno ? 'bg-teal-100 border-teal-400 scale-[1.02]' : darkMode ? 'bg-slate-900/50 border-slate-700 hover:border-teal-900' : 'bg-white/50 border-slate-100 hover:border-teal-200'}`}>
                      <div className={`w-2 h-2 rounded-full ${horario === turno ? 'bg-teal-500 animate-ping' : 'bg-slate-600'}`}></div>
                      <span className={`text-[8px] font-bold uppercase ${horario === turno ? (darkMode ? 'text-teal-400' : 'text-teal-700') : 'text-slate-500'}`}>{turno}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <button onClick={handleAudit} disabled={isAnalyzing} className={`w-full py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-widest transition-all active:scale-95 shadow-xl ${darkMode ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-900/20' : 'bg-slate-900 hover:bg-teal-600 text-white shadow-slate-300'}`}>
            {isAnalyzing ? "PROCESANDO CAPAS..." : "EJECUTAR AUDITORÍA"}
          </button>
        </aside>

        {/* MAIN Adaptativo */}
        <main className={`backdrop-blur-md p-4 rounded-[4rem] shadow-2xl border min-h-[600px] flex flex-col overflow-hidden transition-all duration-500 ${darkMode ? 'bg-slate-900/95 border-slate-800 shadow-black/40' : 'bg-white/95 border-white'}`}>
          <nav className={`flex gap-2 p-2 rounded-full mb-6 mx-4 mt-2 border flex-shrink-0 ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-100/50 border-slate-200/50'}`}>
            {['variables', 'mapa', 'comparativa', 'competencia'].map((t) => (
              <button key={t} onClick={() => setActiveTab(t)} className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase transition-all ${activeTab === t ? "bg-teal-500 text-white shadow-lg shadow-teal-500/30 scale-[1.02]" : darkMode ? "text-slate-500 hover:text-slate-300" : "text-slate-400"}`}>
                {t}
              </button>
            ))}
          </nav>

          <div className="flex-1 px-8 pb-8 overflow-y-auto">
            {activeTab === 'variables' && (
              <div className="py-6 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 px-4">
                  <Slider label="Población Objetivo (X1)" value={poblacion} setValue={setPoblacion} max={200000} darkMode={darkMode} />
                  <Slider label="Momentum Digital (X5)" value={momentum} setValue={setMomentum} max={100} unit="%" darkMode={darkMode} />
                  <Slider label="Saturación de Mercado (X3)" value={saturacion} setValue={setSaturacion} max={100} unit="%" darkMode={darkMode} />
                  <Slider label="Insatisfacción Cliente (X4)" value={insatisfaccion} setValue={setInsatisfaccion} max={100} unit="%" darkMode={darkMode} />
                </div>

                <div className={`h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent w-full my-8 ${darkMode ? 'opacity-10' : ''}`} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`p-6 rounded-[2.5rem] border flex flex-col justify-between transition-colors ${darkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50/50 border-white'}`}>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vida Útil</span>
                      <span className={`text-xs font-black uppercase italic ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>18 Meses Est.</span>
                    </div>
                    <div className={`h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-slate-900' : 'bg-slate-200'}`}>
                      <div className="h-full bg-indigo-500 w-[70%] animate-pulse" />
                    </div>
                  </div>

                  <div className={`p-6 rounded-[2.5rem] border flex flex-col justify-between transition-colors ${darkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50/50 border-white'}`}>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Factor Aspiracional</span>
                      <span className={`text-xs font-black uppercase italic ${darkMode ? 'text-teal-400' : 'text-teal-600'}`}>Alto</span>
                    </div>
                    <div className="flex gap-1 h-1.5">
                      {[1, 2, 3, 4, 5].map((b) => (
                        <div key={b} className={`flex-1 rounded-full ${b <= 4 ? 'bg-teal-500' : (darkMode ? 'bg-slate-900' : 'bg-slate-200')}`} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center pt-6 opacity-40 hover:opacity-100 transition-opacity">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Regresión Múltiple Adaptativa</p>
                  <p className={`text-[11px] font-mono italic ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    Y = β₀ + β₁X₁ + β₂X₂ - β₃X₃ + β₄(1/X₄) + β₅X₅ + β₆X₆ + ε
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'mapa' && (
              <div className="animate-in fade-in duration-700 space-y-6">
                <div className={`h-[380px] w-full rounded-[3.5rem] overflow-hidden border-[8px] relative group transition-colors ${darkMode ? 'border-slate-800 shadow-inner' : 'border-slate-50 shadow-inner'}`}>
                  {isAnalyzing && <div className="scanner-line"></div>}
                  <MapContainer center={[20.674, -103.361]} zoom={13} style={{ height: "100%", width: "100%", zIndex: 1 }}>
                    <TileLayer url={darkMode ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"} />
                    <CircleMarker center={[20.674, -103.361]} radius={14} pathOptions={{fillColor: '#14b8a6', color: 'white', weight: 4, fillOpacity: 0.9}} />
                  </MapContainer>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <AnalisisCard title="Sensata (Local)" value="Mover 250m" sub="Optimización Zona" color="indigo" darkMode={darkMode} />
                  <AnalisisCard title="Fantasiosa (Nacional)" value="Mazatlán, SIN" sub="Océano Azul Detectado" color="orange" darkMode={darkMode} />
                  <div className={`p-6 rounded-[2.5rem] border flex flex-col justify-center transition-colors ${darkMode ? 'bg-teal-900/40 border-teal-800' : 'bg-teal-900 border-teal-800 shadow-teal-900/20 shadow-lg'}`}>
                    <p className="text-[9px] font-black text-teal-400 uppercase mb-1">Estilo de Vida</p>
                    <span className="text-xl font-black text-white uppercase italic">Consumo {estiloConsumo}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'competencia' && (
              <div className="space-y-6 py-4">
                <div className={`p-6 rounded-[2.5rem] border transition-colors ${darkMode ? 'bg-amber-900/20 border-amber-900/50' : 'bg-amber-50 border-amber-100'}`}>
                   <p className="text-[11px] font-black text-amber-600 uppercase tracking-widest mb-2">Capa de Reputación Digital (X4)</p>
                   <p className={`text-xs font-bold italic ${darkMode ? 'text-amber-200/80' : 'text-amber-800'}`}>"Falta de métodos de pago digitales y estacionamiento limitado."</p>
                </div>
                <div className="grid gap-4">
                  {["Competidor Local A", "Rival de Zona B", "Establecimiento C"].map((item, i) => (
                    <div key={i} className={`flex justify-between items-center p-6 rounded-[2.5rem] border transition-colors ${darkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-white shadow-sm'}`}>
                      <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black border ${darkMode ? 'bg-slate-900 border-slate-700 text-teal-400' : 'bg-white border-slate-100 text-teal-600 shadow-sm'}`}>{i + 1}</div>
                        <p className={`font-black text-sm uppercase ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>{item}</p>
                      </div>
                      <span className="text-[10px] font-black text-rose-500 uppercase">Debilidad</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'comparativa' && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-center py-4">
                <div className={`h-[400px] w-full rounded-[3rem] border p-4 transition-colors ${darkMode ? 'bg-slate-800/20 border-slate-700' : 'bg-slate-50/30 border-slate-100'}`}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke={darkMode ? "#334155" : "#e2e8f0"} />
                      <PolarAngleAxis dataKey="subject" tick={{fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 11, fontWeight: 900}} />
                      <RadarRecharts name="Métricas" dataKey="A" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.4} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex flex-col gap-3">
                    <div className="grid gap-3">
                        <MetricaInfo label="Población (X1)" desc="Residentes + Turistas/Flotantes." color="bg-blue-500" darkMode={darkMode} />
                        <MetricaInfo label="Momentum (X5)" desc="Crecimiento en redes sociales." color="bg-pink-500" darkMode={darkMode} />
                        <MetricaInfo label="Saturación (X3)" desc="Cantidad de negocios similares." color="bg-amber-500" darkMode={darkMode} />
                        <MetricaInfo label="ISO (Y)" desc="Índice de Supervivencia y Oportunidad." color="bg-teal-500" darkMode={darkMode} />
                    </div>

                    <div className={`mt-4 p-6 rounded-[2.5rem] border shadow-sm transition-all duration-500 ${darkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white/60 border-white'}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-teal-500 text-white rounded-xl shadow-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <h2 className={`text-[10px] font-black uppercase tracking-widest italic leading-none ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>Estrategia Prescriptiva</h2>
                      </div>

                      <p className={`text-[11px] leading-relaxed italic relative z-10 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Basado en el índice <span className="font-bold text-teal-500">ISO del {ISO_VAL}%</span>, el negocio en <span className={darkMode ? 'text-white' : 'text-slate-900'}>{colonia}</span> presenta una viabilidad robusta. 
                        Se recomienda priorizar digitalización.
                      </p>
                    </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <ReporteEstructurado 
        ref={reportRef} municipio={municipio} colonia={colonia} giro={giro} subGiro={subGiro} 
        poblacion={poblacion} momentum={momentum} saturacion={saturacion} insatisfaccion={insatisfaccion} 
        ISO_VAL={ISO_VAL} estiloConsumo={estiloConsumo} 
      />
    </div>
  );
}

// COMPONENTES AUXILIARES ACTUALIZADOS
function AnalisisCard({ title, value, sub, color, darkMode }) {
  const styles = {
    indigo: darkMode ? 'bg-indigo-900/20 border-indigo-900/50' : 'bg-indigo-50 border-indigo-100',
    orange: darkMode ? 'bg-orange-900/20 border-orange-900/50' : 'bg-orange-50 border-orange-100',
    default: darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-white'
  };
  return (
    <div className={`p-6 rounded-[2.5rem] border shadow-sm flex flex-col justify-center transition-colors ${styles[color] || styles.default}`}>
      <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{title}</p>
      <span className={`text-xl font-black leading-tight uppercase ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{value}</span>
      <span className={`text-[10px] font-black uppercase ${color === 'indigo' ? 'text-indigo-400' : color === 'orange' ? 'text-orange-400' : 'text-teal-600'}`}>{sub}</span>
    </div>
  );
}

function SelectBox({ label, value, onChange, options, darkMode }) {
  return (
    <div className="space-y-1.5 group">
      <label className="text-[9px] font-black text-slate-400 uppercase ml-3 tracking-widest">{label}</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className={`w-full p-4 border rounded-[1.5rem] font-bold text-[11px] outline-none transition-all cursor-pointer shadow-sm appearance-none ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-300 focus:ring-teal-500/20' : 'bg-white border-slate-100 text-slate-700 focus:ring-teal-500/10'}`}
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function Slider({ label, value, setValue, max, unit = "", darkMode }) {
  return (
    <div className="group space-y-6">
      <div className="flex justify-between items-end px-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</label>
        <span className={`text-2xl font-black tracking-tighter leading-none ${darkMode ? 'text-white' : 'text-slate-800'}`}>
          {value.toLocaleString()}<small className="text-[10px] text-teal-500 ml-1">{unit}</small>
        </span>
      </div>
      <div className="relative h-6 flex items-center">
        <div className={`absolute w-full h-1.5 rounded-full ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`} />
        <div className="absolute h-1.5 bg-teal-500 rounded-full transition-all" style={{ width: `${(value / max) * 100}%` }} />
        <input type="range" min="0" max={max} value={value} onChange={(e) => setValue(Number(e.target.value))} className="absolute w-full appearance-none bg-transparent cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[5px] [&::-webkit-slider-thumb]:border-teal-500" />
      </div>
    </div>
  );
}

function MetricaInfo({ label, desc, color, darkMode }) {
  return (
    <div className={`p-4 rounded-2xl border transition-all ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
      <div className="flex items-center gap-3 mb-1">
        <div className={`w-2 h-2 rounded-full ${color}`}></div>
        <span className={`text-[10px] font-black uppercase tracking-tighter ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{label}</span>
      </div>
      <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}

// PDF (Se mantiene igual ya que es una impresión estática en blanco)
const ReporteEstructurado = React.forwardRef(({ municipio, colonia, giro, subGiro, poblacion, momentum, saturacion, insatisfaccion, ISO_VAL, estiloConsumo }, ref) => {
  return (
    <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
      <div ref={ref} style={{ width: '210mm', minHeight: '297mm', padding: '2cm', backgroundColor: 'white', color: '#1e293b', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #f1f5f9', paddingBottom: '20px', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '900', color: '#0d9488', margin: 0 }}>GEOMARKET PREDICTOR</h1>
            <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold', marginTop: '5px', letterSpacing: '2px' }}>INTELIGENCIA GEOGRÁFICA PRESCRIPTIVA</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '10px', fontWeight: '900', margin: 0 }}>REPORTE ESTRATÉGICO</p>
            <p style={{ fontSize: '9px', color: '#64748b' }}>{colonia}, {municipio}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center', marginBottom: '40px' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '8px solid #14b8a6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '28px', fontWeight: '900' }}>{ISO_VAL}%</span>
            </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '10px' }}>Diagnóstico de Viabilidad</h2>
            <p style={{ fontSize: '11px', lineHeight: '1.6', color: '#475569' }}>Análisis para <strong>{subGiro}</strong> en <strong>{colonia}</strong>.</p>
          </div>
        </div>
      </div>
    </div>
  );
});