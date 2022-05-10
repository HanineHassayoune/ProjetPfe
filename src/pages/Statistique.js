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
import { getReservation } from "../controleurs/ReservationControleur";
import { getListClientByListId } from "../controleurs/CompteControleur";
import { getListArticlesByListId } from "../controleurs/ArticleControleurs";
import { getListPointVenteByListId } from "../controleurs/PointDeVenteControleur";

const Statistique = () => {
  const [client, setClient] = useState([]);
  const [article, setArticle] = useState([]);

  const [ptv, setPtv] = useState([]);

  const [rows, setRows] = useState([]);
  // Sample data
  const data = [
    { argument: "Lundi", value: 10 },
    { argument: "Mardi", value: 10 },
    { argument: "Mercredi", value: 10 },
    { argument: "Jeudi", value: 20 },
    { argument: "Vendredi", value: 10 },
    { argument: "Samedi", value: 10 },
    { argument: "Dimanche", value: 20 },
  ];
  const _data = [
    { argument: "Monday", value: 30 },
    { argument: "Tuesday", value: 20 },
    { argument: "Wednesday", value: 10 },
    { argument: "Thursday", value: 50 },
    { argument: "Friday", value: 60 },
  ];
  useEffect(() => {
    console.log("use effect here ");
    getReservation()
      .then((response) => {
        let reservation = response.docs.map((doc) => doc.data());
        console.log("reservation", reservation);

        let ListIdClients = reservation.map((res) => res.idClient);
        console.log("ListIdClients", ListIdClients);
        getListClientByListId(ListIdClients).then((snapshot) => {
          let listClients = snapshot.docs.map((doc) => doc.data());
          console.log("listClients", listClients);
          setClient(listClients);
          console.log("client", client);
        });
        let ListIdArticles = reservation.map((res) => res.idArticle);
        console.log("ListIdArticles", ListIdArticles);

        /*
        getListArticlesByListId(ListIdArticles).then((snapshot) => {
          let listArticles = snapshot.docs.map((doc) => doc.data());
          console.log("listArticles", listArticles);
          setArticle(listArticles);
          console.log("article", article);
        });
        let ListIdPtv = reservation.map((res) => res.idPointVente);
        console.log("ListIdPtv", ListIdPtv);



        getListPointVenteByListId(ListIdPtv).then((snapshot) => {
          let listPtv = snapshot.docs.map((doc) => doc.data());
          console.log("listPtv", listPtv);
          setPtv(listPtv);
          console.log("ptv", ptv);
        });*/
      })
      .catch((error) => {
        console.error("Error : ", error);
      });
  }, []);

  return (
    <>
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
            <Chart data={_data}>
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
                    Quantité article
                  </TableCell>
                  <TableCell align="center" bgcolor="#e3f2fd">
                    Nombre de reservation
                  </TableCell>
                  <TableCell align="center" bgcolor="#e3f2fd">
                    Titre point vente
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {client.map((row, id) => (
                  <TableRow
                    key={id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">{row.email}</TableCell>
                  </TableRow>
                ))}
                {article.map((row, id) => (
                  <TableRow
                    key={id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">{row.titreArticle}</TableCell>
                    <TableCell align="center">{row.quantite}</TableCell>
                  </TableRow>
                ))}
                {ptv.map((row, id) => (
                  <TableRow
                    key={id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">{row.titrePointVente}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default Statistique;
