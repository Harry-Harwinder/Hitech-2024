import React, { useState } from "react";
import axios from "axios";

function Signup() {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/register", {
        name,
        email,
        username,
        password,
      })
      .then((result) => {
        console.log(result);
        setName("");
        setEmail("");
        setUsername("");
        setPassword("");
      })
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  };
  return (
    <div style={{ backgroundColor: "#f0f0f0" }} className="container">
      <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
              <div className="card mb-3">
                <div className="card-body">
                  <div className="pt-4 pb-2">
                    <h5 className="card-title text-center pb-0 fs-4">
                      Create an Account{" "}
                    </h5>{" "}
                    <p className="text-center small">
                      Enter your personal details to create account{" "}
                    </p>{" "}
                  </div>{" "}
                  <form
                    onSubmit={handleSubmit}
                    className="row g-3 needs-validation"
                    noValidate
                  >
                    <div className="col-12">
                      <label htmlFor="yourName" className="form-label">
                        Your Name{" "}
                      </label>{" "}
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        id="yourName"
                        required
                        onChange={(e) => setName(e.target.value)}
                        value={name || ""} // Bind state to value
                      />{" "}
                      <div className="invalid-feedback">
                        Please, enter your name!
                      </div>{" "}
                    </div>{" "}
                    <div className="col-12">
                      <label htmlFor="yourEmail" className="form-label">
                        Your Email{" "}
                      </label>{" "}
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        id="yourEmail"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        value={email || ""} // Bind state to value
                      />{" "}
                      <div className="invalid-feedback">
                        Please enter a valid Email address!
                      </div>{" "}
                    </div>{" "}
                    <div className="col-12">
                      <label htmlFor="yourUsername" className="form-label">
                        Username{" "}
                      </label>{" "}
                      <div className="input-group has-validation">
                        <span
                          className="input-group-text"
                          id="inputGroupPrepend"
                        >
                          @{" "}
                        </span>{" "}
                        <input
                          type="text"
                          name="username"
                          className="form-control"
                          id="yourUsername"
                          value={username || ""} // Bind state to value
                          required
                          onChange={(e) => setUsername(e.target.value)}
                        />{" "}
                        <div className="invalid-feedback">
                          Please choose a username.{" "}
                        </div>{" "}
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
                        value={password || ""} // Bind state to value
                        required
                        onChange={(e) => setPassword(e.target.value)}
                      />{" "}
                      <div className="invalid-feedback">
                        Please enter your password!
                      </div>{" "}
                    </div>{" "}
                    <div className="col-12">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          name="terms"
                          type="checkbox"
                          value=""
                          id="acceptTerms"
                          required
                        />
                        <label
                          className="form-check-label"
                          htmlFor="acceptTerms"
                        >
                          I agree and accept the{" "}
                          <a href="#"> terms and conditions </a>{" "}
                        </label>{" "}
                        <div className="invalid-feedback">
                          You must agree before submitting.{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className="col-12">
                      <button className="btn btn-primary w-100" type="submit">
                        Create Account{" "}
                      </button>{" "}
                    </div>{" "}
                    <div className="col-12">
                      <p className="small mb-0">
                        Already have an account ? <a href="/"> Log in </a>{" "}
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
export default Signup;
