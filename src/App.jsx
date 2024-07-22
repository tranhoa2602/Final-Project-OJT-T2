import "./styles/App.css";
import Sidebar from "./Components/layouts/Sidebar";
import Main from "./Components/layouts/Main";

import { Route, Routes, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
function App() {
  const location = useLocation();
  const showSidebar = location.pathname !== "/Login";

  return (
    <>
      <Sidebar />

    </>
  );
}

export default App;
