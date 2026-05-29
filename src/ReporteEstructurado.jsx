import React, { forwardRef } from 'react';

const ReporteEstructurado = forwardRef(function ReporteEstructurado(
  {
    municipio, colonia, giro, subGiro,
    poblacion, momentum, saturacion, insatisfaccion,
    ISO_VAL, estiloConsumo, competenciaReal,
    presupuesto, target, horario
  },
  ref
) {
  const fecha = new Date().toLocaleDateString('es-MX', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const isoColor = ISO_VAL >= 75 ? '#14b8a6' : ISO_VAL >= 50 ? '#f59e0b' : '#ef4444';
  const isoLabel = ISO_VAL >= 75 ? 'FAVORABLE' : ISO_VAL >= 50 ? 'MODERADO' : 'RIESGO ALTO';

  const variables = [
    { label: 'Población Objetivo (X1)', value: Number(poblacion).toLocaleString(), unit: 'hab.' },
    { label: 'Momentum Digital (X5)', value: momentum, unit: '%' },
    { label: 'Saturación de Mercado (X3)', value: saturacion, unit: '%' },
    { label: 'Insatisfacción Cliente (X4)', value: Math.min(insatisfaccion, 100), unit: '%' },
  ];

  const estrategia = [
    { label: 'Presupuesto', value: presupuesto },
    { label: 'Target', value: target },
    { label: 'Horario', value: horario },
    { label: 'Estilo de Consumo', value: estiloConsumo },
  ];

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        top: '-9999px',
        left: '-9999px',
        width: '794px',
        backgroundColor: '#ffffff',
        fontFamily: "'Segoe UI', sans-serif",
        color: '#0f172a',
        padding: '48px',
        boxSizing: 'border-box',
      }}
    >
      {/* HEADER */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottom: '3px solid #14b8a6',
        paddingBottom: '24px',
        marginBottom: '32px',
      }}>
        <div>
          <div style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.3em', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
            Reporte Ejecutivo de Expansión Comercial
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#0f172a' }}>
            GEOMARKET <span style={{ color: '#14b8a6' }}>PREDICTOR</span>
          </div>
          <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>
            Inteligencia Geográfica Prescriptiva · Jalisco, México
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            Fecha de Análisis
          </div>
          <div style={{ fontSize: '11px', color: '#0f172a', fontWeight: 800, marginTop: '4px' }}>{fecha}</div>
          <div style={{
            marginTop: '10px',
            display: 'inline-block',
            backgroundColor: '#f0fdf9',
            border: '1px solid #99f6e4',
            borderRadius: '8px',
            padding: '4px 12px',
            fontSize: '9px',
            fontWeight: 900,
            color: '#0d9488',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
          }}>
            Documento Confidencial
          </div>
        </div>
      </div>

      {/* ISO SCORE BANNER */}
      <div style={{
        backgroundColor: '#f8fafc',
        border: `2px solid ${isoColor}`,
        borderRadius: '16px',
        padding: '24px 32px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '6px' }}>
            Índice de Supervivencia y Oportunidad
          </div>
          <div style={{ fontSize: '13px', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
            {municipio} · {colonia}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, marginTop: '4px' }}>
            {giro} — {subGiro}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '56px', fontWeight: 900, color: isoColor, lineHeight: 1 }}>
            {ISO_VAL}
            <span style={{ fontSize: '22px' }}>%</span>
          </div>
          <div style={{
            backgroundColor: isoColor,
            color: '#fff',
            fontSize: '9px',
            fontWeight: 900,
            letterSpacing: '0.2em',
            padding: '3px 12px',
            borderRadius: '999px',
            textTransform: 'uppercase',
            marginTop: '8px',
            display: 'inline-block',
          }}>
            {isoLabel}
          </div>
        </div>
      </div>

      {/* DOS COLUMNAS: Variables + Estrategia */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
        {/* Variables del Modelo */}
        <div>
          <div style={{ fontSize: '9px', fontWeight: 900, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '12px' }}>
            📊 Variables del Modelo ML
          </div>
          {variables.map((v, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 14px',
              backgroundColor: i % 2 === 0 ? '#f8fafc' : '#fff',
              borderRadius: '8px',
              marginBottom: '4px',
              border: '1px solid #f1f5f9',
            }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#475569' }}>{v.label}</span>
              <span style={{ fontSize: '12px', fontWeight: 900, color: '#0f172a' }}>
                {v.value}<span style={{ fontSize: '9px', color: '#14b8a6', marginLeft: '2px' }}>{v.unit}</span>
              </span>
            </div>
          ))}
        </div>

        {/* Estrategia de Negocio */}
        <div>
          <div style={{ fontSize: '9px', fontWeight: 900, color: '#14b8a6', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '12px' }}>
            ⚙️ Estrategia de Negocio
          </div>
          {estrategia.map((e, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 14px',
              backgroundColor: i % 2 === 0 ? '#f8fafc' : '#fff',
              borderRadius: '8px',
              marginBottom: '4px',
              border: '1px solid #f1f5f9',
            }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#475569' }}>{e.label}</span>
              <span style={{ fontSize: '12px', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase' }}>{e.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* BARRA ISO VISUAL */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '10px' }}>
          Distribución del Score ISO
        </div>
        <div style={{ height: '12px', backgroundColor: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${ISO_VAL}%`,
            backgroundColor: isoColor,
            borderRadius: '999px',
            transition: 'width 0.5s ease',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
          <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 700 }}>0% — Riesgo Alto</span>
          <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 700 }}>100% — Óptimo</span>
        </div>
      </div>

      {/* COMPETENCIA */}
      {competenciaReal && competenciaReal.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontSize: '9px', fontWeight: 900, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '12px' }}>
            🏢 Competencia Detectada en {municipio} ({competenciaReal.length} registros)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            {competenciaReal.slice(0, 9).map((c, i) => (
              <div key={i} style={{
                padding: '10px 12px',
                backgroundColor: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: '8px',
              }}>
                <div style={{ fontSize: '9px', fontWeight: 900, color: '#92400e', textTransform: 'uppercase', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.nom_estab || 'N/D'}
                </div>
                <div style={{ fontSize: '8px', color: '#b45309', fontWeight: 600 }}>{c.nombre_act || giro}</div>
                <div style={{ fontSize: '8px', color: '#d97706', fontWeight: 700, marginTop: '3px' }}>Personal: {c.per_ocu || 'N/D'}</div>
              </div>
            ))}
          </div>
          {competenciaReal.length > 9 && (
            <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 700, marginTop: '8px', textAlign: 'center' }}>
              + {competenciaReal.length - 9} competidores adicionales detectados
            </div>
          )}
        </div>
      )}

      {/* FÓRMULA */}
      <div style={{
        backgroundColor: '#0f172a',
        borderRadius: '12px',
        padding: '20px 24px',
        marginBottom: '28px',
      }}>
        <div style={{ fontSize: '9px', fontWeight: 900, color: '#14b8a6', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '10px' }}>
          Modelo Matemático — Regresión Lineal Múltiple Adaptativa
        </div>
        <div style={{ fontSize: '13px', fontFamily: 'monospace', color: '#e2e8f0', fontWeight: 700 }}>
          Y = β₀ + β₁X₁ + β₂X₂ − β₃X₃ + β₄(1/X₄) + β₅X₅ + β₆X₆ + ε
        </div>
        <div style={{ display: 'flex', gap: '20px', marginTop: '12px', flexWrap: 'wrap' }}>
          {[
            ['X1', 'Población'],
            ['X3', 'Saturación'],
            ['X4', 'Insatisfacción'],
            ['X5', 'Momentum Digital'],
            ['Y', 'Score ISO'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '9px', fontWeight: 900, color: '#14b8a6', backgroundColor: '#1e293b', padding: '2px 6px', borderRadius: '4px' }}>{k}</span>
              <span style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        borderTop: '1px solid #e2e8f0',
        paddingTop: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ fontSize: '8px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
          Geomarket Predictor · Jalisco, México · {fecha}
        </div>
        <div style={{ fontSize: '8px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
          Generado automáticamente · Uso confidencial
        </div>
      </div>
    </div>
  );
});

export default ReporteEstructurado;