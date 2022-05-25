import React from "react";
//import Paper from "@material-ui/core/Paper";
import Paper from "@mui/material/Paper";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import PieChart from "./PieChart";
import { UserData } from "./Data";
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
  updateArticle,
} from "../controleurs/ArticleControleurs";
import { getListPointVenteByListId } from "../controleurs/PointDeVenteControleur";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import { updateReservation } from "../controleurs/ReservationControleur";
import { Button } from "@mui/material";
import { getConnectedUser } from "../Helpers/FireBase";
import { consulterListeArticlesCurrentUser } from "../controleurs/ArticleControleurs";
const Statistique = () => {
  const [rows, setRows] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

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
        statut: _quantiteDispo == 0 ? "Retiré" : "Disponible",
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
  // les Batons : quantité se réservation en fonctions des dates
  const [userData, setUserData] = useState({
    labels: [],
    datasets: [
      {
        label: "",
        data: [],
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });

  //Cercle : quantité d'article par chaque type
  const [cercleData, setCercleData] = useState({
    labels: [],
    datasets: [
      {
        label: "",
        data: [],
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });

  useEffect(() => {
    console.log("use effect here ");
    getConnectedUser().then((_user) => {
      setLoading(false);
      // get list reservations
      if (rows.length == 0) {
        getReservationCurrentUser(_user.uid).then((response) => {
          console.log(response);
          if (response.empty) return;
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

                  let ListIdPtv = _reservations.map((res) => res.idPointVente);
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
                      const Data = _rows.map((elem) => ({
                        id: elem.idReservation,
                        date: elem.dateReservation,
                        quantite: elem.quantiteReserve,
                      }));
                      console.log(Data);
                      setUserData({
                        labels: Data.map((data) => data.date),
                        datasets: [
                          {
                            label: "Quantité réservée par jour",
                            data: Data.map((data) => data.quantite),
                            backgroundColor: [
                              "rgba(75,192,192,1)",
                              "#ecf0f1",
                              "#50AF95",
                              "#f3ba2f",
                              "#2a71d0",
                            ],
                            borderColor: "black",
                            borderWidth: 2,
                          },
                        ],
                      });
                    }
                  );
                }
              );
            }
          );
        });
        consulterListeArticlesCurrentUser(_user.uid)
          .then((articles) => {
            let values = articles.docs.map((doc) => doc.data());
            console.log("values", values);
            setArticles(values);
            const DataType = values.map((elem) => ({
              id: elem.id,
              type: elem.typeArticle,
              quantite: parseInt(elem.quantite),
            }));
            console.log("DataType", DataType);
            setCercleData({
              labels: DataType.map((data) => data.type),
              datasets: [
                {
                  label: "Type d'article par quantité",
                  data: DataType.map((data) => data.quantite),
                  backgroundColor: [
                    "rgba(75,192,192,1)",
                    "#ecf0f1",
                    "#50AF95",
                    "#f3ba2f",
                    "#2a71d0",
                  ],
                  borderColor: "black",
                  borderWidth: 2,
                },
              ],
            });
          })
          .catch((error) => {
            console.error("Error : ", error);
          });
      }
    });
  }, [rows.length]);

  return (
    <>
      {loading ? (
        <>
          <Typography
            variant="h4"
            color="primary"
            sx={{ fontFamily: "cursive" }}
          >
            Loading <CircularProgress />
          </Typography>
        </>
      ) : (
        <>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            {/* Les batons*/}
            <Grid item xs={12} sm={6}>
              <BarChart chartData={userData} />
            </Grid>
            {/* courbe*/}
            <Grid item xs={12} sm={6}>
              <LineChart chartData={cercleData} />
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
                      {/*<TableCell align="center" bgcolor="#e3f2fd">
                        Id réservation
                      </TableCell>*/}
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
                        <TableCell align="center">
                          {row.quantiteArticle}
                        </TableCell>
                        <TableCell align="center">
                          {row.quantiteReserve}
                        </TableCell>
                        <TableCell align="center">
                          {row.titrePointVente}
                        </TableCell>
                        <TableCell align="center">
                          {row.statutReservation}
                        </TableCell>
                        <TableCell align="center">
                          {row.dateReservation}
                        </TableCell>
                        {/*<TableCell align="center">
                          {row.idReservation}
                      </TableCell>*/}
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
            {/* Cercle*/}
            <Grid item xs={12}>
              <div style={{ width: 500 }}>
                <PieChart chartData={cercleData} />
              </div>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default Statistique;
