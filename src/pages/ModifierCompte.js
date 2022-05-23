import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { updateCompte, getUserById } from "../controleurs/CompteControleur";
import { CompteModel } from "../Models/CompteModel";
import { getConnectedUser } from "../Helpers/FireBase";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ModifierCompte() {
  const regNum = new RegExp("^[0-9\b]+$");
  const [loading, setLoading] = useState(true);
  const theme = createTheme();
  const [errors, setErrors] = useState({
    nom: "",
    prenom: "",
    type: "",
    email: "",
    numerotlf: "",
    password: "",
  });

  const [user, setUser] = useState({
    nom: "",
    prenom: "",
    type: "",
    email: "",
    numerotlf: "",
  });

  //validation formulaire
  const regNom = new RegExp("^[a-zA-Z]+ [a-zA-Z]+|[a-zA-Z]+$");

  const isFormValid = (user) => {
    const _errors = { ...errors };
    //verifier nom
    if (!user.nom) {
      _errors.nom = "Le nom est obligatoire";
    } else if (!regNom.test(user.nom)) {
      _errors.nom = "Le nom doit contenir seulement des lettres";
    } else _errors.nom = "";
    //verifier prenom
    if (!user.prenom) {
      _errors.prenom = "Le prenom est obligatoire";
    } else if (!regNom.test(user.prenom)) {
      _errors.prenom = "Le prenom doit contenir seulement des lettres";
    } else _errors.prenom = "";

    //verifier numero tlf
    if (!user.numerotlf) {
      _errors.numerotlf = "Le numero téléphone est obligatoire";
    } else if (!regNum.test(user.numerotlf)) {
      _errors.numerotlf =
        "Le numero téléphone doit contenir seulement des chiffres";
    } else if (user.numerotlf.length != 8) {
      _errors.numerotlf = "Le numero téléphone doit contenir 8 chiffres";
    } else _errors.numerotlf = "";
    /* if (!user.password) {
      _errors.password = "Le mots de passe est obligatoire";
    } else if (user.password.length < 6) {
      _errors.password = "Mots de passe doit etre superieure 6";
    } else _errors.password = "";*/
    setErrors(_errors);
    if (Object.values(_errors).filter((item) => item).length === 0) {
      return true;
    } else return false;
  };

  useEffect(() => {
    console.log("use effect here");
    //get connected user
    getConnectedUser().then((_user) => {
      console.log("_user", _user);
      const jsonUser = _user;
      console.log("jsonUser", jsonUser);
      //get user by id
      getUserById(jsonUser.uid)
        .then((snapshot) => {
          let values = snapshot.data();
          setLoading(false);
          const compte = new CompteModel(
            values.id,
            values.nom,
            values.prenom,
            values.type,
            values.email,
            values.numerotlf
          );
          setUser(compte);
          console.log("compteUser", compte);
        })
        .catch((error) => {
          console.error("Error : ", error);
        });
    });
  }, []);

  const [open, setOpen] = useState(false);
  const handleClickSuccess = () => {
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  // handleChange values of user
  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };
  //handle submit form after validation
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("user 123 ", user);
    if (isFormValid(user)) {
      updateCompte(user);
      handleClickSuccess();
      //window.location.reload(true);
      //alert("votre compte est modifié avec succès");
      console.log("user after update", user);
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
          <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <Box
                sx={{
                  marginTop: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                  <StorefrontIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Modifier compte
                </Typography>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  sx={{ mt: 1 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="nom"
                    label="Nom"
                    name="nom"
                    autoComplete="nom"
                    error={errors.nom ? true : false}
                    helperText={errors.nom}
                    autoFocus
                    value={user.nom}
                    onChange={(e) => handleChange(e)}
                  />

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="prenom"
                    label="Prénom"
                    type="prenom"
                    id="prenom"
                    autoComplete="prenom"
                    error={errors.prenom ? true : false}
                    helperText={errors.prenom}
                    value={user.prenom}
                    onChange={(e) => handleChange(e)}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="numerotlf"
                    label="Numero téléphone"
                    type="numerotlf"
                    id="numerotlf"
                    error={errors.numerotlf ? true : false}
                    helperText={errors.numerotlf}
                    value={user.numerotlf}
                    onChange={(e) => handleChange(e)}
                  />

                  <TextField
                    margin="normal"
                    fullWidth
                    name="email"
                    label="Email"
                    type="email"
                    id="email"
                    disabled
                    value={user.email}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Modifier
                  </Button>
                  <Stack spacing={2} sx={{ width: "100%" }}>
                    <Snackbar
                      open={open}
                      autoHideDuration={6000}
                      onClose={handleClose}
                    >
                      <Alert
                        onClose={handleClose}
                        severity="success"
                        sx={{ width: "100%" }}
                      >
                        Votre compte est modifié avec succès!
                      </Alert>
                    </Snackbar>
                  </Stack>
                </Box>
              </Box>
            </Container>
          </ThemeProvider>
        </>
      )}
    </>
  );
}
