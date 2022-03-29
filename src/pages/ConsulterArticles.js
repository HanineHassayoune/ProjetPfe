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

function createData(
  titre,
  prixinitial,
  prixactuactuel,
  unite,
  quantite,
  datevalidite,
  dateretrait,
  statut
) {
  return {
    titre,
    prixinitial,
    prixactuactuel,
    unite,
    quantite,
    datevalidite,
    dateretrait,
    statut,
  };
}

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

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();
  const rows = [
    createData(
      "Produit 1",
      "50",
      "24",
      "2",
      "Kg",
      "27/03/2022",
      "20/03/2022",
      "reservé"
    ),
    createData(
      "Produit 2",
      "237",
      "9.0",
      "2",
      "L",
      "28/03/2022",
      "20/03/2022",
      "disponible"
    ),
    createData(
      "Produit 3",
      "16",
      "10",
      "3",
      "L",
      "29/03/2022",
      "20/03/2022",
      "disponible"
    ),
    createData(
      "Produit 4",
      "23",
      "12",
      "4",
      "Kg",
      "30/03/2022",
      "20/03/2022",
      "disponible"
    ),
    createData(
      "Produit 5",
      "233",
      "49",
      "1",
      "Kg",
      "31/03/2022",
      "20/03/2022",
      "perimé"
    ),
  ];

  console.log(rows);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Articles</TableCell>
              <TableCell align="right">Prix initial</TableCell>
              <TableCell align="right">Prix actuel</TableCell>
              <TableCell align="right">Quantité</TableCell>
              <TableCell align="right">Unité</TableCell>
              <TableCell align="right">Date de validité</TableCell>
              <TableCell align="right">Date du retrait</TableCell>
              <TableCell align="right">Statut</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.titre}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.titre}
                </TableCell>
                <TableCell align="right">{row.prixinitial}</TableCell>
                <TableCell align="right">{row.prixactuactuel}</TableCell>
                <TableCell align="right">{row.quantite}</TableCell>
                <TableCell align="right">{row.unite}</TableCell>
                <TableCell align="right">{row.datevalidite}</TableCell>
                <TableCell align="right">{row.dateretrait}</TableCell>
                <TableCell align="right">{row.statut}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={handleOpen}>
                    <DeleteIcon color="primary" />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      navigate("/modifier/article");
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
