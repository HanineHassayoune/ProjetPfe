import * as React from "react";
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import { Box, makeStyles, Pagination, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import CancelIcon from "@mui/icons-material/Cancel";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { consulterListeArticlesCurrentUser } from "../controleurs/ArticleControleurs";
import TablePagination from "@mui/material/TablePagination";
import Badge from "@mui/material/Badge";
import {
  deleteArticle,
  deleteArticleFromPointVente,
} from "../controleurs/ArticleControleurs";
import CircularProgress from "@mui/material/CircularProgress";
import { consulterListePointsVenteCurrentUser } from "../controleurs/PointDeVenteControleur";
import {
  getReservationCurrentUser,
  deleteReservation,
} from "../controleurs/ReservationControleur";
import { getConnectedUser } from "../Helpers/FireBase";
import { CompteModel } from "../Models/CompteModel";
import { getUserById } from "../controleurs/CompteControleur";
import TableFooter from "@mui/material/TableFooter";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

//conposant react
export default function ConsulterArticles() {
  const [loading, setLoading] = useState(true);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    height: 250,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const [selectId, setSelectId] = useState("");
  const [user, setUser] = useState();
  const [rows, setRows] = useState([]);
  const [deletedArticle, setDeletedArticle] = useState();
  useEffect(() => {
    console.log("use effect here");
    getConnectedUser().then((_user) => {
      console.log("_user", _user);
      const jsonUser = _user;
      console.log("jsonUser", jsonUser);
      //get user by id
      getUserById(jsonUser.uid).then((snapshot) => {
        let values = snapshot.data();
        setLoading(false);
        const compte = new CompteModel(
          values.id,
          values.nom,
          values.prenom,
          values.type,
          values.email
        );
        setUser(compte);
        console.log("compteUser", compte);
        consulterListeArticlesCurrentUser(_user.uid).then((snapshot) => {
          console.log(snapshot);
          let values = snapshot.docs.map((doc) => doc.data());
          setLoading(false);
          console.log(values);
          setRows(values);
        });
      });
    });
    console.log("message");
  }, []);
  console.log("compte", user);

  //supprimer article from all collection
  const supprimerArticle = () => {
    //consulter liste des point de vente
    consulterListePointsVenteCurrentUser(user.id).then((result) => {
      let listPointVente = result.docs.map((doc) => doc.data());
      console.log("listPointVente", listPointVente);
      const listIdArticles = listPointVente.map((list) => {
        console.log("list idArticles avant filter ", list);
        const result = list.idArticles.filter((element) => selectId != element);
        list.idArticles = result;
        console.log("fresh list", list);
        //delete article from point vente apres suppression article from collection articles
        deleteArticleFromPointVente(list).then((response) =>
          console.log("response", response)
        );
        console.log("list idArticles apres filter", result);
      });
    });
    //get reservation
    getReservationCurrentUser(user.id).then((res) => {
      let listReservation = res.docs.map((doc) => doc.data());
      console.log("listReservation", listReservation);
      const result = listReservation.filter(
        (element) => element.idArticle == selectId
      );
      console.log("Result ", result);
      //supprimer reservation apres delete article
      deleteReservation(result).then((val) => console.log("val", val));
    });
    //delete article from collection articles
    deleteArticle(selectId)
      .then(() => {
        console.log("Document successfully deleted!");
        window.location.reload(true);
        deleteArticleFromPointVente().then((response) => {
          console.log(response);
          console.log("article successfully deleted from ptv!");
        });
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };

  //selectionner id d'article
  const [open, setOpen] = useState(false);
  function handleOpen(event, id) {
    setSelectId(id);
    setOpen(true);
    console.log(id);
  }

  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  const checkStatus = (status) => {
    switch (status) {
      case "Nouveau":
        return "primary";

      case "Disponible":
        return "success";

      case "Perimé":
        return "error";

      case "Retiré":
        return "warning";
    }
  };
  const checkPrix = (prix) => {
    switch (prix) {
      case "Gratuit":
        return "success";
    }
  };

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
          <div>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" bgcolor="#e3f2fd">
                      Image article
                    </TableCell>
                    <TableCell align="center" bgcolor="#e3f2fd">
                      Titre article
                    </TableCell>
                    <TableCell align="center" bgcolor="#e3f2fd">
                      Type article
                    </TableCell>
                    <TableCell align="center" bgcolor="#e3f2fd">
                      Nom point vente
                    </TableCell>
                    <TableCell align="center" bgcolor="#e3f2fd">
                      Nom commerçant
                    </TableCell>
                    <TableCell align="center" bgcolor="#e3f2fd">
                      Prix initial
                    </TableCell>
                    <TableCell align="center" bgcolor="#e3f2fd">
                      Prix actuel
                    </TableCell>
                    <TableCell align="center" bgcolor="#e3f2fd">
                      Unité
                    </TableCell>
                    <TableCell align="center" bgcolor="#e3f2fd">
                      Quantité
                    </TableCell>
                    <TableCell align="center" bgcolor="#e3f2fd">
                      Date de validité
                    </TableCell>
                    <TableCell align="center" bgcolor="#e3f2fd">
                      Date du retrait
                    </TableCell>
                    <TableCell align="center" bgcolor="#e3f2fd">
                      Statut d'article
                    </TableCell>
                    <TableCell align="center" bgcolor="#e3f2fd">
                      Description
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
                          <img src="/emptystock.png" width="100" height="60" />
                        </TableCell>
                        <TableCell align="center">{"Pas de données"}</TableCell>
                        <TableCell align="center">{"Pas de données"}</TableCell>
                        <TableCell align="center">{"Pas de données"}</TableCell>
                        <TableCell align="center">{"Pas de données"}</TableCell>
                        <TableCell align="center">{"Pas de données"}</TableCell>
                        <TableCell align="center">{"Pas de données"}</TableCell>
                        <TableCell align="center">{"Pas de données"}</TableCell>
                        <TableCell align="center">{"Pas de données"}</TableCell>
                        <TableCell align="center">{"Pas de données"}</TableCell>
                        <TableCell align="center">{"Pas de données"}</TableCell>
                        <TableCell align="center">{"Pas de données"}</TableCell>
                        <TableCell align="center">{"Pas de données"}</TableCell>
                        <TableCell align="center">
                          <DeleteIcon color="disabled" />
                          <AutorenewIcon color="disabled" />
                        </TableCell>
                      </TableRow>
                    </>
                  ) : (
                    rows.map((row, id) => (
                      <TableRow
                        key={id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="center">
                          <img src={row.urlImage} width="100" height="60" />
                        </TableCell>
                        <TableCell align="center">{row.titreArticle}</TableCell>
                        <TableCell align="center">{row.typeArticle}</TableCell>
                        <TableCell align="center" bgcolor="#e3f2fd">
                          {row.nomPointVente}
                        </TableCell>
                        <TableCell align="center">
                          {row.nomCommercant}
                        </TableCell>
                        <TableCell align="center">
                          {row.prixInitial == "0" ? (
                            <Badge
                              badgeContent={"Gratuit"}
                              color={checkPrix("Gratuit")}
                            ></Badge>
                          ) : (
                            row.prixInitial
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {row.prixActuel == "0" ? (
                            <Badge
                              badgeContent={"Gratuit"}
                              color={checkPrix("Gratuit")}
                            ></Badge>
                          ) : (
                            row.prixActuel
                          )}
                        </TableCell>
                        <TableCell align="center">{row.unite}</TableCell>
                        <TableCell align="center" bgcolor="#e3f2fd">
                          {row.quantite}
                        </TableCell>
                        <TableCell align="center">{row.datevalidite}</TableCell>
                        <TableCell align="center">{row.dateretrait}</TableCell>
                        <TableCell align="center" bgcolor="#e3f2fd">
                          <Badge
                            badgeContent={row.statut}
                            color={checkStatus(row.statut)}
                          ></Badge>
                        </TableCell>
                        <TableCell align="center">{row.description}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            onClick={(event) => {
                              handleOpen(event, row.id);
                            }}
                            disabled={
                              parseInt(row.quantite) === 0 ? false : true
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              navigate("/modifier/article/" + row.id);
                            }}
                          >
                            <AutorenewIcon color="primary" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Modal
              //selectedId={selectId}
              keepMounted
              open={open}
              onClose={handleClose}
              aria-labelledby="keep-mounted-modal-title"
              aria-describedby="keep-mounted-modal-description"
            >
              <Box sx={style}>
                <Typography variant="h5" align="center" color="primary">
                  <ReportProblemIcon color="error" sx={{ fontSize: 38 }} />
                  Vous êtes sur de supprimer ce produit !
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  size="large"
                  color="error"
                  sx={{ margin: 8 }}
                  onClick={() => {
                    supprimerArticle();
                    handleClose();
                  }}
                >
                  supprimer
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  size="large"
                  color="success"
                  onClick={handleClose}
                >
                  Annuler
                </Button>
              </Box>
            </Modal>
          </div>
        </>
      )}
    </>
  );
}
