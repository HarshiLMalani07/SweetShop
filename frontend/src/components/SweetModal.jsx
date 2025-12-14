import { useState, useEffect } from "react";

const CATEGORIES = ["Chocolate", "Candy", "Cake", "Cookie", "Donut", "Drink", "Other"];

const SweetModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Chocolate", // Default value
    quantity: ""
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ name: "", price: "", category: "Chocolate", quantity: "" });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialData ? "✏️ Edit Sweet" : "🍬 Add New Sweet"}</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
          
          {/* Row 1: Name */}
          <div className="form-group">
            <label>Product Name</label>
            <input 
              className="form-control" 
              placeholder="e.g. Dark Chocolate Truffle" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              required 
            />
          </div>

          {/* Row 2: Price & Quantity (Side by Side) */}
          <div className="form-row">
            <div className="form-group">
              <label>Price ($)</label>
              <input 
                className="form-control" 
                type="number" 
                step="0.01" 
                placeholder="0.00" 
                value={formData.price} 
                onChange={e => setFormData({...formData, price: e.target.value})}
                required 
              />
            </div>

            <div className="form-group">
              <label>Stock Quantity</label>
              <input 
                className="form-control" 
                type="number" 
                placeholder="0" 
                value={formData.quantity} 
                onChange={e => setFormData({...formData, quantity: e.target.value})}
                required 
              />
            </div>
          </div>

          {/* Row 3: Category Dropdown */}
          <div className="form-group">
            <label>Category</label>
            <select 
              className="form-control" 
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          {/* Actions */}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {initialData ? "Save Changes" : "Create Product"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default SweetModal;