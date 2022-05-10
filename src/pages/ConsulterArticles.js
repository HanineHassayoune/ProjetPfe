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
import { Box, makeStyles, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import CancelIcon from "@mui/icons-material/Cancel";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { consulterListeArticles } from "../controleurs/ArticleControleurs";
import { deleteArticle } from "../controleurs/ArticleControleurs";
import CircularProgress from "@mui/material/CircularProgress";

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

  //consulter liste des articles
  const [rows, setRows] = useState([]);
  useEffect(() => {
    console.log("use effect here");
    consulterListeArticles().then((snapshot) => {
      console.log(snapshot);
      let values = snapshot.docs.map((doc) => doc.data());
      setLoading(false);
      console.log(values);
      setRows(values);
    });
    console.log("message");
  }, []);

  const [selectId, setSelectId] = useState("");
  //supprimer article
  const supprimerArticle = () => {
    deleteArticle(selectId)
      .then(() => {
        console.log("Document successfully deleted!");
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
                      Id article
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
                      Statut
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
                  {rows.map((row, id) => (
                    <TableRow
                      key={id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align="center">
                        <img src={row.urlImage} width="100" height="60" />
                      </TableCell>
                      <TableCell align="center">{row.id}</TableCell>
                      <TableCell align="center">{row.titreArticle}</TableCell>
                      <TableCell align="center">{row.typeArticle}</TableCell>
                      <TableCell align="center">{row.nomPointVente}</TableCell>
                      <TableCell align="center">{row.nomCommercant}</TableCell>
                      <TableCell align="center">{row.prixInitial}</TableCell>
                      <TableCell align="center">{row.prixActuel}</TableCell>
                      <TableCell align="center">{row.unite}</TableCell>
                      <TableCell align="center">{row.quantite}</TableCell>
                      <TableCell align="center">{row.datevalidite}</TableCell>
                      <TableCell align="center">{row.dateretrait}</TableCell>
                      <TableCell align="center">{row.statut}</TableCell>
                      <TableCell align="center">{row.description}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={(event) => {
                            handleOpen(event, row.id);
                          }}
                        >
                          <DeleteIcon color="primary" />
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
                  ))}
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
                  Vous êtes sur de supprimer ce produit {selectId}!
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
