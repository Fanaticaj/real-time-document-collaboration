import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false); // State for toast notification
  const navigate = useNavigate(); // React Router navigation

  const handleLogin = (e) => {
    e.preventDefault();

    if (email && password) {
      console.log("Login successful:", email);
      setShowToast(true); // Show toast notification

      setTimeout(() => {
        setShowToast(false); // Hide toast after 3 seconds
        navigate("/editor"); // Redirect after login
      }, 1500);
    } else {
      setError("Please enter an email and password.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div
        className="card shadow p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-4">Sign In</h2>

        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="d-flex justify-content-between mb-3">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>
            <a href="#!" className="text-primary">
              Forgot password?
            </a>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Sign in
          </button>
        </form>

        <div className="text-center mt-3">
          <p>
            Not a member?{" "}
            <a href="/register" className="text-primary">
              Register
            </a>
          </p>
          <p>or sign in with:</p>

          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-outline-secondary">
              <i className="fab fa-google"></i> Gooogle
            </button>
            <button className="btn btn-outline-secondary">
              <i className="fab fa-github"></i> GitHub
            </button>
          </div>
        </div>
      </div>

      {/* Bootstrap Toast Notification */}
      {showToast && (
        <div className="toast-container position-fixed top-0 end-0 p-3">
          <div
            className="toast show align-items-center text-bg-success border-0"
            role="alert"
          >
            <div className="d-flex">
              <div className="toast-body">Login Successful! Redirecting...</div>
              <button
                type="button"
                className="btn-close me-2 m-auto"
                onClick={() => setShowToast(false)}
              ></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
