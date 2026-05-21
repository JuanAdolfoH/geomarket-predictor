import React, { useEffect, useRef } from 'react';

const GenerativeBackground = ({ darkMode = true }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Ajustar el canvas al tamaño de la pantalla
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Configuración de los nodos (puntos)
    const particles = [];
    const numParticles = 80; // Puedes subir o bajar este número
    // Color Teal (cyan) para modo oscuro, Slate (gris) para modo claro
    const baseColor = darkMode ? '45, 212, 191' : '148, 163, 184';

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5, // Velocidad X
        vy: (Math.random() - 0.5) * 1.5, // Velocidad Y
        radius: Math.random() * 2 + 1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < numParticles; i++) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Rebotar en los bordes de la pantalla
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Dibujar el punto
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${baseColor}, 0.8)`;
        ctx.fill();

        // Conectar con líneas si están cerca
        for (let j = i + 1; j < numParticles; j++) {
          let p2 = particles[j];
          let dx = p.x - p2.x;
          let dy = p.y - p2.y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) { // Distancia máxima para conectar
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            // La línea se hace más transparente mientras más lejos están
            ctx.strokeStyle = `rgba(${baseColor}, ${1 - dist / 120})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    // Limpiar el efecto cuando el componente se desmonte
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [darkMode]);

  return <canvas ref={canvasRef} className="block w-full h-full bg-slate-950" />;
};

export default GenerativeBackground;