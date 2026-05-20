import { db } from '../firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

// Base de datos de prueba para Jalisco basada en las 6 variables del modelo técnico
const coloniasMuestra = [
  {
    id: "zapopan_providencia",
    municipio: "Zapopan",
    colonia: "Providencia",
    tipo_zona: "urbano",
    X1_poblacion: 45000,          // Población objetivo (Residentes + Flotantes) [cite: 21]
    X2_gasto_aspiracional: 85,    // Escala 0-100: Relación ingreso vs gasto por estatus [cite: 21]
    X3_saturacion: 18,            // Cantidad de negocios del mismo giro [cite: 21]
    X4_insatisfaccion: 4.2,       // Promedio de estrellas de la competencia (Google Maps) [cite: 21]
    X5_momentum_digital: 90,      // Tasa de crecimiento de menciones en redes sociales [cite: 21]
    X6_accesibilidad: 75          // Facilidad de llegada y flujo peatonal [cite: 21]
  },
  {
    id: "guadalajara_centro",
    municipio: "Guadalajara",
    colonia: "Centro",
    tipo_zona: "urbano",
    X1_poblacion: 120000,
    X2_gasto_aspiracional: 40,    // Gasto más orientado a la necesidad real [cite: 9]
    X3_saturacion: 45,            // Zona comercial altamente saturada
    X4_insatisfaccion: 3.5,       // Muchas quejas / Malas reseñas (Mayor oportunidad de mercado) [cite: 21]
    X5_momentum_digital: 30,
    X6_accesibilidad: 95          // Máxima confluencia peatonal y transporte público
  },
  {
    id: "mazamitla_centro",
    municipio: "Mazamitla",
    colonia: "Centro",
    tipo_zona: "turistico",       // Detona el cambio dinámico de pesos beta en el modelo [cite: 21]
    X1_poblacion: 25000,          // Densidad base baja, pero con picos por turismo flotante [cite: 21]
    X2_gasto_aspiracional: 70,
    X3_saturacion: 5,             // Muy baja competencia directa (Potencial Océano Azul) [cite: 5]
    X4_insatisfaccion: 4.0,
    X5_momentum_digital: 80,      // Zona altamente instagrameable y de impacto digital
    X6_accesibilidad: 60
  }
];

/**
 * Función automatizada para sembrar los datos en Firestore
 */
export const sembrarDatosJalisco = async () => {
  try {
    const territorioRef = collection(db, "jalisco_territorio");

    for (const zona of coloniasMuestra) {
      // Usamos setDoc con ID fijo para no duplicar documentos si se presiona más de una vez
      await setDoc(doc(territorioRef, zona.id), zona);
      console.log(`✅ Zona sincronizada en la nube: ${zona.colonia}, ${zona.municipio}`);
    }
    
    alert("🚀 ¡Colección 'jalisco_territorio' poblada con éxito en tu Firestore Database!");
  } catch (error) {
    console.error("Error al inyectar datos en Firebase:", error);
    alert(`❌ Fallo en la sincronización: ${error.message}`);
  }
};