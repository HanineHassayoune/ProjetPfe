import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DefaultLayout from "./components/DefaultLayout";
import CreerCompte from "./pages/CreerCompte";
import Connexion from "./pages/Connexion";
import MdpOublie from "./pages/MdpOublie";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/connexion" element={<Connexion />}></Route>
        <Route path="/creer/compte" element={<CreerCompte />}></Route>
        <Route path="/mdp/oublie" element={<MdpOublie />}></Route>
        <Route path="*" element={<DefaultLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
