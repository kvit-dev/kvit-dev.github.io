import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, 
  onAuthStateChanged, getIdToken, GoogleAuthProvider, signInWithPopup, 
  signInWithRedirect, getRedirectResult, sendPasswordResetEmail } from "firebase/auth";

import app from './config';

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
let authStateCallback = null;
 
export async function signUp(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User signed up:", userCredential.user.email);
    return userCredential.user;
  } catch (error) {
    console.error("Sign up error:", error.message);
    throw error;
  }
}

export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent to:", email);
    return true;
  } catch (error) {
    console.error("Password reset error:", error.message);
    throw error;
  }
}

export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in:", userCredential.user.email);
    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
}

export async function signInWithGoogle(useRedirect = false) {
  try {
    if (useRedirect) {
      await signInWithRedirect(auth, googleProvider);
      return null;
    } else {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("User signed in with Google:", result.user.email);
      return result.user;
    }
  } catch (error) {
    console.error("Google sign-in error:", error.message);
    throw error;
  }
}

export async function getGoogleRedirectResult() {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      console.log("User signed in with Google (redirect):", result.user.email);
      return result.user;
    }
    return null;
  } catch (error) {
    console.error("Google redirect result error:", error.message);
    throw error;
  }
}

export async function logout() {
  try {
    await signOut(auth);
    console.log("User logged out");
  } catch (error) {
    console.error("Logout error:", error.message);
    throw error;
  }
}

export function getCurrentUser() {
  return auth.currentUser;
}

export function isAuthenticated() {
  return !!auth.currentUser;
}

export async function getUserIdToken(user) {
  if (user) {
    try {
      return await getIdToken(user);
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  }
  return null;
}

export function setGlobalAuthCallback(callback) {
  authStateCallback = callback;
  return onAuthStateChanged(auth, (user) => {
    console.log(user ? `Logged in as ${user.email}` : "No user is currently signed in");
    if (authStateCallback && typeof authStateCallback === 'function') {
      authStateCallback(user);
    }
  });
}

export function initAuthStateListener(callback) {
  return onAuthStateChanged(auth, (user) => {
    console.log(user ? `Logged in as ${user.email}` : "No user is currently signed in");
    if (callback && typeof callback === 'function') {
      callback(user);
    }
  });
}

export async function getProtectedData() {
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in first");
    return;
  }
  
  try {
    const token = await getIdToken(user);
    const response = await fetch("http://localhost:5000/api/protected", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    alert(JSON.stringify(data));
  } catch (error) {
    alert("Error fetching protected data: " + error.message);
  }
}

export async function fetchProtectedData(url, options = {}) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const token = await getIdToken(user);
  
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`
  };

  return fetch(url, {
    ...options,
    headers
  });
}