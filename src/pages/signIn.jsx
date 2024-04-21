import { getAuth, signInWithEmailAndPassword } from "@firebase/auth";
import React, { useEffect, useState } from "react";
import SignInWithGoogle from "../lib/firebase/auth";
import { Link, redirect } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate()

  const auth = getAuth()
  const user = auth.currentUser


 
//   console.log(auth)

const handleSignInWithGoogle = () =>{
    SignInWithGoogle(() => {

        navigate(`/dashboard`)
    })
}

  const handleChange = (e) => {
    const {name, value} = e.target;

    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value)
}

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = userCredential.user;
        if(user !== null) {
            navigate(`/dashboard`)
        } 
        console.log(user)
    } catch (err) {
        const errorMessage = err.message
        const errorCode = err.code;

      setError(true);
      console.log(errorCode);

      switch (errorCode) {
        case "auth/invalid-email":
          setErrorMessage("This email address is invalid.");
          break;
        case "auth/user-disabled":
          setErrorMessage(
            "This email address is disabled by the administrator."
          );
          break;
        case "auth/user-not-found":
          setErrorMessage("This email address is not registered.");
          break;
        case "auth/wrong-password":
          setErrorMessage(
            "The password is invalid or the user does not have a password."
          );
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
        <h1>Log in</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            required
          />
          <button>Continue</button>
        </form>
        <button onClick={handleSignInWithGoogle}>Sign in with google</button>
        <p>Don't have an account? <Link to='/register' style={{textDecoration: 'none'}}>Sign up.</Link> </p>
      </div>
    </div>
  );
};

export default SignIn;
