import React, { useState } from "react";
import Sidebar from "./Components/layouts/Sidebar";
import Main from "./Components/layouts/Main";
import { useLocation } from "react-router-dom";
import './styles/Global.css'

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const showSidebar =
    location.pathname !== "/" &&
    location.pathname !== "/register" &&
    location.pathname !== "/forget-password" &&
    !location.pathname.startsWith("/reset-password");

  return (
    <div style={{backgroundColor: '#f5f5f5'}}>
      {showSidebar && <Sidebar />}
      <Main />
    </div>
  );
}

export default App;
