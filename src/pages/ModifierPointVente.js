import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useState } from "react";

const theme = createTheme();

export default function ModifierPointVente() {
  const [errors, setErrors] = useState({
    titrePointVente: "",
    email: "",
    adresse: "",
    numerotlf: "",
    idPointVente: "",
  });
  const pattern = new RegExp("^[a-zA-Z0-9]+@[a-zA-Z0-9]+[.][A-Za-z]+$");
  const regNom = new RegExp("^[a-zA-Z]+[a-zA-Z]+$");
  const regNum = new RegExp("^[0-9\b]+$");

  const isFormValid = (data) => {
    const _errors = { ...errors };
    if (!data.idPointVente) {
      _errors.idPointVente = "Id est obligatoire";
    } else _errors.idPointVente = "";

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

    if (!data.adresse) {
      _errors.adresse = "Adresse est obligatoire";
    } else if (!regNom.test(data.adresse)) {
      _errors.adresse = "Le titre doit contenir seulement des lettres";
    } else _errors.adresse = "";

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
      adresse: data.get("adresse"),
      idPointVente: data.get("idPointVente"),
      email: data.get("email"),
      numerotlf: data.get("numerotlf"),
    };
    if (isFormValid(dataValues)) {
      console.log("form valid");
    } else console.log("form nom valid");
  };

  return (
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
            Modifier point de vente
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
              id="idPointVente"
              label="Id point de vente"
              name="idPointVente"
              autoComplete="idPointVente"
              autoFocus
              error={errors.idPointVente ? true : false}
              helperText={errors.idPointVente}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="titrePointVente"
              label="Titre point de vente"
              name="titrePointVente"
              autoComplete="titrePointVente"
              error={errors.titrePointVente ? true : false}
              helperText={errors.titrePointVente}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="adresse"
              label="Adresse"
              type="adresse"
              id="adresse"
              autoComplete="adresse"
              error={errors.adresse ? true : false}
              helperText={errors.adresse}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email"
              type="email"
              id="email"
              autoComplete="email"
              error={errors.email ? true : false}
              helperText={errors.email}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="numerotlf"
              label="Numéro téléphone"
              type="numerotlf"
              id="numerotlf"
              autoComplete="numerotlf"
              error={errors.numerotlf ? true : false}
              helperText={errors.numerotlf}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Modifier
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
