import React, { useState, useEffect,useRef } from 'react';
import { NodeComponent } from './components/node';
import { generateNodes } from './utils';


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
  const [timeoutIds, setTimeoutIds] = useState<number[]>([]); // Danh sách timeout
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null); // Bộ đếm thời gian
  const timeDisplayRef = useRef<HTMLSpanElement>(null); // Thành phần hiển thị thời gian
  
  // Khi số lượng node bị ẩn hết thì hoàn thành game
  useEffect(() => {
    if (gameState === 'playing') {
      if (nodes.length === 0) {
        if (timerRef.current) { // Kiểm tra trước khi clear
          clearInterval(timerRef.current);
        }
        setGameState('start');
        setResultState('All cleared');
      }
    }
  }, [nodes]);

  // Bắt đầu đếm thời gian
  const startTimer = () => {
    let initialTime = 0; // Thời gian ban đầu
    // Hủy bỏ bộ đếm thời gian trước đó
    if (timerRef.current) clearInterval(timerRef.current);
    // Tạo bộ đếm thời gian mới
    timerRef.current = setInterval(() => {
      initialTime += 0.1;
      if (timeDisplayRef.current) {
        timeDisplayRef.current.textContent = initialTime.toFixed(1) + 's';
      }
    }, 100);
  };

  // Bắt đầu hoặc restart game
  const handlePlay = () => {
    // Hủy tất cả timeout trước khi reset
    if (timeoutIds && timeoutIds.length > 0) {
        timeoutIds.forEach((id) => clearTimeout(id));
        setTimeoutIds([]);
    }
    // Kiểm tra điều kiện đầu vào
    if (points === '' || parseInt(points) <= 0) {
      alert('Please enter the number of nodes');
      return;
    }
    // Tạo danh sách node mới
    const nodeList = generateNodes(parseInt(points));
    setNodes(nodeList);
    setCurrentNode(1);
    setGameState('playing');
    setResultState('None');
    // Thiết lập bộ đếm thời gian
    startTimer();
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

      // Sau 2s thì node sẽ biến mất
      const timeoutId = setTimeout(() => {
        setNodes((prevNodes) => prevNodes.filter((n) => n.number !== node));
      }, 2000);

      setTimeoutIds((prev) => [...prev, timeoutId]);

    } else {
      // Nếu click sai node, dừng game
      if (timerRef.current) clearInterval(timerRef.current);
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
          <span ref={timeDisplayRef}>0.0s</span>
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
