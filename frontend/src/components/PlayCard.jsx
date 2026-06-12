import React, { useState } from 'react';
import { MoreVertical, Edit, Trash, Plus } from 'lucide-react';

const PlayCard = ({ image, title, subtitle, details, onEdit, onDelete, onAddScreen, onAddSeat, onClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const handleAction = (e, action) => {
    e.stopPropagation();
    setMenuOpen(false);
    action();
  };

  return (
    <div className="card" onClick={onClick} style={{ position: 'relative' }}>
      <button 
        onClick={toggleMenu} 
        style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '5px', border: 'none', color: 'white', cursor: 'pointer', zIndex: 2, display: 'flex' }}
      >
        <MoreVertical size={16} />
      </button>

      {menuOpen && (
        <div style={{ position: 'absolute', top: '40px', right: '10px', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '0.5rem', boxShadow: '0 5px 15px rgba(0,0,0,0.5)', minWidth: '120px' }}>
          {onEdit && <button className="menu-btn" onClick={(e) => handleAction(e, onEdit)}><Edit size={14}/> Edit</button>}
          {onAddScreen && <button className="menu-btn" onClick={(e) => handleAction(e, onAddScreen)}><Plus size={14}/> Add Screen</button>}
          {onAddSeat && <button className="menu-btn" onClick={(e) => handleAction(e, onAddSeat)}><Plus size={14}/> Add Seat</button>}
          {onDelete && <button className="menu-btn danger" onClick={(e) => handleAction(e, onDelete)}><Trash size={14}/> Delete</button>}
        </div>
      )}

      {image && <img src={image} alt={title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} />}
      <h3>{title}</h3>
      <p style={{ fontWeight: 'bold', color: 'var(--accent)' }}>{subtitle}</p>
      {details && details.map((d, i) => <p key={i} style={{ margin: '4px 0', fontSize: '0.85rem' }}>{d}</p>)}
    </div>
  );
};

export default PlayCard;
