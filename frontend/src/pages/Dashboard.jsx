import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti"; 
import SweetModal from "../components/SweetModal";
import PurchaseModal from "../components/PurchaseModal";
import ProfileModal from "../components/ProfileModal";

const Dashboard = ({ token, role, theme, toggleTheme }) => {
  const [sweets, setSweets] = useState([]);
  
  // --- FILTERS STATE ---
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // --- MODALS STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);        // Admin Add/Edit
  const [isProfileOpen, setIsProfileOpen] = useState(false);    // User Profile
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false); // Buy Pop-up
  
  // --- DATA STATE ---
  const [purchaseSweet, setPurchaseSweet] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [myOrders, setMyOrders] = useState([]);
  const [username, setUsername] = useState(localStorage.getItem('username') || 'User');

  const navigate = useNavigate();
  const isAdmin = role === 'admin';

  // --- 1. FETCH SWEETS (With Filters) ---
  const fetchSweets = async () => {
    try {
      const params = new URLSearchParams();
      if(search) params.append('search', search);
      if(category && category !== 'All') params.append('category', category);
      if(minPrice) params.append('minPrice', minPrice);
      if(maxPrice) params.append('maxPrice', maxPrice);

      const res = await axios.get(`http://127.0.0.1:3000/api/sweets?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSweets(res.data);
    } catch (err) {
      if(err.response?.status === 401) logout();
    }
  };

  // --- 2. FETCH ORDERS (For Profile) ---
  const openProfile = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:3000/api/sweets/myorders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyOrders(res.data);
      setIsProfileOpen(true);
    } catch (err) {
      alert("Could not load profile");
    }
  };

  useEffect(() => { fetchSweets(); }, [search, category, minPrice, maxPrice]);

  // --- 3. PURCHASE LOGIC ---
  const openPurchaseModal = (sweet) => {
    setPurchaseSweet(sweet);
    setIsPurchaseModalOpen(true);
  };

  const handleConfirmPurchase = async (sweet, qty) => {
    try {
      await axios.post(`http://127.0.0.1:3000/api/sweets/${sweet._id}/purchase`, 
        { qty }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setIsPurchaseModalOpen(false);
      triggerCelebration(); 
      fetchSweets(); 
    } catch (err) {
      alert(err.response?.data?.message || "Purchase failed");
    }
  };

  const triggerCelebration = () => {
    setShowSuccess(true);
    var duration = 3 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 2000 };

    var interval = setInterval(function() {
      var timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        setShowSuccess(false);
        return;
      }
      var particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: 0.1, y: 0.6 } });
      confetti({ ...defaults, particleCount, origin: { x: 0.9, y: 0.6 } });
    }, 250);
  };

  // --- 4. ADMIN ACTIONS ---
  const handleSave = async (data) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (editingSweet) {
        await axios.put(`http://127.0.0.1:3000/api/sweets/${editingSweet._id}`, data, config);
      } else {
        await axios.post(`http://127.0.0.1:3000/api/sweets`, data, config);
      }
      setIsModalOpen(false);
      fetchSweets();
    } catch (err) { alert("Error saving sweet"); }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this sweet?")) return;
    try {
      await axios.delete(`http://127.0.0.1:3000/api/sweets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSweets();
    } catch (err) { alert("Delete failed"); }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  return (
    <div className="container">
      {/* SUCCESS OVERLAY */}
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-box">
            <div style={{fontSize: '4rem'}}>🎉</div>
            <h2>Order Placed!</h2>
            <p>Thank you for your purchase.</p>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav>
        <div className="logo">
          <span>🍬</span> Sweet Shop
          <span style={{fontSize:'0.8rem', background:'var(--bg)', padding:'4px 8px', borderRadius:'10px', marginLeft:'10px', border:'1px solid var(--border)'}}>
            {isAdmin ? "Admin" : "User"}
          </span>
        </div>
        <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
           {/* Profile Button */}
           {!isAdmin && (
            <button onClick={openProfile} className="btn btn-outline" style={{display:'flex', alignItems:'center', gap:'5px'}}>
              <span style={{background:'var(--primary)', color:'white', width:'24px', height:'24px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem'}}>
                {username.charAt(0).toUpperCase()}
              </span>
              My Profile
            </button>
           )}
           <button onClick={toggleTheme} style={{background:'none', border:'none', fontSize:'1.2rem'}}>
             {theme==='light'?'🌙':'☀️'}
           </button>
           <button onClick={logout} className="btn btn-outline">Logout</button>
        </div>
      </nav>

      {/* FILTERS TOOLBAR (RESTORED) */}
      <div className="filters">
        <input 
          style={{flex: 1, minWidth: '200px'}}
          className="form-control"
          placeholder="🔍 Search sweets..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
        
        <select 
          value={category} 
          onChange={e => setCategory(e.target.value)}
          style={{minWidth: '150px'}}
        >
          <option value="All">All Categories</option>
          <option value="Chocolate">Chocolate</option>
          <option value="Candy">Candy</option>
          <option value="Cake">Cake</option>
          <option value="Cookie">Cookie</option>
          <option value="Donut">Donut</option>
          <option value="Drink">Drink</option>
          <option value="Other">Other</option>
        </select>

        <div style={{display:'flex', gap:'5px', alignItems:'center'}}>
          <input 
            type="number" placeholder="Min $" 
            value={minPrice} onChange={e => setMinPrice(e.target.value)}
            style={{width:'80px'}}
          />
          <span>-</span>
          <input 
            type="number" placeholder="Max $" 
            value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
            style={{width:'80px'}}
          />
        </div>

        {isAdmin && (
          <button className="btn btn-primary" onClick={() => { setEditingSweet(null); setIsModalOpen(true); }}>
            + Add Sweet
          </button>
        )}
      </div>

      {/* SWEETS GRID */}
      <div className="grid">
        {sweets.map((sweet) => (
          <div key={sweet._id} className="card">
            <div className="card-header">
              <h3 style={{margin:0, fontSize:'1.2rem'}}>{sweet.name}</h3>
              <span className="price-tag">${sweet.price}</span>
            </div>
            
            <p style={{color:'var(--text-muted)', fontSize:'0.9rem', marginBottom:'10px'}}>
              {sweet.category}
            </p>
            
            <div className="stock">
              {sweet.quantity > 0 
                ? `✅ ${sweet.quantity} In Stock` 
                : <span style={{color:'var(--danger)'}}>❌ Out of Stock</span>
              }
            </div>

            <div style={{marginTop:'auto', display:'flex', gap:'10px'}}>
              {isAdmin ? (
                <>
                  <button className="btn btn-outline" style={{flex:1}} onClick={() => { setEditingSweet(sweet); setIsModalOpen(true); }}>Edit</button>
                  <button className="btn btn-danger" style={{flex:1}} onClick={() => handleDelete(sweet._id)}>Delete</button>
                </>
              ) : (
                <button 
                  className="btn btn-primary" 
                  style={{width:'100%', opacity: sweet.quantity <= 0 ? 0.5 : 1}} 
                  onClick={() => openPurchaseModal(sweet)} 
                  disabled={sweet.quantity <= 0}
                >
                  {sweet.quantity > 0 ? "Buy Now" : "Sold Out"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ALL MODALS */}
      <SweetModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSave} 
        initialData={editingSweet} 
      />
      
      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        user={{ username, role }} 
        orders={myOrders} 
      />
      
      <PurchaseModal 
        isOpen={isPurchaseModalOpen} 
        onClose={() => setIsPurchaseModalOpen(false)} 
        onConfirm={handleConfirmPurchase}
        sweet={purchaseSweet}
      />
    </div>
  );
};

export default Dashboard;