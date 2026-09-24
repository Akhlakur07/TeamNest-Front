import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.init";
import apiClient from "../utils/apiClient";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [backendUser, setBackendUser] = useState(null);
  const [backendOrg, setBackendOrg] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    const { data } = await apiClient.get("/auth/me");
    setBackendUser(data.user);
    setBackendOrg(data.org || null);
    return data.user;
  };

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const updateUser = (updatedData) => {
    return updateProfile(auth.currentUser, updatedData);
  };

  const signInUser = async (email, password) => {
    setLoading(true);
    await signInWithEmailAndPassword(auth, email, password);
    return fetchProfile();
  };

  const googleSignin = async () => {
    setLoading(true);
    await signInWithPopup(auth, googleProvider);
    return fetchProfile();
  };

  const logOut = async () => {
    await signOut(auth);
    setUser(null);
    setBackendUser(null);
    setBackendOrg(null);
  };

  useEffect(() => {
    let active = true;
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const profile = await fetchProfile();
          if (active) setBackendUser(profile);
        } catch {
          if (active) {
            setBackendUser(null);
            setBackendOrg(null);
          }
        }
      } else {
        if (active) {
          setBackendUser(null);
          setBackendOrg(null);
        }
      }
      if (active) setLoading(false);
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const authInfo = {
    user,
    setUser,
    backendUser,
    setBackendUser,
    backendOrg,
    setBackendOrg,
    loading,
    createUser,
    signInUser,
    googleSignin,
    logOut,
    updateUser,
    fetchProfile,
  };
  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;