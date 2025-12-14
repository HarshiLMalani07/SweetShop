import React from 'react';

const OrdersModal = ({ isOpen, onClose, orders }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
          <h2>📦 My Order History</h2>
          <button onClick={onClose} className="btn btn-outline">Close</button>
        </div>

        {orders.length === 0 ? (
          <p style={{textAlign:'center', color:'var(--text-muted)'}}>No sweets purchased yet.</p>
        ) : (
          orders.map(order => (
            <div key={order._id} className="order-item">
              <div>
                <strong style={{fontSize:'1.1rem'}}>{order.sweetName}</strong>
                <div className="order-date">{new Date(order.date).toLocaleString()}</div>
              </div>
              <div style={{color:'var(--success)', fontWeight:'bold'}}>
                ${order.price}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersModal;