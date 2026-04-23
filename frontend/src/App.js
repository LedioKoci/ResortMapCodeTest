import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [grid, setGrid] = useState([]);
  const [booked, setBooked] = useState([]);
  const [modalData, setModalData] = useState(null); 
  const [form, setForm] = useState({ room: '', guestName: '' });
  const [status, setStatus] = useState({ type: '', message: '' });

  const fetchMap = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/map');
      const data = await response.json();
      setGrid(data.grid);
      setBooked(data.booked);
    } catch (error) {
      console.error("Failed to fetch map data", error);
    }
  };

  useEffect(() => {
    fetchMap();
  }, []);

  const handleTileClick = (char, x, y) => {
    if (char !== 'W') return;
    
    if (booked.includes(`${x},${y}`)) {
      alert('This cabana is already booked.');
      return;
    }
    
    // open form to insert values
    setModalData({ x, y });
    setStatus({ type: '', message: '' });
    setForm({ room: '', guestName: '' });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ x: modalData.x, y: modalData.y, ...form })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setStatus({ type: 'success', message: 'Cabana booked successfully!' });
        fetchMap(); 
        setTimeout(() => setModalData(null), 1500);
      } else {
        setStatus({ type: 'error', message: result.message });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Network error occurred.' });
    }
  };

  const getPathDetails = (x, y, grid) => {
    const connectsTo = (char) => char === '#' || char === 'c' || char === 'W';
  

    const top = y > 0 && connectsTo(grid[y - 1][x]);
    const bottom = y < grid.length - 1 && connectsTo(grid[y + 1][x]);
    const left = x > 0 && connectsTo(grid[y][x - 1]);
    const right = x < grid[0].length - 1 && connectsTo(grid[y][x + 1]);
  
    const connections = [top, bottom, left, right].filter(Boolean).length;
  
    let imgSrc = '/assets/arrowStraight.png';
    let rotation = 0;
  
    // 4 way Intersection
    if (top && bottom && left && right) {
      imgSrc = '/assets/arrowCrossing.png';
    } 
    // T junctions
    else if (connections === 3) {
      imgSrc = '/assets/arrowSplit.png';
      if (!top) rotation = 90;          
      else if (!bottom) rotation = 270; 
      else if (!left) rotation =  0;   
      else if (!right) rotation = 180;   
    } 
    else if (top && right) { imgSrc = '/assets/arrowCornerSquare.png'; rotation = 0; }
    else if (right && bottom) { imgSrc = '/assets/arrowCornerSquare.png'; rotation = 90; }
    else if (bottom && left) { imgSrc = '/assets/arrowCornerSquare.png'; rotation = 180; }
    else if (left && top) { imgSrc = '/assets/arrowCornerSquare.png'; rotation = -90; }
    
    else if (left && right) {
      imgSrc = '/assets/arrowStraight.png';
      rotation = 90; 
    }
    else if (top && bottom) {
      imgSrc = '/assets/arrowStraight.png';
      rotation = 0; 
    } 
    // Dead Ends 
    else if (connections === 1) {
      imgSrc = '/assets/arrowEnd.png';
      if (top) rotation = 180;
      else if (right) rotation = -90;
      else if (bottom) rotation = 0;
      else if (left) rotation = 90;
    }
  
    return { imgSrc, rotation };
  };

  const renderTile = (char, x, y) => {
    const isBooked = booked.includes(`${x},${y}`);
    let imgSrc = '';
    let className = 'tile';
    let imageStyle = {}; 

    switch (char) {
      case 'W': 
        imgSrc = '/assets/cabana.png'; 
        className += isBooked ? ' cabana booked' : ' cabana available'; 
        break;
      case 'p': 
        imgSrc = '/assets/pool.png'; 
        className += ' pool'; 
        break;
      case 'c': 
        imgSrc = '/assets/houseChimney.png'; 
        className += ' chalet'; 
        break;
      case '#': {
        const pathData = getPathDetails(x, y, grid);
        imgSrc = pathData.imgSrc;
        className += ' path';
        imageStyle.transform = `rotate(${pathData.rotation}deg)`;
        break;
      }
      case '.': 
        imgSrc = '/assets/parchmentBasic.png'; 
        className += ' empty'; 
        break;
      default: 
        return <div key={`${x}-${y}`} className="tile" />;
    }

    return (
      <div 
        key={`${x}-${y}`} 
        className={className} 
        onClick={() => handleTileClick(char, x, y)}
      >
        <img src={imgSrc} alt={char} style={imageStyle} />
        {char === 'W' && isBooked && <div className="booked-badge">X</div>}
      </div>
    );
  };

  return (
    <div className="app-container">
      <h1>Resort Map & Cabana Booking</h1>
      
      <div className="map-grid">
        {grid.map((row, y) => 
          row.map((char, x) => renderTile(char, x, y))
        )}
      </div>

      {modalData && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Book Cabana</h2>
            {status.message && (
               <p className={status.type === 'error' ? 'error-msg' : 'success-msg'}>
                 {status.message}
               </p>
            )}
            <form onSubmit={handleBooking}>
              <input 
                type="text" 
                placeholder="Room Number (e.g. 101)" 
                value={form.room} 
                onChange={e => setForm({...form, room: e.target.value})} 
                required 
              />
              <input 
                type="text" 
                placeholder="Guest Name (e.g. Alice Smith)" 
                value={form.guestName} 
                onChange={e => setForm({...form, guestName: e.target.value})} 
                required 
              />
              <button type="submit" disabled={status.type === 'success'}>Confirm Booking</button>
              <button type="button" onClick={() => setModalData(null)} style={{marginLeft: '10px'}}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;