import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage({ onLogin, isLoading, errorMessage }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    await onLogin({ username, password });
    setTimeout(() => {
      navigate("/loading");
    }, 300);
  }

  return (
    <div className="login-page">
      <div className="login-overlay">
        <div className="login-card">
          <div className="login-logo">
            <img
              className="ac-logo"
              src="/ac_logo.svg"
              alt="Algonquin College logo"
            />
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-wrapper">
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {errorMessage && <p className="login-error">{errorMessage}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="sign-in-button"
            >
              <span className="button-icon">✓</span>
              <span>{isLoading ? "Signing in..." : "Sign in"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
