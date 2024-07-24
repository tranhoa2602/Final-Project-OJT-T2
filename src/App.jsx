import React, { useState } from "react";
import Sidebar from "./Components/layouts/Sidebar";
import Main from "./Components/layouts/Main";
import { Route, Routes, useLocation } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const showSidebar =
    location.pathname !== "/Login" && location.pathname !== "/";

  return (
    <>
      {showSidebar && <Sidebar />}
      <Main />
    </>
  );
}

export default App;
