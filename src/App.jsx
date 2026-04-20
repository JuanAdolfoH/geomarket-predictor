import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Radar as RadarRecharts, Tooltip } from 'recharts';
import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import FondoApp from './assets/FondoApp.png';

// IMPORTAMOS LOS ARCHIVOS APARTE
import Login from './Login';
import Register from './Register';

// LIBRERÍAS PARA EL PDF
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// --- BASES DE DATOS ---
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
  // --- CONTROL DE NAVEGACIÓN ---
  // Ahora manejamos: 'app', 'login', 'register'
  const [view, setView] = useState('app'); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [activeTab, setActiveTab] = useState('variables');
  const [municipio, setMunicipio] = useState("GUADALAJARA");
  const [colonia, setColonia] = useState("Colonia Americana");
  const [giro, setGiro] = useState("GASTRONOMÍA");
  const [subGiro, setSubGiro] = useState("Restaurante");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Estados de Negocio
  const [poblacion, setPoblacion] = useState(85000);
  const [saturacion, setSaturacion] = useState(40);
  const [movilidad, setMovilidad] = useState(85);
  const [presupuesto, setPresupuesto] = useState("Medio");
  const [target, setTarget] = useState("Media Alta");

  useEffect(() => { if (datosJalisco[municipio]) setColonia(datosJalisco[municipio]); }, [municipio]);
  useEffect(() => { if (opcionesGiros[giro]) setSubGiro(opcionesGiros[giro]); }, [giro]);

  const ISO_VAL = 77.5;

  const handleAudit = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 1500);
  };

  const descargarReporte = () => {
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
    { subject: 'ISO', A: ISO_VAL },
  ];

  // --- LÓGICA DE RUTEO ---
  if (view === 'login') {
    return (
      <Login 
        onLogin={() => { setIsLoggedIn(true); setView('app'); }} 
        onBack={() => setView('app')} 
        onGoToRegister={() => setView('register')}
      />
    );
  }

  if (view === 'register') {
    return (
      <Register 
        onBack={() => setView('login')} 
        onRegisterSuccess={() => { setIsLoggedIn(true); setView('app'); }} 
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-10 font-sans bg-cover bg-fixed bg-center" style={{ backgroundImage: `url(${FondoApp})` }}>
      
      <header className="w-full max-w-7xl bg-white/90 backdrop-blur-md p-6 rounded-[2.5rem] shadow-2xl flex justify-between items-center mb-8 border border-white/50">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">
            GEOMARKET <span className="text-teal-600">PREDICTOR</span>
          </h1>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1.5 ml-0.5">Reporte de Inteligencia Territorial</p>
        </div>

        <div className="flex items-center gap-6">
          {!isLoggedIn ? (
            <button 
              onClick={() => setView('login')}
              className="text-[11px] font-black text-slate-500 uppercase tracking-widest hover:text-teal-600 transition-colors"
            >
              Iniciar Sesión
            </button>
          ) : (
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="text-[10px] font-black text-rose-400 uppercase tracking-widest hover:text-rose-600 transition-colors border border-rose-100 px-4 py-2 rounded-full"
            >
              Salir
            </button>
          )}
          <div className="bg-teal-500 text-white px-8 py-3 rounded-2xl font-black text-xl shadow-[0_10px_20px_rgba(20,184,166,0.3)]">
            ISO: {ISO_VAL}%
          </div>
        </div>
      </header>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start animate-in fade-in duration-500">
        <aside className="bg-white/95 backdrop-blur-sm p-8 rounded-[3.5rem] shadow-2xl border border-white space-y-8">
          <section className="space-y-4">
            <h2 className="text-[11px] font-black uppercase text-teal-600 tracking-widest italic">📍 CONFIGURACIÓN</h2>
            <div className="space-y-3">
              <SelectBox label="Municipio" value={municipio} onChange={setMunicipio} options={Object.keys(datosJalisco)} />
              <SelectBox label="Colonia" value={colonia} onChange={setColonia} options={datosJalisco[municipio] || []} />
              <SelectBox label="Giro" value={giro} onChange={setGiro} options={Object.keys(opcionesGiros)} />
              <SelectBox label="Subgiro" value={subGiro} onChange={setSubGiro} options={opcionesGiros[giro] || []} />
            </div>
          </section>

          <section className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-[11px] font-black uppercase text-teal-600 tracking-widest italic">⚙️ NEGOCIO</h2>
            <div className="space-y-3">
              <SelectBox label="Presupuesto" value={presupuesto} onChange={setPresupuesto} options={["Bajo", "Medio", "Alto", "Franquicia"]} />
              <SelectBox label="Target" value={target} onChange={setTarget} options={["Popular", "Media", "Media Alta", "Lujo"]} />
            </div>
          </section>

          <button onClick={handleAudit} disabled={isAnalyzing} className={`w-full py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-widest transition-all ${isAnalyzing ? "bg-slate-400 text-white" : "bg-slate-900 text-white hover:bg-teal-600 shadow-xl"}`}>
            {isAnalyzing ? "ANALIZANDO..." : "CALCULAR VIABILIDAD"}
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
              <div className="space-y-12 py-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Slider label="Población Radio 2km" value={poblacion} setValue={setPoblacion} max={200000} />
                <Slider label="Saturación de Mercado" value={saturacion} setValue={setSaturacion} max={100} unit="%" />
                <Slider label="Tráfico y Movilidad" value={movilidad} setValue={setMovilidad} max={100} unit="%" />
              </div>
            )}

            {activeTab === 'mapa' && (
              <div className="animate-in fade-in duration-700 space-y-6">
                <div className="h-[380px] w-full rounded-[3.5rem] overflow-hidden border-[8px] border-slate-50 shadow-inner relative group">
                  <MapContainer center={[20.674, -103.361]} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                    <CircleMarker center={[20.674, -103.361]} radius={14} pathOptions={{fillColor: '#14b8a6', color: 'white', weight: 4, fillOpacity: 0.9}} />
                  </MapContainer>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <AnalisisCard title="Estatus" value="Óptimo" sub="Alta Probabilidad" color="teal" />
                  <AnalisisCard title="Ticket" value="$250 - $450" sub="Estimado" color="orange" />
                  <button onClick={descargarReporte} className="bg-teal-50 hover:bg-teal-100 border border-teal-200 p-6 rounded-[2.5rem] flex flex-col items-center justify-center transition-all group active:scale-95 shadow-sm">
                    <span className="text-[24px] mb-1 group-hover:scale-110 transition-transform">📄</span>
                    <p className="text-[10px] font-black text-teal-700 uppercase tracking-widest leading-none">PDF</p>
                    <p className="text-[8px] font-bold text-teal-600/60 uppercase mt-1">Descargar ISO</p>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'competencia' && (
              <div className="space-y-4 py-4 animate-in fade-in slide-in-from-right-4 duration-500">
                {["Competidor Local A", "Rival de Zona B", "Establecimiento C"].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-6 bg-slate-50 rounded-[2.5rem] border border-white shadow-sm">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-teal-600 shadow-sm border border-slate-100">{i + 1}</div>
                      <div><p className="font-black text-slate-800 text-sm uppercase">{item}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'comparativa' && (
              <div className="h-[480px] w-full flex items-center justify-center animate-in zoom-in-95 duration-500">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{fill: '#64748b', fontSize: 11, fontWeight: 900}} />
                    <RadarRecharts name="Métricas" dataKey="A" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.4} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// --- COMPONENTES AUXILIARES ---
function AnalisisCard({ title, value, sub, color }) {
  return (
    <div className="bg-slate-50/50 p-6 rounded-[2.5rem] border border-white shadow-sm flex flex-col justify-center">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <span className="text-xl font-black text-slate-800 leading-tight uppercase">{value}</span>
      <span className={`text-[10px] font-black ${color === 'teal' ? 'text-teal-600' : 'text-orange-500'} uppercase`}>{sub}</span>
    </div>
  );
}

function SelectBox({ label, value, onChange, options }) {
  return (
    <div className="space-y-1.5 group">
      <label className="text-[9px] font-black text-slate-400 uppercase ml-3 tracking-widest">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full p-4 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] font-bold text-[11px] text-slate-700 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all cursor-pointer appearance-none shadow-sm">
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