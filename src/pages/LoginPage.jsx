import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isNonEmptyString } from "../utils/formValidation";
import "./LoginPage.css";

function LoginPage({ onLogin, isLoading, errorMessage, successMessage }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [touchedFields, setTouchedFields] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const navigate = useNavigate();

  const validationErrors = useMemo(() => {
    const errors = {};

    if (!isNonEmptyString(username)) {
      errors.username = "Enter your username.";
    }

    if (!isNonEmptyString(password)) {
      errors.password = "Enter your password.";
    }

    return errors;
  }, [password, username]);

  function shouldShowError(field) {
    return Boolean(hasSubmitted || touchedFields[field]);
  }

  function handleBlur(field) {
    setTouchedFields((current) => ({
      ...current,
      [field]: true,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setHasSubmitted(true);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

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

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-wrapper">
                <input
                  id="username"
                  className={
                    shouldShowError("username") && validationErrors.username
                      ? "input-error"
                      : ""
                  }
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  onBlur={() => handleBlur("username")}
                  autoComplete="username"
                />
              </div>
              {shouldShowError("username") && validationErrors.username ? (
                <p className="field-error-text">{validationErrors.username}</p>
              ) : null}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  className={
                    shouldShowError("password") && validationErrors.password
                      ? "input-error"
                      : ""
                  }
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  onBlur={() => handleBlur("password")}
                  autoComplete="current-password"
                />
              </div>
              {shouldShowError("password") && validationErrors.password ? (
                <p className="field-error-text">{validationErrors.password}</p>
              ) : null}
            </div>

            {errorMessage && <p className="login-error">{errorMessage}</p>}
            {successMessage ? (
              <p className="login-success">{successMessage}</p>
            ) : null}

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
