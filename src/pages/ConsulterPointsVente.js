import * as React from "react";
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
import { useState, useEffect } from "react";
import { consulterListePointsVente } from "../controleurs/PointDeVenteControleur";
import { deletePointVente } from "../controleurs/PointDeVenteControleur";
import FindInPageIcon from "@mui/icons-material/FindInPage";

export default function ConsulterPointsVente() {
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
    consulterListePointsVente().then((snapshot) => {
      console.log(snapshot);
      let values = snapshot.docs.map((doc) => doc.data());
      console.log(values);
      setRows(values);
    });
    console.log("message");
  }, []);

  const [selectId, setSelectId] = useState("");
  //supprimer point vente
  const supprimerPointDeVente = () => {
    deletePointVente(selectId)
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };

  //selectionner id point vente
  const [open, setOpen] = useState(false);
  function handleOpen(event, id) {
    setSelectId(id);
    setOpen(true);
    console.log(id);
  }

  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center" bgcolor="#e3f2fd">
                Id point vente
              </TableCell>
              <TableCell align="center" bgcolor="#e3f2fd">
                Titre point vente
              </TableCell>
              <TableCell align="center" bgcolor="#e3f2fd">
                Aresse point vente
              </TableCell>
              <TableCell align="center" bgcolor="#e3f2fd">
                Email point vente
              </TableCell>
              <TableCell align="center" bgcolor="#e3f2fd">
                Numero téléphone
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
                <TableCell align="center" bgcolor="#e3f2fd">
                  {row.id}
                </TableCell>
                <TableCell align="center">{row.titrePointVente}</TableCell>
                <TableCell align="center">{row.adressePointVente}</TableCell>
                <TableCell align="center">{row.email}</TableCell>
                <TableCell align="center">{row.numerotlf}</TableCell>

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
                      navigate("/modifier/pointvente/" + row.id);
                    }}
                  >
                    <AutorenewIcon color="primary" />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      navigate("/detail/" + row.id);
                    }}
                  >
                    <FindInPageIcon color="primary" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h5" align="center" color="primary">
            <ReportProblemIcon color="error" sx={{ fontSize: 38 }} />
            Vous êtes sur de supprimer cette point de vente {selectId}!
          </Typography>
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            size="large"
            color="error"
            sx={{ margin: 8 }}
            onClick={supprimerPointDeVente}
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
