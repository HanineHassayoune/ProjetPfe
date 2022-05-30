import React from "react";
import Paper from "@mui/material/Paper";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import PieChart from "./PieChart";
import { Card, Grid } from "@mui/material";
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
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Avatar } from "@mui/material";
import { getCommentairesCurrentUser } from "../controleurs/CommentaireControleur";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
const Statistique = () => {
  const [rows, setRows] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentaires, setCommentaires] = useState([]);

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
  const [degreData, setDegreData] = useState({
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

  const checkDegre = (_degre) => {
    switch (_degre) {
      case "3":
        return <SentimentVerySatisfiedIcon sx={{ color: "red" }} />;

      case "2":
        return <SentimentSatisfiedAltIcon sx={{ color: "green" }} />;

      case "1":
        return <SentimentVeryDissatisfiedIcon sx={{ color: "blue" }} />;
    }
  };

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
                      //trasage de la courbe des reservations en fonction des dates
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
                              "#757e8",
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
        //tracage du cercle : les types des articles en fonction des quantités
        consulterListeArticlesCurrentUser(_user.uid)
          .then((articles) => {
            let valuesDesArticles = articles.docs.map((doc) => doc.data());
            console.log("valuesDesArticles", valuesDesArticles);
            setArticles(valuesDesArticles);
            let ListDesIdArticles = articles.docs.map(
              (doc) => doc.data().typeArticle
            );
            let newList = [...new Set(ListDesIdArticles)];
            console.log(" newList sans redandance", newList);
            let DataType = [];
            newList.map((element) => {
              let cercleObject = {
                typeArticle: "",
                quantite: 0,
              };
              valuesDesArticles.map((currentElement) => {
                if (element == currentElement.typeArticle) {
                  cercleObject.quantite =
                    cercleObject.quantite + parseInt(currentElement.quantite);
                  cercleObject.typeArticle = currentElement.typeArticle;
                }
              });
              DataType.push(cercleObject);
            });
            console.log("DataType", DataType);

            setCercleData({
              labels: DataType.map((data) => data.typeArticle),
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
                    "#002984",
                  ],
                  borderColor: "black",
                  borderWidth: 2,
                },
              ],
            });
            // trasage du courbe des degres de satisfaction pour chaque point de vente
            getCommentairesCurrentUser(_user.uid).then((_commentaires) => {
              // test contient la  liste des commentaires filter idPtv
              let test = _commentaires.docs.map(
                (element) => element.data().idPtv
              );
              console.log("***test***", test);
              let newTest = [...new Set(test)];
              console.log("***newTest***", newTest);

              //get liste des commentaires
              let values = _commentaires.docs.map((doc) => doc.data());
              console.log("values des commentaires", values);
              let cleanStat = [];
              newTest.map((currentElement) => {
                let objectStat = {
                  titre: "",
                  satisfait: 0,
                  pasSatisfait: 0,
                  tresSatisfait: 0,
                };
                // else ???
                values.map((element) => {
                  if (element.idPtv == currentElement) {
                    objectStat.titre = element.titrePointVente;
                    if (element.degreDeSatisfaction === "3") {
                      objectStat.tresSatisfait += 1;
                    } else if (element.degreDeSatisfaction === "2") {
                      objectStat.satisfait += 1;
                    } else if (element.degreDeSatisfaction === "1")
                      objectStat.pasSatisfait += 1;
                  }
                });
                cleanStat.push(objectStat);
                console.log("***cleanStat***", cleanStat);
              });
              let fullDataSet = [];
              cleanStat.map((element) => {
                let dataSet = {
                  label: "Degré de satisfaction pour" + " " + element.titre,
                  data: [
                    element.satisfait,
                    element.tresSatisfait,
                    element.pasSatisfait,
                  ],
                  backgroundColor: [
                    "rgba(75,192,192,1)",
                    "#ecf0f1",
                    "#50AF95",
                    "#f3ba2f",
                    "#2a71d0",
                    "#002984",
                  ],
                  borderColor: "black",
                  borderWidth: 2,
                };
                //array contient tous les data ===> tous les ligne qui seront afficher dans la courbe
                fullDataSet.push(dataSet);
                console.log("***fullDataSet***", fullDataSet);
              });
              console.log("hassayoune", cleanStat);
              // begin stats

              setDegreData({
                labels: ["Satisfait", "Trés satisfait", "Pas satisfait"],
                datasets: fullDataSet,
              });

              //end stats
              console.log("ID ptv", test);

              console.log("commentaires", values);
              setCommentaires(values);
              let degreSatisfaction = _commentaires.docs.map(
                (doc) => doc.data().degreDeSatisfaction
              );
              console.log("degreSatisfaction", degreSatisfaction);

              setDegreData({
                labels: ["Satisfait", "Trés satisfait", "Pas satisfait"],
                datasets: fullDataSet,
              });
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
            spacing={4}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={12}>
              <Typography variant="h5" color="#002984">
                1-Tableau des réservations pour chaque client :
              </Typography>
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
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {rows.length == 0 ? (
                      <>
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell align="center">
                            <img
                              src="/emptystock.png"
                              width="100"
                              height="60"
                            />
                          </TableCell>
                          <TableCell align="center">
                            {"Pas de données"}
                          </TableCell>
                          <TableCell align="center">
                            {"Pas de données"}
                          </TableCell>
                          <TableCell align="center">
                            {"Pas de données"}
                          </TableCell>
                          <TableCell align="center">
                            {"Pas de données"}
                          </TableCell>
                          <TableCell align="center">
                            {"Pas de données"}
                          </TableCell>
                          <TableCell align="center">
                            {"Pas de données"}
                          </TableCell>
                          <TableCell align="center">
                            <Button variant="contained" disabled>
                              {" "}
                              Retirer
                            </Button>
                          </TableCell>
                        </TableRow>
                      </>
                    ) : (
                      <>
                        {rows.map((row, id) => (
                          <TableRow
                            key={id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell align="center">
                              {row.emailClient}
                            </TableCell>
                            <TableCell align="center">
                              {row.titreArticle}
                            </TableCell>
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
                            <TableCell align="center">
                              <Button
                                variant="contained"
                                onClick={(event) => {
                                  handleChange(event, row);
                                }}
                                disabled={
                                  parseInt(row.quantiteArticle) > 0
                                    ? false
                                    : true
                                }
                              >
                                Retirer
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            {/* Cercle*/}
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" color="#002984">
                2-Diagramme circulaire : réprésente la quantité de chaque
                article par type .
              </Typography>
              <div style={{ width: 400 }}>
                <PieChart chartData={cercleData} />
              </div>
            </Grid>
            {/* Les batons*/}
            <Grid item xs={12} sm={6}>
              <div style={{ width: 600 }}>
                <BarChart chartData={userData} />
              </div>
              <Typography variant="h6" color="#002984">
                3-Diagramme en bâtons : répresente la quantité réservée par
                chaque client en fonction du date .
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" color="#002984">
                4-Tableau des commentaires pour chaque client :
              </Typography>
              <Paper square sx={{ pb: "50px" }} elevation={5}>
                <Typography
                  color="#002984"
                  variant="h4"
                  gutterBottom
                  component="div"
                  sx={{ p: 2, pb: 0 }}
                >
                  Avis des clients :
                </Typography>
                {commentaires.length == 0 ? (
                  <>
                    <Typography align="center" variant="h6">
                      <SentimentDissatisfiedIcon />
                      Pas d'avis
                    </Typography>
                  </>
                ) : (
                  <>
                    <List sx={{ mb: 2 }}>
                      {commentaires.map(
                        ({
                          idCommentaire,
                          emailClient,
                          commentaire,
                          titrePointVente,
                          degreDeSatisfaction,
                        }) => (
                          <React.Fragment key={idCommentaire}>
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar sx={{ bgcolor: "primary.main" }}>
                                  {emailClient.charAt(0)}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={emailClient}
                                secondary={commentaire}
                              />
                              <ListItemText
                                secondary={checkDegre(degreDeSatisfaction)}
                              />
                              <Typography
                                variant="h5"
                                color="#9c27b0
"
                              >
                                {titrePointVente}
                              </Typography>
                            </ListItem>
                          </React.Fragment>
                        )
                      )}
                    </List>
                  </>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} color="#002984">
              <Typography variant="h6">
                5-Courbe : répresente la satisfaction des clients par chaque
                point de vente .
              </Typography>
              <div style={{ width: 1000 }}>
                {/*<LineChart chartData={degreData} />*/}
                <BarChart chartData={degreData} />
              </div>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default Statistique;
