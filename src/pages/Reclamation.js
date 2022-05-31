import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Fab from "@mui/material/Fab";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  getReclamationByListIdPtv,
  getReclamation,
  updateReclamation,
} from "../controleurs/ReclamationControleur";
import { Button, Grid } from "@mui/material";
import { Avatar } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { getListPointVenteByListId } from "../controleurs/PointDeVenteControleur";
import { getConnectedUser } from "../Helpers/FireBase";
import { consulterListePointsVenteCurrentUser } from "../controleurs/PointDeVenteControleur";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

const theme = createTheme();

export default function Checkout() {
  const [contact, setContact] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.log("use effect here");
    getConnectedUser()
      .then((_user) => {
        setLoading(false);
        //consulter liste des points de vente current user
        consulterListePointsVenteCurrentUser(_user.uid).then((_result) => {
          let listPtvCurrentUset = _result.docs.map((doc) => doc.data());
          console.log("listPtvCurrentUset", listPtvCurrentUset);
          let listIdPtvCurrentUser = _result.docs.map((doc) => doc.data().id);
          console.log("listIdPtvCurrentUser", listIdPtvCurrentUser);
          // get reclamation à partir des points de vente du current user
          getReclamationByListIdPtv(listIdPtvCurrentUser).then((_response) => {
            let values = _response.docs.map((doc) => doc.data());
            console.log("values", values);
            setContact(values);
          });
        });
      })
      .catch((error) => {
        console.error("Error : ", error);
      });
  }, []);
  console.log("contact use effect", contact);
  const handleChange = (event, contact) => {
    event.preventDefault();
    const _contact = {
      idContact: contact.idContact,
      email: contact.email,
      message: contact.message,
      //statut: contact.statut,
      statut: "traité",
    };
    console.log("_contact here", _contact);
    updateReclamation(_contact).then(() => {
      console.log("contact after update", _contact);
      window.location.reload(true);
    });
  };

  const checkStatus = (status) => {
    switch (status) {
      case "à traiter":
        return "info";

      case "traité":
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
          <React.Fragment>
            <CssBaseline />
            <Paper square sx={{ pb: "50px" }} elevation={10}>
              <Typography
                color="#002984"
                variant="h4"
                gutterBottom
                component="div"
                sx={{ p: 2, pb: 0 }}
              >
                Réclamations
              </Typography>
              <>
                {contact.length > 0 ? (
                  <>
                    <List sx={{ mb: 2 }}>
                      {contact.map(({ idContact, email, message, statut }) => (
                        <React.Fragment key={idContact}>
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: "primary.main" }}>
                                {email.charAt(0)}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={email} secondary={message} />
                            <Button
                              variant="contained"
                              onClick={(event) =>
                                handleChange(event, {
                                  idContact,
                                  email,
                                  message,
                                  statut,
                                })
                              }
                              color={checkStatus(statut)}
                            >
                              {statut}
                            </Button>
                          </ListItem>
                        </React.Fragment>
                      ))}
                    </List>
                  </>
                ) : (
                  <>
                    <Typography align="center" variant="h6">
                      <SentimentDissatisfiedIcon />
                      Pas de réclamation
                    </Typography>
                  </>
                )}
              </>
            </Paper>
          </React.Fragment>
        </>
      )}
    </>
  );
}
