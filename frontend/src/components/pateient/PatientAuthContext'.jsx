"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import PatientLoginModal from "./PatientLoginModal";

const PatientAuthContext = createContext(undefined);

export function PatientAuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Check existing patient login
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("patientToken");

    setIsLoggedIn(Boolean(token));
  }, []);

  // Open login popup
  const openLoginModal = (action = null) => {
    setPendingAction(() => action);
    setLoginOpen(true);
  };

  // Check authentication before protected action
  const requirePatientLogin = (action = null) => {
    if (isLoggedIn) {
      if (typeof action === "function") {
        action();
      }

      return true;
    }

    openLoginModal(action);

    return false;
  };

  // Called after successful OTP/login
  const handleLoginSuccess = (token) => {
    if (typeof window !== "undefined" && token) {
      localStorage.setItem("patientToken", token);
    }

    setIsLoggedIn(true);
    setLoginOpen(false);

    if (typeof pendingAction === "function") {
      pendingAction();
    }

    setPendingAction(null);
  };

  // Logout
  const logoutPatient = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("patientToken");
    }

    setIsLoggedIn(false);
  };

  return (
    <PatientAuthContext.Provider
      value={{
        isLoggedIn,
        loginOpen,
        setLoginOpen,
        openLoginModal,
        requirePatientLogin,
        handleLoginSuccess,
        logoutPatient,
      }}
    >
      {children}

      <PatientLoginModal
        open={loginOpen}
        onClose={() => {
          setLoginOpen(false);
          setPendingAction(null);
        }}
        onLoginSuccess={handleLoginSuccess}
      />
    </PatientAuthContext.Provider>
  );
}

export function usePatientAuth() {
  const context = useContext(PatientAuthContext);

  if (context === undefined) {
    throw new Error(
      "usePatientAuth must be used inside PatientAuthProvider"
    );
  }

  return context;
}