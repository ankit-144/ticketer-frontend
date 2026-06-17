import React from 'react';
import { Edit, Trash, Plus } from 'lucide-react';

const PlayCard = ({ image, title, subtitle, details, onEdit, onDelete, onAddScreen, onAddSeat, onClick }) => {
  const handleAction = (e, action) => {
    e.stopPropagation();
    action();
  };

  return (
    <div className="card" onClick={onClick} style={{ display: 'flex', flexDirection: 'column', height: '100%', cursor: onClick ? 'pointer' : 'default' }}>
      {image && <img src={image} alt={title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} />}
      <div style={{ flexGrow: 1 }}>
        <h3>{title}</h3>
        {subtitle && <p style={{ fontWeight: 'bold', color: 'var(--accent)', marginBottom: '0.5rem' }}>{subtitle}</p>}
        {details && details.map((d, i) => <p key={i} style={{ margin: '4px 0', fontSize: '0.85rem' }}>{d}</p>)}
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
        {onEdit && (
          <button className="btn btn-outline" style={{ padding: '0.5rem', flex: 1, fontSize: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem' }} onClick={(e) => handleAction(e, onEdit)}>
            <Edit size={14}/> Edit
          </button>
        )}
        {onAddScreen && (
          <button className="btn btn-outline" style={{ padding: '0.5rem', flex: 1, fontSize: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem' }} onClick={(e) => handleAction(e, onAddScreen)}>
            <Plus size={14}/> Screen
          </button>
        )}
        {onAddSeat && (
          <button className="btn btn-outline" style={{ padding: '0.5rem', flex: 1, fontSize: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem' }} onClick={(e) => handleAction(e, onAddSeat)}>
            <Plus size={14}/> Seat
          </button>
        )}
        {onDelete && (
          <button className="btn danger" style={{ padding: '0.5rem', flex: 1, fontSize: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem' }} onClick={(e) => handleAction(e, onDelete)}>
            <Trash size={14}/> Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default PlayCard;
