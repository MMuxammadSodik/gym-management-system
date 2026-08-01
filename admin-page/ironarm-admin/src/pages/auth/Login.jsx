import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import "./Login.css";
import logo from "../../assets/iron-arm-logo.jpg";

import { login, saveToken } from "../../services/auth";

function Login() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await login(username, password);

      saveToken(response.token);

      await refreshUser();

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      console.error(err);

      if (err.response) {
        setError(err.response.data.message || "Invalid username or password.");
      } else {
        setError("Unable to connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page">
      <div className="login-container">
        <div className="logo-wrapper">
          <img src={logo} alt="IronArm Logo" className="logo" />
        </div>

        <div className="login-card">
          <div className="login-header">
            <h1>IronArm Admin</h1>

            <p>Internal Administration Portal</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>

              <input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>

              <input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="login-footer">Authorized personnel only</div>
        </div>
      </div>
    </section>
  );
}

export default Login;
