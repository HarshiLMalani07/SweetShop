import React from 'react';

const ProfileModal = ({ isOpen, onClose, user, orders }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
        <div className="modal-header">
          <h2>👤 User Profile</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', marginTop: '20px' }}>
          
          {/* LEFT: User Details Card */}
          <div style={{ 
            background: 'var(--bg)', padding: '20px', borderRadius: '12px', 
            textAlign: 'center', border: '1px solid var(--border)', height: 'fit-content'
          }}>
            <div style={{ 
              width: '80px', height: '80px', background: 'var(--primary)', color: 'white', 
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.5rem', margin: '0 auto 15px auto', fontWeight: 'bold'
            }}>
              {user.username.charAt(0).toUpperCase()}
            </div>
            
            <h3 style={{ margin: '0 0 5px 0', color: 'var(--text)' }}>{user.username}</h3>
            <span style={{ 
              background: 'var(--card-bg)', border: '1px solid var(--border)', 
              padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', color: 'var(--text-muted)'
            }}>
              {user.role === 'admin' ? 'Administrator' : 'Verified Customer'}
            </span>

            <div style={{ marginTop: '20px', textAlign: 'left', fontSize: '0.9rem' }}>
              <p><strong>Username:</strong> @{user.username}</p>
              <p><strong>Status:</strong> Active ✅</p>
              <p><strong>Member Since:</strong> 2024</p>
            </div>
          </div>

          {/* RIGHT: Order History */}
          <div>
            <h3 style={{ marginTop: 0, borderBottom: '2px solid var(--primary)', display: 'inline-block', paddingBottom: '5px' }}>
              📦 Recent Orders
            </h3>
            
            <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
              {orders.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No orders placed yet.</p>
              ) : (
                orders.map(order => (
                  <div key={order._id} style={{ 
                    background: 'var(--bg)', padding: '15px', borderRadius: '10px', 
                    marginBottom: '10px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{order.sweetName}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Qty: {order.quantity} • {new Date(order.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>${order.price.toFixed(2)}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--success)', marginTop: '4px' }}>COMPLETED</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileModal;