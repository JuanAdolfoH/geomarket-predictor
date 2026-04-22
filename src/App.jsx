import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Radar as RadarRecharts, Tooltip } from 'recharts';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import FondoApp from './assets/FondoApp.png';

import Login from './Login';
import Register from './Register';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

  // --- NUEVOS ESTADOS SEGÚN DOCUMENTO TÉCNICO ---
  const [momentum, setMomentum] = useState(75); // Capa Psicográfica (X5)
  const [insatisfaccion, setInsatisfaccion] = useState(65); // Capa Reputación (X4)
  const [estiloConsumo, setEstiloConsumo] = useState("Aspiracional"); // (Y)

  useEffect(() => { if (datosJalisco[municipio]) setColonia(datosJalisco[municipio]); }, [municipio]);
  useEffect(() => { if (opcionesGiros[giro]) setSubGiro(opcionesGiros[giro]); }, [giro]);

  const ISO_VAL = 77.5; // Índice de Supervivencia y Oportunidad [cite: 7]

  const handleAudit = () => {
    setIsAnalyzing(true);
    setActiveTab('mapa'); 
    setTimeout(() => setIsAnalyzing(false), 2500);
  };

  const descargarReporte = () => {
    if (!isLoggedIn) { setView('login'); return; }
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("GEOMARKET PREDICTOR", 105, 25, { align: "center" });
    doc.autoTable({
      startY: 60,
      head: [['MUNICIPIO', 'SUB-GIRO', 'CATEGORÍA', 'ZONA (COLONIA)']],
      body: [[municipio, subGiro, giro, colonia]],
      theme: 'grid',
      headStyles: { fillColor:2, halign: 'center' },
      styles: { fontSize: 9, halign: 'center' }
    });
    doc.save(`Reporte_ISO_${colonia}.pdf`);
  };

  const radarData = [
    { subject: 'Población', A: (poblacion / 200000) * 100 },
    { subject: 'Saturación', A: 100 - saturacion },
    { subject: 'Movilidad', A: movilidad },
    { subject: 'Digital', A: momentum }, // X5 Momentum Digital
    { subject: 'ISO', A: ISO_VAL },
  ];

  if (view === 'login') return <Login onLogin={() => { setIsLoggedIn(true); setView('app'); }} onBack={() => setView('app')} onGoToRegister={() => setView('register')} />;
  if (view === 'register') return <Register onBack={() => setView('login')} onRegisterSuccess={() => { setIsLoggedIn(true); setView('app'); }} />;

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-10 font-sans bg-cover bg-fixed bg-center" style={{ backgroundImage: `url(${FondoApp})` }}>
      
      <header className="w-full max-w-7xl bg-white/90 backdrop-blur-md p-6 rounded-[2.5rem] shadow-2xl flex justify-between items-center mb-8 border border-white/50">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">
            GEOMARKET <span className="text-teal-600">PREDICTOR</span>
          </h1>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1.5 ml-0.5">Inteligencia Geográfica Prescriptiva</p>
        </div>

        <div className="flex items-center gap-6">
          {!isLoggedIn ? (
            <button onClick={() => setView('login')} className="text-[11px] font-black text-slate-500 uppercase tracking-widest hover:text-teal-600 transition-colors">Acceso Clientes</button>
          ) : (
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-black text-teal-600 bg-teal-50 px-3 py-1 rounded-full uppercase tracking-widest">Premium</span>
               <button onClick={() => setIsLoggedIn(false)} className="text-[10px] font-black text-rose-400 uppercase tracking-widest hover:text-rose-600 transition-colors">Salir</button>
            </div>
          )}
          <div className="bg-teal-500 text-white px-8 py-3 rounded-2xl font-black text-xl shadow-[0_10px_20px_rgba(20,184,166,0.3)]">
            ISO: {ISO_VAL}%
          </div>
        </div>
      </header>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start animate-in fade-in duration-500">
        <aside className="bg-white/95 backdrop-blur-md p-8 rounded-[3.5rem] shadow-2xl border border-white space-y-8 overflow-hidden relative">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>

          <section className="space-y-4 relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-100 text-indigo-600 p-1.5 rounded-lg text-[10px]">📍</span>
              <h2 className="text-[11px] font-black uppercase text-indigo-600 tracking-widest italic">Selección de zona</h2>
            </div>
            <div className="space-y-3 p-4 bg-indigo-50/30 rounded-[2rem] border border-indigo-100/50">
              <SelectBox label="Municipio" value={municipio} onChange={setMunicipio} options={Object.keys(datosJalisco)} color="indigo" />
              <SelectBox label="Colonia" value={colonia} onChange={setColonia} options={datosJalisco[municipio] || []} color="indigo" />
              <SelectBox label="Giro" value={giro} onChange={setGiro} options={Object.keys(opcionesGiros)} color="indigo" />
              <SelectBox label="Subgiro" value={subGiro} onChange={setSubGiro} options={opcionesGiros[giro] || []} color="indigo" />
            </div>
          </section>

          <section className="space-y-4 pt-4 border-t border-slate-100 relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-teal-100 text-teal-600 p-1.5 rounded-lg text-[10px]">⚙️</span>
              <h2 className="text-[11px] font-black uppercase text-teal-600 tracking-widest italic">Estrategia de negocio</h2>
            </div>
            <div className="space-y-4 p-4 bg-teal-50/30 rounded-[2rem] border border-teal-100/50">
              <SelectBox label="Presupuesto" value={presupuesto} onChange={setPresupuesto} options={["Bajo", "Medio", "Alto", "Franquicia"]} color="teal" />
              <SelectBox label="Target" value={target} onChange={setTarget} options={["Popular", "Media", "Media Alta", "Lujo"]} color="teal" />

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-3 tracking-widest">Agresividad Local</label>
                <div className="flex gap-2 bg-white/50 p-1.5 rounded-2xl border border-teal-100 shadow-sm">
                  {['Baja', 'Normal', 'Alta'].map((lvl) => (
                    <button key={lvl} type="button" onClick={() => setAgresividad(lvl)} className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${agresividad === lvl ? 'bg-teal-500 text-white shadow-md' : 'text-slate-400 hover:bg-teal-50'}`}>
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-3 tracking-widest">Horarios Operativos</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Matutino', 'Vespertino', 'Nocturno', '24 Horas'].map((turno) => (
                    <div key={turno} onClick={() => setHorario(turno)} className={`flex items-center gap-2 p-2 rounded-xl border transition-all cursor-pointer ${horario === turno ? 'bg-teal-100 border-teal-400 scale-[1.02]' : 'bg-white/50 border-slate-100 hover:border-teal-200'}`}>
                      <div className={`w-2 h-2 rounded-full ${horario === turno ? 'bg-teal-500 animate-ping' : 'bg-slate-300'}`}></div>
                      <span className={`text-[8px] font-bold uppercase ${horario === turno ? 'text-teal-700' : 'text-slate-500'}`}>{turno}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="mt-6 p-[2px] bg-gradient-to-r from-teal-500 via-indigo-500 to-teal-500 rounded-[2rem] shadow-lg animate-gradient-x">
            <div className="bg-slate-900 p-4 rounded-[1.9rem] flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-teal-400 uppercase tracking-[0.2em]">Cálculo Prescriptivo</span>
                <span className="text-[11px] font-bold text-white uppercase italic">Análisis <span className="text-teal-400">DENUE/INEGI</span></span>
              </div>
              <div className="flex gap-1 items-end h-5">
                <div className="w-1.5 h-3 bg-teal-500 rounded-full animate-pulse"></div>
                <div className="w-1.5 h-5 bg-indigo-500 rounded-full"></div>
                <div className="w-1.5 h-4 bg-slate-700 rounded-full"></div>
              </div>
            </div>
          </div>

          <button onClick={handleAudit} disabled={isAnalyzing} className="w-full py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-widest bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:from-teal-600 hover:to-teal-500 shadow-xl active:scale-95 transition-all">
            {isAnalyzing ? "PROCESANDO CAPAS..." : "EJECUTAR AUDITORÍA"}
          </button>
        </aside>

        <main className="bg-white/95 backdrop-blur-md p-4 rounded-[4rem] shadow-2xl border border-white min-h-[600px] flex flex-col overflow-hidden">
          <nav className="flex gap-2 p-2 bg-slate-100/50 rounded-full mb-6 mx-4 mt-2 border border-slate-200/50 flex-shrink-0">
            {['variables', 'mapa', 'comparativa', 'competencia'].map((t) => (
              <button key={t} onClick={() => setActiveTab(t)} className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase transition-all ${activeTab === t ? "bg-teal-500 text-white shadow-lg shadow-teal-500/30 scale-[1.02]" : "text-slate-400"}`}>
                {t}
              </button>
            ))}
          </nav>

          <div className="flex-1 px-8 pb-8 overflow-y-auto">
            {activeTab === 'variables' && (
              <div className="space-y-12 py-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Slider label="Población (X1)" value={poblacion} setValue={setPoblacion} max={200000} />
                  <Slider label="Momentum Digital (X5)" value={momentum} setValue={setMomentum} max={100} unit="%" />
                  <Slider label="Saturación (X3)" value={saturacion} setValue={setSaturacion} max={100} unit="%" />
                  <Slider label="Insatisfacción (X4)" value={insatisfaccion} setValue={setInsatisfaccion} max={100} unit="%" />
                </div>
                <div className="p-6 bg-slate-900 rounded-[2.5rem] border border-slate-800">
                   <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-4">Ecuación de Regresión Múltiple</p>
                   <p className="text-white font-mono text-sm">Y = β₀ + β₁X₁ + β₂X₂ - β₃X₃ + β₄(1/X₄) + β₅X₅ + β₆X₆ + ε</p>
                </div>
              </div>
            )}

            {activeTab === 'mapa' && (
              <div className="animate-in fade-in duration-700 space-y-6">
                <div className="h-[380px] w-full rounded-[3.5rem] overflow-hidden border-[8px] border-slate-50 shadow-inner relative group">
                  {isAnalyzing && <div className="scanner-line"></div>}
                  <MapContainer center={[20.674, -103.361]} zoom={13} style={{ height: "100%", width: "100%", zIndex: 1 }}>
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                    <CircleMarker center={[20.674, -103.361]} radius={14} pathOptions={{fillColor: '#14b8a6', color: 'white', weight: 4, fillOpacity: 0.9}} />
                  </MapContainer>
                </div>
                
                {/* RECOMENDACIONES TRIPLE NIVEL [cite: 28] */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <AnalisisCard title="Sensata (Local)" value="Mover 250m" sub="Optimización Zona" color="indigo" />
                  <AnalisisCard title="Fantasiosa (Nacional)" value="Mazatlán, SIN" sub="Océano Azul Detectado" color="orange" />
                  <div className="bg-teal-900 p-6 rounded-[2.5rem] border border-teal-800 flex flex-col justify-center">
                    <p className="text-[9px] font-black text-teal-400 uppercase mb-1">Estilo de Vida</p>
                    <span className="text-xl font-black text-white uppercase italic">Consumo {estiloConsumo}</span>
                    <span className="text-[10px] text-teal-200/60 uppercase font-bold">Predicción (Y) [cite: 8, 9]</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'competencia' && (
              <div className="space-y-6 py-4 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2.5rem]">
                   <p className="text-[11px] font-black text-amber-600 uppercase tracking-widest mb-2">Capa de Reputación Digital (X4) [cite: 14]</p>
                   <p className="text-xs text-amber-800 font-bold italic">"Falta de métodos de pago digitales y estacionamiento limitado en el radio de 15 min."</p>
                </div>
                <div className="grid gap-4">
                  {["Competidor Local A", "Rival de Zona B", "Establecimiento C"].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-6 bg-slate-50 rounded-[2.5rem] border border-white shadow-sm">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-teal-600 shadow-sm border border-slate-100">{i + 1}</div>
                        <div><p className="font-black text-slate-800 text-sm uppercase">{item}</p></div>
                      </div>
                      <span className="text-[10px] font-black text-rose-500 uppercase">Debilidad detectada</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'comparativa' && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-center animate-in zoom-in-95 duration-500 py-4">
                <div className="h-[400px] w-full bg-slate-50/30 rounded-[3rem] border border-slate-100 p-4 shadow-inner">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{fill: '#64748b', fontSize: 11, fontWeight: 900}} />
                      <RadarRecharts name="Métricas" dataKey="A" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.4} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-800 uppercase italic tracking-widest mb-6 flex items-center gap-2">
                    <span className="w-8 h-1 bg-teal-500 rounded-full"></span> Interpretación de Métricas
                  </h3>
                  <div className="grid gap-3">
                    <MetricaInfo label="Población (X1)" desc="Residentes + Turistas/Flotantes en radio de influencia." color="bg-blue-500" />
                    <MetricaInfo label="Momentum (X5)" desc="Tasa de crecimiento en IG/TikTok/X en los últimos 30 días." color="bg-pink-500" />
                    <MetricaInfo label="Saturación (X3)" desc="Cantidad de negocios del mismo giro (DENUE)." color="bg-amber-500" />
                    <MetricaInfo label="ISO (Y)" desc="Índice de Supervivencia y Oportunidad final." color="bg-teal-500" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// COMPONENTES AUXILIARES SE MANTUVIERON IGUALES
function AnalisisCard({ title, value, sub, color }) {
  return (
    <div className={`p-6 rounded-[2.5rem] border shadow-sm flex flex-col justify-center ${color === 'indigo' ? 'bg-indigo-50 border-indigo-100' : color === 'orange' ? 'bg-orange-50 border-orange-100' : 'bg-slate-50 border-white'}`}>
      <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${color === 'indigo' ? 'text-indigo-400' : color === 'orange' ? 'text-orange-400' : 'text-slate-400'}`}>{title}</p>
      <span className="text-xl font-black text-slate-800 leading-tight uppercase">{value}</span>
      <span className={`text-[10px] font-black uppercase ${color === 'indigo' ? 'text-indigo-600' : color === 'orange' ? 'text-orange-600' : 'text-teal-600'}`}>{sub}</span>
    </div>
  );
}

function SelectBox({ label, value, onChange, options }) {
  return (
    <div className="space-y-1.5 group">
      <label className="text-[9px] font-black text-slate-400 uppercase ml-3 tracking-widest">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full p-4 bg-white border border-slate-100 rounded-[1.5rem] font-bold text-[11px] text-slate-700 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all cursor-pointer appearance-none shadow-sm">
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function Slider({ label, value, setValue, max, unit = "" }) {
  return (
    <div className="group space-y-6">
      <div className="flex justify-between items-end px-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</label>
        <span className="text-2xl font-black text-slate-800 tracking-tighter leading-none">{value.toLocaleString()}<small className="text-[10px] text-teal-500 ml-1">{unit}</small></span>
      </div>
      <div className="relative h-6 flex items-center">
        <div className="absolute w-full h-1.5 bg-slate-100 rounded-full" />
        <div className="absolute h-1.5 bg-teal-500 rounded-full transition-all" style={{ width: `${(value / max) * 100}%` }} />
        <input type="range" min="0" max={max} value={value} onChange={(e) => setValue(Number(e.target.value))} className="absolute w-full appearance-none bg-transparent cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[5px] [&::-webkit-slider-thumb]:border-teal-500" />
      </div>
    </div>
  );
}

function MetricaInfo({ label, desc, color }) {
  return (
    <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-center gap-3 mb-1">
        <div className={`w-2 h-2 rounded-full ${color} group-hover:scale-150 transition-transform`}></div>
        <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">{label}</span>
      </div>
      <p className="text-[10px] text-slate-500 leading-relaxed font-medium lowercase first-letter:uppercase">{desc}</p>
    </div>
  );
}