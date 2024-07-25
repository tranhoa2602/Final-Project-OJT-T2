import React, { useState } from "react";
import Sidebar from "./Components/layouts/Sidebar";
import Main from "./Components/layouts/Main";
import { useLocation } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const showSidebar =
    location.pathname !== "/" &&
    location.pathname !== "/register" &&
    location.pathname !== "/forget-password" &&
    !location.pathname.startsWith("/reset-password");

  return (
    <>
      {showSidebar && <Sidebar />}
      <Main />
    </>
  );
}

export default App;
