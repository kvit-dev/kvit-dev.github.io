import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getIdToken
} from "firebase/auth";
import app from './config';

const auth = getAuth(app);
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

export async function getAuthToken() {
  const user = auth.currentUser;
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

export async function fetchProtectedData(url, options = {}) {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("User not authenticated");
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`
  };

  return fetch(url, {
    ...options,
    headers
  });
}


