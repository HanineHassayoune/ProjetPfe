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

function createData(titre, adresse, email, numerotlf) {
  return { titre, adresse, email, numerotlf };
}

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

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const navigate = useNavigate();
  const rows = [
    createData("PointVente1", "Rue1", "exemple1@gmail.com", 73256978),
    createData("PointVente2", "Rue2", "exemple2@gmail.com", 75896412),
    createData("PointVente3", "Rue3", "exemple3@gmail.com", 74521369),
    createData("PointVente4", "Rue4", "exemple4@gmail.com", 79563214),
  ];
  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Points de vente</TableCell>
              <TableCell align="right">Adresse</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Numero téléphone</TableCell>
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
                <TableCell align="right">{row.adresse}</TableCell>
                <TableCell align="right">{row.email}</TableCell>
                <TableCell align="right">{row.numerotlf}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={handleOpen}>
                    <DeleteIcon color="primary" />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      navigate("/modifier/pointvente");
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
          <Typography variant="h6" align="center" color="primary">
            <ReportProblemIcon color="error" sx={{ fontSize: 38 }} />
            Vous êtes sur de supprimer cet point de vente !
          </Typography>
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            size="large"
            color="error"
            sx={{ margin: 8 }}
            onClick={() => {
              console.log("supprimer", rows.localisation);
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
  );
}
