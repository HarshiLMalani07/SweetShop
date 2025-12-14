import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setToken, setRole, theme, toggleTheme }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Dev Logic: Username containing 'admin' becomes Admin role
    const role = isRegister && formData.username.toLowerCase().includes('admin') ? 'admin' : 'user';
    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    const payload = isRegister ? { ...formData, role } : formData;

    try {
      const res = await axios.post(`http://127.0.0.1:3000${endpoint}`, payload);
      const { token, user } = res.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("username", user.username); // <--- ADD THIS LINE!

      setToken(token);
      setRole(user.role);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Connection failed");
    }
  };

  return (
    <div className="login-container">
      {/* Theme Toggle in Corner */}
      <button 
        onClick={toggleTheme} 
        style={{ position: 'absolute', top: '20px', right: '20px', background:'none', border:'none', fontSize:'1.5rem' }}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <div className="login-card">
        <div className="login-header">
          <h2>{isRegister ? "Create Account" : "Welcome Back"}</h2>
          <p>{isRegister ? "Join the Sweet Shop" : "Sign in to continue"}</p>
        </div>
        
        {error && (
          <div style={{ background: 'var(--danger)', color: 'white', padding: '10px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input 
              className="form-control" 
              placeholder="Username" 
              value={formData.username} 
              onChange={e => setFormData({...formData, username: e.target.value})} 
              required 
            />
          </div>
          
          <div className="input-group password-wrapper">
            <input 
              className="form-control" 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})} 
              required 
              style={{paddingRight: '45px'}} 
            />
            <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '10px'}}>
            {isRegister ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <p style={{ marginTop: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {isRegister ? "Already have an account?" : "No account?"}
          <button 
            style={{ background:'none', border:'none', color:'var(--primary)', fontWeight:'bold', marginLeft:'5px', textDecoration:'underline' }} 
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;