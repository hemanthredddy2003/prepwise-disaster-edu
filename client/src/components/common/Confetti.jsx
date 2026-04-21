
const COLORS = ["#4F46E5","#7C3AED","#F59E0B","#10B981","#EF4444","#3B82F6","#EC4899","#06B6D4"];
const SHAPES = ["square","circle","triangle"];

export function useConfetti() {
  const fire = (origin = { x: 0.5, y: 0.3 }) => {
    const container = document.getElementById("confetti-container");
    if (!container) return;
    for (let i = 0; i < 80; i++) {
      const piece = document.createElement("div");
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      const size = Math.random() * 10 + 6;
      const x = (origin.x * window.innerWidth) + (Math.random() - 0.5) * 300;
      const duration = Math.random() * 2 + 1.5;
      piece.style.cssText = `
        position:fixed; left:${x}px; top:${origin.y * window.innerHeight}px;
        width:${size}px; height:${size}px;
        background:${shape==="circle"?color:"transparent"};
        border:${shape!=="circle"?`3px solid ${color}`:"none"};
        border-radius:${shape==="circle"?"50%":shape==="square"?"3px":"0"};
        clip-path:${shape==="triangle"?"polygon(50% 0%, 0% 100%, 100% 100%)":"none"};
        background-color:${shape!=="circle"?color:"transparent"};
        animation:confettiFall ${duration}s linear forwards;
        animation-delay:${Math.random()*0.5}s;
        z-index:9999;
        pointer-events:none;
        transform:rotate(${Math.random()*360}deg);
      `;
      if(shape==="circle") piece.style.background = color;
      if(shape!=="circle") piece.style.backgroundColor = color;
      container.appendChild(piece);
      setTimeout(() => piece.remove(), (duration + 0.5) * 1000);
    }
  };
  return { fire };
}

export function ConfettiContainer() {
  return <div id="confetti-container" style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,overflow:"hidden"}} />;
}
