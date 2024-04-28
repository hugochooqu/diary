import { createUserWithEmailAndPassword, getAuth } from "@firebase/auth";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const auth = getAuth();
  const navigate = useNavigate()

  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') setUserName(value)
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
  };

  const validateInput = (e) => {
    let { name, value } = e.target;

    setError((prev) => {
      const stateObj = { ...prev, [name]: "" };

      switch (name) {
        case "email":
          if (!value) {
            stateObj[name] = "Please enter Email.";
          }
          break;

        case "password":
          if (!value) {
            stateObj[name] = "Please enter Password.";
          } else if (confirmPassword && value !== confirmPassword) {
            stateObj["confirmPassword"] =
              "Password and Confirm Password does not match.";
          } else {
            stateObj["confirmPassword"] = confirmPassword
              ? ""
              : error.confirmPassword;
          }
          break;

        case "confirmPassword":
          if (!value) {
            stateObj[name] = "Please enter Confirm Password.";
          } else if (password && value !== password) {
            stateObj[name] = "Password and Confirm Password does not match.";
          }
          break;

        default:
          break;
      }

      return stateObj;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;
        console.log(user)
        navigate('/signin')
    } catch (err) {
        const errorMessage = err.message;
        const errorCode = err.code;

        setErrorMessage(null);

        switch (errorCode) {
            case "auth/weak-password":
              setErrorMessage("The password is too weak.");
              break;
            case "auth/email-already-in-use":
              setErrorMessage(
                "This email address is already in use by another account."
              );
            case "auth/invalid-email":
              setErrorMessage("This email address is invalid.");
              break;
            case "auth/operation-not-allowed":
              setErrorMessage("Email/password accounts are not enabled.");
              break;
            default:
              setErrorMessage(errorMessage);
              break;
          }
    }
  }
  return (
    <div className="signin">
      <p>Write</p>
      <div className="signin-box">
        <h1>Sign up</h1>
        {errorMessage && <span className="err">{errorMessage}</span>}
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" name="username" onChange={handleChange}/>
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleChange}
            onBlur={validateInput}
          />
          {error.email && <span className="err">{error.email}</span>}
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            onBlur={validateInput}
          />
          {error.password && <span className="err">{error.password}</span>}

          <input
            type="password"
            placeholder="Confirm password"
            name="confirmPassword"
            onChange={handleChange}
            onBlur={validateInput}
          />
          {error.confirmPassword && <span className="err">{error.confirmPassword}</span>}

          <button type="submit">Continue</button>
        </form>
        <p>
          Already have an account?{" "}
          <Link to="/signin" style={{ textDecoration: "none" }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
