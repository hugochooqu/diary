import { initializeApp } from "@firebase/app";
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signOut } from "@firebase/auth";
import { redirect, useNavigate } from "react-router-dom";
import { getDatabase} from '@firebase/database'
import { useEffect, useState } from "react";
import { getFirestore } from "@firebase/firestore";
import {getStorage} from '@firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDqeHvPqQo02FgOJfP4J6qoDSyLQvhLDb4",
  authDomain: "diary-26866.firebaseapp.com",
  databaseURL: "https://diary-26866-default-rtdb.firebaseio.com",
  projectId: "diary-26866",
  storageBucket: "diary-26866.appspot.com",
  messagingSenderId: "289009863308",
  appId: "1:289009863308:web:bc5b6d2b62aa4bc93f49a9",
  measurementId: "G-0RNWHKR2LG",
  storageBucket: 'gs://diary-26866.appspot.com'
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app)

export const db = getFirestore(app)

const auth = getAuth(app);

export function SignOut (){
  signOut(auth).then(() => {
    console.log('successful')
    redirect('/')
  }).catch((err) => {
    console.log(err)
  })
}

const SignInWithGoogle = async (redirectCallback) => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    var user = result.user;

    console.log(user);

    redirectCallback()
  } catch (error) {
    console.error("Error signing in with google", error);
  }

  return;
};

export default SignInWithGoogle;

export function useAuth() {
  const [currentUser, setCurrentUser] = useState();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })
    return () => unsubscribe()
  }, [])
  return currentUser
}

