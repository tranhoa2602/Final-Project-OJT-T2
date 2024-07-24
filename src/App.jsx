import React, { useState } from "react";
import Sidebar from "./Components/layouts/Sidebar";
import Main from "./Components/layouts/Main";
import { useLocation } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const showSidebar =
    location.pathname !== "/login" &&
    location.pathname !== "/" &&
    location.pathname !== "/register";

  return (
    <>
      {showSidebar && <Sidebar />}
      <Main />
    </>
  );
}

export default App;
