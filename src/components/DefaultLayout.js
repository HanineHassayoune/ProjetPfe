import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ConsulterArticles from "../pages/ConsulterArticles";
import Statistique from "../pages/Statistique";
import ConsulterPointsVente from "../pages/ConsulterPointsVente";
import AjouterArticle from "../pages/AjouterArticle";
import AjouterPointVente from "../pages/AjouterPointVente";
import ModifierArticle from "../pages/ModifierArticle";
import ModifierPointVente from "../pages/ModifierPointVente";
import Menu from "../pages/Menu";
import ModifierCompte from "../pages/ModifierCompte";
import Detail from "../pages/Detail";
import Date from "../pages/Date";
import Stat from "../pages/Stat";

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
        -
        <Route
          path="/modifier/article/:id"
          element={<ModifierArticle />}
        ></Route>
        <Route
          path="/modifier/pointvente/:id"
          element={<ModifierPointVente />}
        ></Route>
        <Route path="/modifier/compte" element={<ModifierCompte />}></Route>
        <Route path="/detail/:id" element={<Detail />}></Route>
        <Route path="/date" element={<Date />}></Route>
        <Route path="/stat" element={<Stat />}></Route>
      </Routes>
    </Menu>
  );
}

export default DefaultLayout;
