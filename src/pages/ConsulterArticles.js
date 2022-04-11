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

/*function createData(
  id,
  titreArticle,
  nomPointVente,
  nomCommercant,
  prixinitial,
  prixactuactuel,
  unite,
  quantite,
  datevalidite,
  dateretrait,
  statut,
  description
) {
  return {
    id,
    titreArticle,
    nomPointVente,
    nomCommercant,
    prixinitial,
    prixactuactuel,
    unite,
    quantite,
    datevalidite,
    dateretrait,
    statut,
    description,
  };
}*/

//conposant react
export default function ConsulterArticles() {
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

  /*const rows = [
    createData(
      "Produit 2",
      "BBBB",
      "Mohamed",
      "237",
      "9.0",
      "2",
      "L",
      "28/03/2022",
      "20/03/2022",
      "disponible",
      "kgfjhoirfjoi"
    ),
  ];*/

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right"> Id article</TableCell>
              <TableCell align="right"> Titre article</TableCell>
              <TableCell align="right">Nom point vente</TableCell>
              <TableCell align="right">Nom commerçant</TableCell>
              <TableCell align="right">Prix initial</TableCell>
              <TableCell align="right">Prix actuel</TableCell>
              <TableCell align="right">Unité</TableCell>
              <TableCell align="right">Quantité</TableCell>
              <TableCell align="right">Date de validité</TableCell>
              <TableCell align="right">Date du retrait</TableCell>
              <TableCell align="right">Statut</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, id) => (
              <TableRow
                key={id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {/*<TableCell component="th" scope="row">
                  {row.id}
            </TableCell>*/}
                <TableCell align="right">{row.id}</TableCell>
                <TableCell align="right">{row.titreArticle}</TableCell>
                <TableCell align="right">{row.nomPointVente}</TableCell>
                <TableCell align="right">{row.nomCommercant}</TableCell>
                <TableCell align="right">{row.prixInitial}</TableCell>
                <TableCell align="right">{row.prixActuel}</TableCell>
                <TableCell align="right">{row.unite}</TableCell>
                <TableCell align="right">{row.quantite}</TableCell>
                <TableCell align="right">{row.datevalidite}</TableCell>
                <TableCell align="right">{row.dateretrait}</TableCell>
                <TableCell align="right">{row.statut}</TableCell>
                <TableCell align="right">{row.description}</TableCell>
                <TableCell align="right">
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
            onClick={supprimerArticle}
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
  );
}
