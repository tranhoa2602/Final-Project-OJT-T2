import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Components/AuthContext/AuthContext"; // Adjust the path if necessary

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
