import React, { useState } from 'react';

const PurchaseModal = ({ isOpen, onClose, onConfirm, sweet }) => {
  const [qty, setQty] = useState(1);

  if (!isOpen || !sweet) return null;

  const handleConfirm = () => {
    onConfirm(sweet, qty);
    setQty(1); // Reset after purchase
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>🛒 Buy {sweet.name}</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>

        <div style={{ padding: '20px 0' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            Price per unit: <strong>${sweet.price}</strong>
            <br />
            Available Stock: <strong>{sweet.quantity}</strong>
          </p>

          <div className="form-group">
            <label>Select Quantity</label>
            <input
              type="number"
              className="form-control"
              min="1"
              max={sweet.quantity}
              value={qty}
              onChange={(e) => {
                const val = Math.max(1, Math.min(sweet.quantity, Number(e.target.value)));
                setQty(val);
              }}
            />
          </div>

          <div style={{ 
            background: 'var(--bg)', padding: '15px', borderRadius: '10px', 
            marginTop: '20px', textAlign: 'center', border: '1px solid var(--border)' 
          }}>
            <span style={{ color: 'var(--text-muted)' }}>Total Amount:</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary)' }}>
              ${(sweet.price * qty).toFixed(2)}
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="btn btn-outline">Cancel</button>
          <button onClick={handleConfirm} className="btn btn-primary">
            Confirm Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;