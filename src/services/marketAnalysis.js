/**
 * GEOMARKET PREDICTOR - MOTOR DE INTELIGENCIA GEOGRÁFICA PRESCRIPTIVA
 * Servidor de Simulación de Datos, Regresión Múltiple y Densidad de Competencia Calificada
 */

const limpiarTextoParaMotor = (str) => {
  if (!str) return "";
  return str
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

/**
 * Genera la lista detallada de competidores con nombres comerciales reales del entorno urbano
 * y sus calificaciones de servicio (estrellas).
 */
const generarNegociosCompetidores = (municipio, colonia, giro, cantidad) => {
  // Diccionario exhaustivo con nombres reales/comunes de negocios en Jalisco por giro
  const baseNegocios = {
    "SALUD Y BIENESTAR": [
      "Dental Perfect Zapopan", "Clínica Dental San Ángel", "Consultorio Odontológico Integral", 
      "Smile Studio Providencia", "Dentistas & Co.", "Centro Dental Altius", 
      "Odontología Estética Guadalajara", "Clínica de Especialidades Dentales", "Dental Integral Minerva"
    ],
    "RESTAURANTES": [
      "Tacos Los Compas", "El Sazón Local", "Bistró Urbano Chapultepec", 
      "Café Central GDL", "La Antojería Mexicana", "Pizzería La Nostra", 
      "Mariscos El Faro", "La Choza del Sazón", "Burgers & Fries Urban"
    ],
    "ABARROTES": [
      "Mini Súper El Paso", "Abarrotes La Esquina", "Bodega Local Jalisco", 
      "Miscelánea San Juan", "Tienda El Triunfo", "Supercito Express", 
      "Abarrotes Don Lalo", "MiniM超级 Minerva", "La Guadalupana"
    ]
  };

  const giroLimpio = limpiarTextoParaMotor(giro);
  // Si el giro no coincide exactamente, usa una lista genérica de comercio seguro
  let listaNombres = baseNegocios[giroLimpio] || [
    "Comercio Local Alfa", "Distribuidora Comercial GDL", "Negocio Establecido", 
    "Punto de Venta Local", "Servicios Integrales de la Zona"
  ];
  
  // Coordenadas base aproximadas para el mapeo geométrico
  const latBase = 20.671955;
  const lngBase = -103.348822;

  const negocios = [];
  for (let i = 0; i < cantidad; i++) {
    const rLat = (Math.random() - 0.5) * 0.015;
    const rLng = (Math.random() - 0.5) * 0.015;
    
    // Generar calificación aleatoria pero profesional entre 3.8 y 4.9 estrellas
    const calificacionNumerica = (3.8 + Math.random() * 1.1).toFixed(1);
    
    negocios.push({
      id: `negocio_${i}_${Date.now()}`,
      nombre: listaNombres[i % listaNombres.length], // Rota los nombres reales del arreglo
      giro: giro,
      latitud: latBase + rLat,
      longitud: lngBase + rLng,
      afluencia: Math.floor(45 + Math.random() * 45) + "%",
      calificacion: calificacionNumerica, // <--- AQUÍ ESTÁ LA CALIFICACIÓN SÓLO EN NÚMERO (Ej: 4.5)
      estrellas: "★".repeat(Math.round(calificacionNumerica)), // <--- ESTRELLAS EN TEXTO VISUAL (Ej: ★★★★★)
      estado: Math.random() > 0.4 ? "Competencia Directa" : "Competencia Indirecta"
    });
  }
  return negocios;
};

/**
 * Analiza el entorno y calcula las métricas de distanciamiento y competencia calificada
 */
export const analizarZonaJalisco = async (municipio, colonia, giro) => {
  const muniLimpio = limpiarTextoParaMotor(municipio);
  const colLimpia = limpiarTextoParaMotor(colonia);
  const giroLimpio = limpiarTextoParaMotor(giro);

  try {
    let baseMunicipio = null;
    try {
      const llaveDatos = `jalisco_data_${muniLimpio}`;
      const datosRaw = localStorage.getItem(llaveDatos);
      if (datosRaw) {
        baseMunicipio = JSON.parse(datosRaw);
      }
    } catch (e) {
      console.warn("[Motor Predictivo] JSON local inaccesible o vacío.");
    }
    
    const seed = muniLimpio.length + colLimpia.length + giroLimpio.length;
    
    let poblacionDefecto = Math.floor(35000 + (seed * 1250) % 135000);
    if (muniLimpio === "ZAPOPAN") {
      poblacionDefecto = 1480000;
    }

    const X1 = baseMunicipio && baseMunicipio.poblacion ? Number(baseMunicipio.poblacion) : poblacionDefecto;
    const X2 = Math.floor(40 + (seed * 3) % 55);                                     
    const X3 = Math.floor(10 + (seed * 7) % 65); // Saturación de Competencia                                    
    const X4 = parseFloat((0.01 + ((seed * 2) % 9) / 100).toFixed(3));                
    const X5 = Math.floor(50 + (seed * 9) % 45);                                      
    const X6 = Math.floor(45 + (seed * 4) % 50);                                      

    const b0 = 35;
    const b1 = (X1 / 200000) * 10;
    const b2 = (X2 / 100) * 15;
    const b3 = (X3 / 100) * 20; 
    const b4 = X4 > 0 ? (1 / X4) * 0.2 : 5; 
    const b5 = (X5 / 100) * 15;
    const b6 = (X6 / 100) * 15;

    let isoCalculado = Math.round(b0 + b1 + b2 - b3 + b4 + b5 + b6);
    isoCalculado = Math.max(45, Math.min(isoCalculado, 98));

    // Determinar cantidad de competidores lógicos según el índice X3
    const numeroDeNegociosExistentes = Math.max(3, Math.floor(X3 / 8)); 
    // Obtener la lista estructurada con Nombres y Calificaciones
    const listaNegocios = generarNegociosCompetidores(municipio, colonia, giro, numeroDeNegociosExistentes);

    // Regla de distanciamiento basada en metros y cuadras comerciales
    let metrosRecomendados = 150;
    if (X3 > 50) {
      metrosRecomendados = Math.floor(400 + (seed * 15) % 350);
    } else if (X3 > 25) {
      metrosRecomendados = Math.floor(200 + (seed * 10) % 150);
    }
    const cuadrasRecomendadas = parseFloat((metrosRecomendados / 100).toFixed(1));

    const esISOAlto = isoCalculado > 72;
    const potencialVenta = esISOAlto ? "Alta densidad comercial (Aspiracional)" : "Demanda local de primera necesidad (Funcional)";

    const diagnostico = `El entorno comercial en la colonia ${colonia} (${municipio}) presenta un nivel de fricción competitivo del ${X3}%, identificando ${numeroDeNegociosExistentes} negocios del giro ${giro} operando en la zona.`;

    const recomendacionSensata = `Para evitar la canibalización del mercado por la competencia directa de los ${numeroDeNegociosExistentes} locales activos, se sugiere establecer el negocio desplazándose al menos **${metrosRecomendados} metros** (aprox. **${cuadrasRecomendadas} cuadras**) fuera del núcleo de alta saturación comercial de la zona.`;

    const recomendacionFantasiosa = `Desplegar un anillo de exclusión geo-referenciado a ${metrosRecomendados} metros a la redonda y mitigar la competencia directa.`;

    return {
      exito: true,
      municipio: municipio, 
      colonia: colonia,
      giro: giro,
      iso: isoCalculado,
      potencialVenta: potencialVenta,
      diagnostico: diagnostico,
      recomendacionSensata: recomendacionSensata,
      recomendacionFantasiosa: recomendacionFantasiosa,
      tipoZona: "urbano",
      
      // DATOS ENVIADOS DIRECTAMENTE A TU VISTA/FRONTEND:
      negociosExistentes: listaNegocios, 
      distanciaMetros: metrosRecomendados,
      distanciaCuadras: cuadrasRecomendadas,
      totalCompetidores: numeroDeNegociosExistentes,
      
      variables: { X1, X2, X3, X4, X5, X6 }
    };

  } catch (error) {
    console.error("[Motor Predictivo] Error fatal crítico:", error);
    return {
      exito: false,
      error: error.message,
      iso: 75,
      negociosExistentes: [],
      distanciaMetros: 200,
      distanciaCuadras: 2,
      totalCompetidores: 0,
      variables: { X1: 75000, X2: 50, X3: 30, X4: 0.05, X5: 65, X6: 55 }
    };
  }
};