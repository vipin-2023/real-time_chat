import Dashboard from "./modules/dashboard";
import Form from "./modules/forms";
import styles from "./input.css";  // Importing CSS styles
import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";

// ProtectedRoute component for handling route protection
const ProtectedRoute = ({ children, auth = false }) => {
  const isLoggedIn = localStorage.getItem("user:token") !== null || false;

  // Check if user is not logged in and authentication is required
  if (!isLoggedIn && auth) {
    return <Navigate to={"/users/sign_in"} />;  // Redirect to sign-in page
  } else if (
    isLoggedIn &&
    ["/users/sign_in", "/users/sign_up"].includes(window.location.pathname)
  ) {
   
    return <Navigate to={"/"} />;  // Redirect to the home page if already logged in
  }

  return children;  // Render the children if no redirection is needed
};

// Main App component
function App() {
  return (
    <Routes>
      {/* Dashboard route */}
      <Route
        path="/"
        element={
          <ProtectedRoute auth={true}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* Sign-in route */}
      <Route
        path="/users/sign_in"
        element={
          <ProtectedRoute>
            <Form isSignInPage={true} />
          </ProtectedRoute>
        }
      />
      {/* Sign-up route */}
      <Route
        path="/users/sign_up"
        element={
          <ProtectedRoute>
            <Form isSignInPage={false} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
