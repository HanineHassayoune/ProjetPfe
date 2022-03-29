import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ConsulterArticles from "../pages/ConsulterArticles";
import Statistique from "../pages/Statistique";
import ConsulterPointsVente from "../pages/ConsulterPointsVente";
import AjouterArticle from "../pages/AjouterArticle";
import AjouterPointVente from "../pages/AjouterPointVente";
import ModifierArticle from "../pages/ModifierArticle";
import ModifierPointVente from "../pages/ModifierPointVente";
import Menu from "../pages/Menu";

function DefaultLayout() {
  return (
    <Menu>
      <Routes>
        <Route path="/statistique" element={<Statistique />}></Route>
        <Route
          path="/consulter/articles"
          element={<ConsulterArticles />}
        ></Route>
        <Route path="/ajouter/article" element={<AjouterArticle />}></Route>
        <Route
          path="/consulter/pointsvente"
          element={<ConsulterPointsVente />}
        ></Route>
        <Route
          path="/ajouter/pointvente"
          element={<AjouterPointVente />}
        ></Route>
        <Route path="/modifier/article" element={<ModifierArticle />}></Route>
        <Route
          path="/modifier/pointvente"
          element={<ModifierPointVente />}
        ></Route>
      </Routes>
    </Menu>
  );
}

export default DefaultLayout;
