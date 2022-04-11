import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useState } from "react";
import { ajouterPointVente } from "../controleurs/PointDeVenteControleur";

const theme = createTheme();

export default function AjouterPointVente() {
  const [errors, setErrors] = useState({
    titrePointVente: "",
    email: "",
    adressePointVente: "",
    numerotlf: "",
  });

  const pattern = new RegExp("^[a-zA-Z0-9]+@[a-zA-Z0-9]+[.][A-Za-z]+$");
  const regNom = new RegExp("^[a-zA-Z]+[a-zA-Z]+$");
  const regNum = new RegExp("^[0-9\b]+$");
  //validation formulaire
  const isFormValid = (data) => {
    const _errors = { ...errors };
    if (!data.titrePointVente) {
      _errors.titrePointVente = "Titre est obligatoire";
    } else if (!regNom.test(data.titrePointVente)) {
      _errors.titrePointVente = "Le titre doit contenir seulement des lettres";
    } else _errors.titrePointVente = "";

    if (!data.email) {
      _errors.email = "Email est obligatoire";
    } else if (!pattern.test(data.email)) {
      _errors.email = "Vérifier votre email";
    } else _errors.email = "";

    if (!data.adressePointVente) {
      _errors.adressePointVente = "Adresse est obligatoire";
    } else if (!regNom.test(data.adressePointVente)) {
      _errors.adressePointVente =
        "Le titre doit contenir seulement des lettres";
    } else _errors.adressePointVente = "";

    if (!data.numerotlf) {
      _errors.numerotlf = "Numero téléphone est obligatoire";
    } else if (!regNum.test(data.numerotlf)) {
      _errors.numerotlf = "Le numéro doit contenir seulement des chiffres";
    } else if (!data.numerotlf.length === 8) {
      _errors.numerotlf = "Le numéro doit contenir 8 chiffres";
    } else _errors.numerotlf = "";

    setErrors(_errors);
    if (Object.values(_errors).filter((item) => item).length === 0) {
      return true;
    } else return false;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const dataValues = {
      titrePointVente: data.get("titrePointVente"),
      email: data.get("email"),
      adressePointVente: data.get("adressePointVente"),
      numerotlf: data.get("numerotlf"),
    };
    if (isFormValid(dataValues)) {
      console.log("form valid");
      ajouterPointVente(dataValues)
        .then(() => {
          console.log("point de vente est ajouté");
          console.log("______ ", dataValues);
        })
        .catch(() => {
          console.log("something went wrong !! ");
        });
    } else console.log("form nom valid");
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <StorefrontIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Nouveau point vente
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
              id="titrePointVente"
              label="Titre point vente"
              name="titrePointVente"
              autoComplete="titrePointVente"
              error={errors.titrePointVente ? true : false}
              helperText={errors.titrePointVente}
              autoFocus
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="adressePointVente"
              label="Adresse point vente"
              name="adressePointVente"
              error={errors.adressePointVente ? true : false}
              helperText={errors.adressePointVente}
              autoComplete="adressePointVente"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email"
              type="email"
              id="email"
              error={errors.email ? true : false}
              helperText={errors.email}
              autoComplete="email"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="numerotlf"
              label="Numéro téléphone"
              name="numerotlf"
              error={errors.numerotlf ? true : false}
              helperText={errors.numerotlf}
              autoComplete="numerotlf"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Ajouter
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
