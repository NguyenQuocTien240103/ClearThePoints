import React, { useState, useEffect } from 'react';
import { NodeComponent } from './components/node';
import { generateNodes } from './utils';

// interface GameState {
//   points: string;
//   nodes: Node[]; 
//   gameState: 'start' | 'playing' | 'game over';
//   currentNode: number;
//   time: number;
//   timer: ReturnType<typeof setInterval> | null;
// }

interface Node{
  number: number;
  countdown: number | null; 
  position: { top: number; left: number };
  isClicked: boolean;
}

const Game: React.FC = () => {
  const [points, setPoints] = useState<string>(''); // Số lượng node
  const [nodes, setNodes] = useState<Node[]>([]); // Danh sách node
  const [gameState, setGameState] = useState<'start' | 'playing'>('start'); // Trạng thái game
  const [resultState, setResultState] = useState<'None' | 'All cleared' | 'Game over'>('None'); // Trạng thái kết quả
  const [currentNode, setCurrentNode] = useState<number>(1); // Node hiện tại
  const [time, setTime] = useState<number>(0); // Thời gian đếm
  const [timer, setTimer] = useState<ReturnType<typeof setInterval> | null>(null); // Cập nhật kiểu ở đây

  // Khi số lượng node bị ẩn hết thì hoàn thành game
  useEffect(() => {
    if(gameState === 'playing'){
      
      if (nodes.length === 0) {
        clearInterval(timer!);
        setGameState('start');
        setResultState('All cleared');
      }
    }
  }, [nodes]);

  // Bắt đầu hoặc restart game
  const handlePlay = () => {
    if (points === '' || parseInt(points) <= 0) {
      alert('Please enter the number of nodes');
      return;
    }
    const nodeList = generateNodes(parseInt(points));
    setNodes(nodeList);
    setCurrentNode(1);
    setGameState('playing');
    setResultState('None');
    setTime(0);

    // Thiết lập bộ đếm thời gian
    if (timer) clearInterval(timer);
    const newTimer = setInterval(() => {
      setTime((prevTime) => parseFloat((prevTime + 0.1).toFixed(1))); 
    }, 100);
    setTimer(newTimer);
  };

  // Xử lý khi bấm vào node
  const handleNodeClick = (node: number) => {
    if (node === currentNode) {
      // Nếu bấm đúng thứ tự, bắt đầu đếm ngược
      setNodes((prevNodes) =>
        prevNodes.map((n) =>
          n.number === node
            ? { ...n, countdown: 2.0 , isClicked: true} // Thiết lập countdown là 2s
            : n
        )
      );
      setCurrentNode((prevCurrentNode) => prevCurrentNode + 1);

      // Bắt đầu đếm ngược cho node đã bấm
      const countdownInterval = setInterval(() => {
        setNodes((prevNodes) =>
          prevNodes.map((n) =>
            n.countdown !== null && n.number === node
              ? { ...n, countdown: parseFloat((n.countdown - 0.1).toFixed(1)) }
              : n
          )
        );
      }, 100); // Đếm ngược mỗi 100ms

      // Sau khi countdown = 0 thì node sẽ biến mất
      setTimeout(() => {
        clearInterval(countdownInterval);
        setNodes((prevNodes) => prevNodes.filter((n) => n.number !== node));
      }, 2000);

    } else {
      // Nếu click sai node, dừng game
      clearInterval(timer!);
      setResultState('Game over');
    }
  };

  // Xử lý input points
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPoints(e.target.value);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
      }}
    >
      <div style={{ textAlign: 'left' }}>
        
        <h2 
            style={{
              color: resultState === 'All cleared' ? 'green' : resultState === 'Game over' ? 'red' : 'black',
              marginBottom: '10px',
            }}
          >
            {resultState === 'None' ? `Let's play` : resultState}
        </h2>

        <div style={{ display: 'flex', gap: '10px' }}>
          <label style={{ minWidth: '50px' }}>Points:</label>
          <input value={points} onChange={handleInputChange} />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <label style={{ minWidth: '50px' }}>Time:</label>
          <span>{time.toFixed(1)}s</span>
        </div>

        {gameState === 'start' ? (          
            <button onClick={handlePlay} style={{ padding: '0px 20px' }}>Play</button>
        ) : (  
            <button onClick={handlePlay} style={{ padding: '0px 20px' }}>Restart</button>
        )}

        <div
          style={{
            position: 'relative', 
            display: 'block',
            width: '80vw', 
            height: '80vh', 
            border: '2px solid black',
            marginTop: '10px',
          }}
        >
          {nodes.map((node) => (
            <NodeComponent
              key={node.number}
              number={node.number}
              visible={gameState === 'playing'} // Đảm bảo node không bị ẩn khi game over
              countdown={node.countdown}
              position={node.position}
              isClicked={node.isClicked}
              onClick={handleNodeClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Game;
