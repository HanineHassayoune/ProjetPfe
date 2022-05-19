import React from "react";
//import Paper from "@material-ui/core/Paper";
import Paper from "@mui/material/Paper";
import {
  Chart,
  PieSeries,
  Title,
} from "@devexpress/dx-react-chart-material-ui";
import {
  ArgumentAxis,
  ValueAxis,
  BarSeries,
} from "@devexpress/dx-react-chart-material-ui";
import { Grid } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useState, useEffect } from "react";
import { getReservationCurrentUser } from "../controleurs/ReservationControleur";
import { getListClientByListId } from "../controleurs/CompteControleur";
import {
  getListArticlesByListId,
  getArticleById,
  updateArticle,
} from "../controleurs/ArticleControleurs";
import { getListPointVenteByListId } from "../controleurs/PointDeVenteControleur";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import { updateReservation } from "../controleurs/ReservationControleur";
import { Button } from "@mui/material";
import { getConnectedUser } from "../Helpers/FireBase";

const Statistique = () => {
  const [rows, setRows] = useState([]);

  // Sample data
  const data = [
    { argument: "Lundi", value: 10 },
    { argument: "Mardi", value: 10 },
    { argument: "Mercredi", value: 20 },
    { argument: "Jeudi", value: 20 },
    { argument: "Vendredi", value: 10 },
    { argument: "Samedi", value: 30 },
  ];
  let diagrammeBatons = rows.map((elem) => ({
    argument: elem.dateReservation,
    value: elem.quantiteReserve,
  }));

  /*const diagrammeBatons = [
    { argument: "Monday", value: 30 },
    { argument: "Tuesday", value: 20 },
    { argument: "Wednesday", value: 10 },
    { argument: "Thursday", value: 50 },
    { argument: "Friday", value: 60 },
  ];
*/
  console.log("rowssssssssssssssssss", rows);
  //change statut d'article et quantité restante
  const handleChange = (event, row) => {
    event.preventDefault();
    let _quantiteDispo =
      parseInt(row.quantiteArticle) - parseInt(row.quantiteReserve);
    if (_quantiteDispo < 0) {
      console.log("quantité negative");
      return;
    }
    console.log(row);
    const reservation = {
      statutReservation: "Validée",
      reserverId: row.idReservation,
    };
    updateReservation(reservation).then(() => {
      const article = {
        id: row.idArticle,
        quantite: _quantiteDispo,
        statut: _quantiteDispo == 0 ? "Retiré" : "Diponible",
      };
      updateArticle(article).then(() => {
        /* const updateReservation = {
          idArticle: row.idArticle,
          emailClient: row.emailClient,
          titreArticle: row.titreArticle,
          quantiteArticle: _quantiteDispo,
          quantiteReserve: row.quantiteReserve,
          titrePointVente: row.titrePointVente,
          statutReservation: "Retirée",
          dateReservation: row.dateReservation,
          idReservation: row.idReservation,
        };*/
        const updateReservation2 = {
          ...row,
          statutReservation: "Retirée",
          quantiteArticle: _quantiteDispo,
        };
        //setRows([...rows, updateReservation]);
        let updatedRows = rows.map((item) =>
          item.idReservation == row.idReservation ? updateReservation2 : item
        );
        setRows(updatedRows);
      });
    });
  };

  useEffect(() => {
    console.log("use effect here ");
    getConnectedUser().then((_user) => {
      // get list reservations
      if (rows.length == 0) {
        getReservationCurrentUser(_user.uid)
          .then((response) => {
            let _reservations = response.docs.map((doc) => doc.data());
            console.log("reservations", _reservations);
            //get list id client from reservation
            let ListIdClients = _reservations.map((res) => res.idClient);
            console.log("ListIdClients", ListIdClients);
            // get liste client from reservation
            getListClientByListId([...new Set(ListIdClients)]).then(
              (snapshot) => {
                let listClients = snapshot.docs.map((doc) => doc.data());
                console.log("listClients", listClients);

                let ListIdArticles = _reservations.map((res) => res.idArticle);
                console.log("ListIdArticles", ListIdArticles);
                // get list article
                getListArticlesByListId([...new Set(ListIdArticles)]).then(
                  (snapshot) => {
                    let listArticles = snapshot.docs.map((doc) => doc.data());
                    console.log("listArticles", listArticles);

                    let ListIdPtv = _reservations.map(
                      (res) => res.idPointVente
                    );
                    console.log("ListIdPtv", ListIdPtv);

                    // get list pointvente
                    getListPointVenteByListId([...new Set(ListIdPtv)]).then(
                      (snapshot) => {
                        let listPtv = snapshot.docs.map((doc) => doc.data());
                        console.log("listPtv", listPtv);

                        //get listqttReserve

                        //construire array de reservation
                        let _rows = [];
                        for (
                          let index = 0;
                          index < _reservations.length;
                          index++
                        ) {
                          const element = _reservations[index];
                          const item = {
                            idArticle: element.idArticle,
                            emailClient: listClients.find(
                              (client) => client.id === element.idClient
                            ).email,
                            titreArticle: listArticles.find(
                              (article) => article.id === element.idArticle
                            ).titreArticle,
                            quantiteArticle: listArticles.find(
                              (quantite) => quantite.id === element.idArticle
                            ).quantite,
                            quantiteReserve: element.quantiteReserve,
                            titrePointVente: listArticles.find(
                              (ptv) => ptv.id === element.idArticle
                            ).nomPointVente,
                            statutReservation: element.statutReservation,
                            dateReservation: element.dateReservation,
                            idReservation: element.reserverId,
                          };
                          _rows.push(item);
                          console.log(item);
                        }
                        setRows(_rows);
                        console.log("_rows", _rows);
                      }
                    );
                  }
                );
              }
            );
          })
          .catch((error) => {
            console.error("Error : ", error);
          });
      }
    });
  }, [rows.length]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Paper elevation={3}>
          <Chart data={data}>
            <PieSeries valueField="value" argumentField="argument" />
            <Title text="Articles par jour " />
          </Chart>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper elevation={3}>
          <Chart data={diagrammeBatons}>
            <ArgumentAxis />
            <ValueAxis />
            <BarSeries valueField="value" argumentField="argument" />
          </Chart>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center" bgcolor="#e3f2fd">
                  Email client
                </TableCell>
                <TableCell align="center" bgcolor="#e3f2fd">
                  Titre article
                </TableCell>
                <TableCell align="center" bgcolor="#e3f2fd">
                  Quantité disponible
                </TableCell>
                <TableCell align="center" bgcolor="#e3f2fd">
                  Quantité reservé
                </TableCell>
                <TableCell align="center" bgcolor="#e3f2fd">
                  Titre point vente
                </TableCell>

                <TableCell align="center" bgcolor="#e3f2fd">
                  Statut
                </TableCell>
                <TableCell align="center" bgcolor="#e3f2fd">
                  Date réservation
                </TableCell>
                <TableCell align="center" bgcolor="#e3f2fd">
                  Id réservation
                </TableCell>
                <TableCell align="center" bgcolor="#e3f2fd">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row, id) => (
                <TableRow
                  key={id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell align="center">{row.emailClient}</TableCell>
                  <TableCell align="center">{row.titreArticle}</TableCell>
                  <TableCell align="center">{row.quantiteArticle}</TableCell>
                  <TableCell align="center">{row.quantiteReserve}</TableCell>
                  <TableCell align="center">{row.titrePointVente}</TableCell>
                  <TableCell align="center">{row.statutReservation}</TableCell>
                  <TableCell align="center">{row.dateReservation}</TableCell>
                  <TableCell align="center">{row.idReservation}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      onClick={(event) => {
                        handleChange(event, row);
                      }}
                      disabled={
                        parseInt(row.quantiteArticle) > 0 ? false : true
                      }
                    >
                      Retirer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default Statistique;
