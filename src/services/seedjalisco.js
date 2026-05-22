import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '../firebase'; 
import Papa from 'papaparse';

// Función auxiliar para darle un respiro a Firebase entre lotes masivos
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const sembrarDatosJalisco = async () => {
  console.log("1. Iniciando descarga del CSV local...");

  try {
    const response = await fetch('/jalisco_ligero.csv');
    if (!response.ok) {
      throw new Error("No se pudo encontrar el archivo jalisco_ligero.csv");
    }
    const csvText = await response.text();

    console.log("2. Archivo leído, procesando datos con PapaParse...");

    Papa.parse(csvText, {
      header: true, 
      skipEmptyLines: true,
      complete: async (results) => {
        const data = results.data;
        console.log(`Se encontraron ${data.length} registros en total. Preparando subida masiva segura...`);

        // Partimos en bloques de 500
        const chunks = chunkArray(data, 500);
        let totalSubidos = 0;

        for (let i = 0; i < chunks.length; i++) {
          const batch = writeBatch(db);
          const chunk = chunks[i];

          chunk.forEach((negocio) => {
            const nombreRaw = negocio["nombre "]; 
            const latRaw = negocio["lat"];
            const longRaw = negocio["long"]; 

            // Filtro de filas vacías o títulos basura
            if (!nombreRaw || nombreRaw.trim() === "" || nombreRaw.includes("jalisco_ligero")) {
              return; 
            }

            const docRef = doc(collection(db, 'negocios_jalisco')); 
            
            batch.set(docRef, {
              nombre: nombreRaw.trim(),
              scian: negocio.scian || "",
              giro_descripcion: negocio.giro_descripcion || "",
              tamano: negocio.tamano || "",
              municipio: negocio.municipio ? negocio.municipio.trim() : "",
              latitud: parseFloat(latRaw) || 0,
              longitud: parseFloat(longRaw) || 0 
            });
          });

          // 🚀 Enviamos el lote actual a Firestore
          await batch.commit();
          totalSubidos += chunk.length;
          console.log(`✅ [Lote ${i + 1}/${chunks.length}] Guardados reales en Firestore: ${totalSubidos} negocios...`);

          // ⏳ TRUCO CRÍTICO: Esperamos 300 milisegundos antes del siguiente lote para no saturar Firebase
          await delay(300);
        }

        console.log("🚀 ¡Carga masiva completada con éxito en el servidor!");
        alert(`¡Éxito total! Se sembraron ${totalSubidos} registros de manera segura en Firestore.`);
      },
      error: (error) => {
        console.error("Error analizando el CSV:", error);
        alert("Hubo un error leyendo el CSV.");
      }
    });

  } catch (error) {
    console.error("Error intentando leer el archivo:", error);
    alert("Error de inicialización: " + error.message);
  }
};

function chunkArray(myArray, chunk_size) {
    let index = 0;
    let arrayLength = myArray.length;
    let tempArray = [];
    for (index = 0; index < arrayLength; index += chunk_size) {
        let myChunk = myArray.slice(index, index + chunk_size);
        tempArray.push(myChunk);
    }
    return tempArray;
}