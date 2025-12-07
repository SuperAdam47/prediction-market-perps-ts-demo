import { useEffect, useState } from "react";

interface ConfettiProps {
  trigger: boolean;
  duration?: number;
}

const Confetti = ({ trigger, duration = 3000 }: ConfettiProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [trigger, duration]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const duration = 2 + Math.random() * 2;
        const colors = [
          "hsl(44, 92%, 47%)", // primary/gold
          "hsl(44, 85%, 40%)", // secondary
          "hsl(142, 76%, 45%)", // success/green
          "hsl(0, 84%, 60%)", // red
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];

        return (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-sm confetti-piece"
            style={{
              left: `${left}%`,
              backgroundColor: color,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .confetti-piece {
          animation: confetti-fall linear forwards;
        }
      `}</style>
    </div>
  );
};

export default Confetti;

