import os
import pandas as pd
import json
from sklearn.linear_model import LinearRegression
import numpy as np

print("⏳ Iniciando entrenamiento adaptativo segmentado por Giro...")

archivo_csv = '../jalisco_ligero.csv'
if not os.path.exists(archivo_csv):
    print(f"❌ Error: No encontré el archivo '{archivo_csv}'")
    exit()

# Cargar saltando las líneas de títulos basura
full_df = pd.read_csv(archivo_csv, encoding='utf-8', sep=',', skiprows=2)
full_df.columns = full_df.columns.str.strip().str.lower()

# Limpieza básica
full_df = full_df.dropna(subset=['municipio', 'tamano', 'giro_descripcion'])

# Mapear éxito basado en personal (Variable Objetivo Y)
def mapear_exito(valor):
    v = str(valor).lower()
    if '0 a 5' in v or '1 a 5' in v: return 25
    if '6 a 10' in v: return 48
    if '11 a 30' in v: return 72
    if '31 a 50' in v: return 85
    if '51 a' in v or '100' in v: return 98
    return 30

full_df['score_exito'] = full_df['tamano'].apply(mapear_exito)

# Calcular competencia real X3 por municipio y giro
competencia = full_df.groupby(['municipio', 'giro_descripcion']).size().reset_index(name='conteo')
full_df = full_df.merge(competencia, on=['municipio', 'giro_descripcion'], how='left')
max_conteo = full_df['conteo'].max() if full_df['conteo'].max() > 0 else 1
full_df['X3_saturacion'] = (full_df['conteo'] / max_conteo) * 100

# Diccionario maestro para guardar los coeficientes de cada giro
modelos_por_giro = {}

# Obtener los giros más representativos (con suficientes datos para entrenar)
giros_populares = full_df['giro_descripcion'].value_counts().loc[lambda x: x > 2].index.tolist()

for giro in giros_populares:
    df_giro = full_df[full_df['giro_descripcion'] == giro].copy()
    
    # Simular correlaciones adaptativas de X1 y X5 según la naturaleza del giro
    # Si es un servicio o comercio común, la viralidad o el momentum pesan diferente
    es_cafeteria_o_similar = any(k in giro.lower() for k in ['café', 'restaurante', 'bebidas', 'alimentos', 'recreativos'])
    
    if es_cafeteria_o_similar:
        # El momentum (X5) empuja con fuerza el éxito real en giros de moda o alimentos
        df_giro['X5_momentum'] = df_giro['score_exito'] * 0.8 + np.random.normal(50, 5, len(df_giro))
        df_giro['X1_poblacion'] = df_giro['score_exito'] * 800 + np.random.normal(30000, 5000, len(df_giro))
    else:
        # En giros tradicionales o industriales, la población manda y la viralidad influye poco
        df_giro['X5_momentum'] = np.random.normal(30, 15, len(df_giro)) # Ruido con baja correlación
        df_giro['X1_poblacion'] = df_giro['score_exito'] * 1500 + np.random.normal(40000, 6000, len(df_giro))
        
    df_giro['X5_momentum'] = df_giro['X5_momentum'].clip(10, 100)
    df_giro['X1_poblacion'] = df_giro['X1_poblacion'].clip(5000, 250000)
    
    # Entrenar Regresión Lineal para ESTE giro específico
    X = df_giro[['X1_poblacion', 'X3_saturacion', 'X5_momentum']]
    Y = df_giro['score_exito']
    
    modelo_lr = LinearRegression()
    modelo_lr.fit(X, Y)
    
    # Guardar coeficientes ajustados
    modelos_por_giro[giro] = {
        "intercept": float(modelo_lr.intercept_),
        "coef_poblacion": float(modelo_lr.coef_[0]),
        "coef_saturacion": float(modelo_lr.coef_[1]),
        "coef_momentum": float(modelo_lr.coef_[2])
    }

# Municipios únicos para el frontend
municipios_lista = sorted([str(m).strip().upper() for m in full_df['municipio'].unique() if pd.notna(m)])[:50]

datos_json = {
    "giros": modelos_por_giro,
    "municipios_disponibles": municipios_lista
}

with open('modelo_entrenado.json', 'w', encoding='utf-8') as f:
    json.dump(datos_json, f, ensure_ascii=False, indent=2)

print(f"🎯 ¡ML Completado! Se entrenaron {len(modelos_por_giro)} modelos de regresión adaptativos por giro.")