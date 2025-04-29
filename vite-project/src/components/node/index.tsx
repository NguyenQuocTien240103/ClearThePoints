import { useEffect, useRef } from 'react'

interface NodeProps {
    number: number;
    visible: boolean;
    countdown: number | null; 
    position: { top: number; left: number }; 
    isClicked: boolean;
    onClick: (number: number) => void;
  }
  
export const NodeComponent: React.FC<NodeProps> = ({ number, visible, countdown, position, isClicked, onClick }) => {
  const timerCountdownRef = useRef<ReturnType<typeof setInterval> | null>(null); // Bộ đếm ngược thời gian
  const timeCountdownDisplayRef = useRef<HTMLDivElement>(null); // Thành phần hiển thị thời gian đếm ngược

  useEffect(() => {
    if(!isClicked) return; // Nếu node chưa bấm thì không hiển thị countdown
    let initialTimeCountdown = countdown!; // Thời gian ban đầu
    if (timerCountdownRef.current) clearInterval(timerCountdownRef.current);
    timerCountdownRef.current = setInterval(() => {
        initialTimeCountdown -= 0.1;
        if (timeCountdownDisplayRef.current) {
          timeCountdownDisplayRef.current.textContent = initialTimeCountdown.toFixed(1) + 's';
        }
    }, 100);
        
    return () => {
        if (timerCountdownRef.current) clearInterval(timerCountdownRef.current);
    };
  }, [isClicked]);

  return (
      visible && (
        <div
          style={{
            width: '50px', 
            height: '50px', 
            backgroundColor: isClicked ? 'red' : 'white', 
            transition: isClicked ? 'background-color 2s ease' : 'none', 
            display: 'inline-block',
            textAlign: 'center',
            lineHeight: '50px',
            borderRadius: '50%', 
            cursor: 'pointer',
            border: '1px solid black',
            position: 'absolute', 
            top: `${position.top}%`,
            left: `${position.left}%`,
          }}
          onClick={() => onClick(number)}
        >
          <div>{number}</div> {/* Hiển thị số node */}
          {countdown !== null && (
            <div
              style={{
                position: 'absolute', 
                bottom: '-10px', 
                fontSize: '10px', 
                width: '100%', 
              }}
            >
              <div ref={timeCountdownDisplayRef}></div> {/* Hiển thị countdown */}
            </div>
          )}
        </div>
      )
    );
  };
  



