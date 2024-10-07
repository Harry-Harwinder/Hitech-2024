import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // If you're using React Router

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Used for redirecting
  // Redirect to dashboard if already logged in
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/login", { email, password })
      .then((response) => {
        if (response.data.success) {
          localStorage.setItem("authToken", response.data.token);
          navigate("/dashboard");
        } else {
          setError(response.data.message);
        }
      })
      .catch((err) => {
        setError("An error occurred. Please try again.");
        console.log(err);
      });
  };
  return (
    <div className="container">
      <section className="section login min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
              <div className="card mb-3">
                <div className="card-body">
                  <div className="pt-4 pb-2">
                    <h5 className="card-title text-center pb-0 fs-4">
                      Log In{" "}
                    </h5>{" "}
                    <p className="text-center small">
                      Enter your credentials to access your account{" "}
                    </p>{" "}
                  </div>{" "}
                  <form
                    onSubmit={handleSubmit}
                    className="row g-3 needs-validation"
                    noValidate
                  >
                    <div className="col-12">
                      <label htmlFor="yourEmail" className="form-label">
                        Email{" "}
                      </label>{" "}
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        id="yourEmail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />{" "}
                      <div className="invalid-feedback">
                        Please enter a valid Email address!
                      </div>{" "}
                    </div>{" "}
                    <div className="col-12">
                      <label htmlFor="yourPassword" className="form-label">
                        Password{" "}
                      </label>{" "}
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        id="yourPassword"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />{" "}
                      <div className="invalid-feedback">
                        Please enter your password!
                      </div>{" "}
                    </div>{" "}
                    {error && (
                      <div className="col-12">
                        <p className="text-danger"> {error} </p>{" "}
                      </div>
                    )}{" "}
                    <div className="col-12">
                      <button className="btn btn-primary w-100" type="submit">
                        Log In{" "}
                      </button>{" "}
                    </div>{" "}
                    <div className="col-12">
                      <p className="small mb-0">
                        Don 't have an account? <a href="/signup"> Sign up </a>{" "}
                      </p>{" "}
                    </div>{" "}
                  </form>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
    </div>
  );
}

export default Login;
