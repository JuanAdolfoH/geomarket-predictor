from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})

RUTA_MODELO = 'modelo_entrenado.json'

if os.path.exists(RUTA_MODELO):
    with open(RUTA_MODELO, 'r', encoding='utf-8') as f:
        datos_modelo = json.load(f)
    print("🎯 ¡Cerebro Adaptativo GeoMarket cargado correctamente!")
else:
    print("❌ Error: No se encontró modelo_entrenado.json. Por favor corre el entrenamiento primero.")
    exit()

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200

    data = request.json or {}
    
    # Recibir parámetros del Frontend (Añadimos 'giro')
    giro_seleccionado = data.get('giro', '')
    poblacion = float(data.get('poblacion', 50))
    saturacion = float(data.get('saturacion', 50))
    momentum = float(data.get('momentum', 50))

    # --- RESTRECCIÓN DE FILTRO POR GIRO (Sección 5-C del docx) ---
    # Si el giro existe en nuestra base de datos calibrada, usamos sus propios coeficientes.
    # Si no se envía o es nuevo, usamos un modelo base general.
    giros_disponibles = datos_modelo.get("giros", {})
    
    if giro_seleccionado in giros_disponibles:
        coef = giros_disponibles[giro_seleccionado]
        origen_coef = f"Modelo Calibrado para: {giro_seleccionado}"
    else:
        # Coeficientes promedio por defecto si no coincide el giro exacto
        coef = {
            "intercept": 35.0,
            "coef_poblacion": 0.0003,
            "coef_saturacion": -0.20,
            "coef_momentum": 0.40
        }
        origen_coef = "Modelo Estándar de Respaldo"

    # Ecuación de Regresión Lineal Múltiple Adaptativa
    score_predictivo = (
        coef["intercept"] +
        (coef["coef_poblacion"] * poblacion) +
        (coef["coef_saturacion"] * saturacion) +
        (coef["coef_momentum"] * momentum)
    )

    # Normalizar entre 10 y 100 para la escala del radar gráfico
    iso_score_final = max(10, min(100, float(score_predictivo)))

    # Respondemos formalmente con la nomenclatura técnica solicitada: ISO
    return jsonify({
        "iso_score": round(iso_score_final, 2),
        "modelo_aplicado": origen_coef,
        "status": "success",
        "municipios": datos_modelo.get("municipios_disponibles", []),
        "giros_disponibles": list(giros_disponibles.keys())[:30] # Mandamos los giros reales al frontend
    })

if __name__ == '__main__':
    app.run(port=5003, debug=True)