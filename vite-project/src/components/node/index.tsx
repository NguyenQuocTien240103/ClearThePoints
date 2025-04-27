import { formatTime } from '../../utils';

interface NodeProps {
    number: number;
    visible: boolean;
    countdown: number | null; 
    position: { top: number; left: number }; 
    isClicked: boolean;
    onClick: (number: number) => void;
  }
  
export const NodeComponent: React.FC<NodeProps> = ({ number, visible, countdown, position, isClicked, onClick }) => {
  
    return (
      visible && (
        <div
          style={{
            width: '50px', 
            height: '50px', 
            backgroundColor: isClicked ? 'red' : 'white', 
            transition: 'background-color 2s ease', 
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
              {formatTime(countdown)} {/* Hiển thị countdown dưới số node */}
            </div>
          )}
        </div>
      )
    );
  };
  