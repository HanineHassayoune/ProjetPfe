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
import { getContacts, updateContacts } from "../controleurs/ContactsControleur";
import { Button, Grid } from "@mui/material";
import { Avatar } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
const theme = createTheme();

export default function Checkout() {
  const [contact, setContact] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.log("use effect here");
    getContacts()
      .then((_contacts) => {
        console.log("_contacts", _contacts);
        let values = _contacts.docs.map((doc) => doc.data());
        console.log("values", values);
        setContact(values);
        setLoading(false);
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
    updateContacts(_contact).then(() => {
      console.log("contact after update", _contact);
    });
  };

  const checkStatus = (status) => {
    switch (status) {
      case "à traiter":
        return "warning";

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
                Réclamations :
              </Typography>
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
            </Paper>
          </React.Fragment>
        </>
      )}
    </>
  );
}
