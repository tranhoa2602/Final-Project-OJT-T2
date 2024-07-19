import "./styles/App.css";
import Sidebar from "./Components/layouts/Sidebar";
import Main from "./Components/layouts/Main";

function App() {
  return (
    <>
      <Sidebar />

      <Route path="/employees" component={EmployeeRoutes} />

      <Main />
    </>
  );
}

export default App;
