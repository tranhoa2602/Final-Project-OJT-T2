import "./styles/App.css";
import Sidebar from "./Components/layouts/Sidebar";
import Main from "./Components/layouts/Main";
import Login from "./pages/Login";
import { Route, Routes, useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const showSidebar = location.pathname !== "/login";

  return (
    <>
      {showSidebar && <Sidebar />}
      <Main />
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
