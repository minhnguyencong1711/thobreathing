import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Orb 1: Vibrant Pink (Góc trên trái) */}
      <div 
        className="absolute w-[520px] h-[520px] rounded-full blur-[110px] opacity-25 -top-28 -left-36 animate-orb-slow"
        style={{ background: '#E63375' }}
      />
      {/* Orb 2: Royal Blue (Rìa giữa phải) */}
      <div 
        className="absolute w-[580px] h-[580px] rounded-full blur-[120px] opacity-25 top-[32%] -right-44 animate-orb-slow"
        style={{ background: '#2172D7', animationDuration: '20s', animationDelay: '-5s' }}
      />
      {/* Orb 3: Dusty Pink (Góc dưới trái) */}
      <div 
        className="absolute w-[480px] h-[480px] rounded-full blur-[110px] opacity-25 bottom-[8%] -left-28 animate-orb-slow"
        style={{ background: '#E89FB2', animationDuration: '18s', animationDelay: '-2s' }}
      />
      {/* Orb 4: Warm Glow (Góc dưới phải) */}
      <div 
        className="absolute w-[400px] h-[400px] rounded-full blur-[110px] opacity-15 top-[70%] right-[10%] animate-orb-slow"
        style={{ background: '#FFD166', animationDuration: '22s', animationDelay: '-8s' }}
      />
    </div>
  );
};
