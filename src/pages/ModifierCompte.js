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

export default function ModifierPointVente() {
  const [data, setData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
  });

  const theme = createTheme();
  const [errors, setErrors] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
  });

  //validation formulaire
  const regNom = new RegExp("^[a-zA-Z]+[a-zA-Z]+$");
  const pattern = new RegExp("^[a-zA-Z0-9]+@[a-zA-Z0-9]+.[A-Za-z]+$");
  const isFormValid = (data) => {
    const _errors = { ...errors };
    if (!data.nom) {
      _errors.nom = "Le nom est obligatoire";
    } else if (!regNom.test(data.nom)) {
      _errors.nom = "Le nom doit contenir seulement des lettres";
    } else _errors.nom = "";

    if (!data.prenom) {
      _errors.prenom = "Le prenom est obligatoire";
    } else if (!regNom.test(data.prenom)) {
      _errors.prenom = "Le prenom doit contenir seulement des lettres";
    } else _errors.prenom = "";

    if (!data.email) {
      _errors.email = "L'email est obligatoire";
    } else if (!pattern.test(data.email)) {
      _errors.email = "Vérifier votre email";
    } else _errors.email = "";

    if (!data.password) {
      _errors.password = "Le mots de passe est obligatoire";
    } else if (data.password.length < 6) {
      _errors.password = "Mots de passe doit etre superieure 6";
    } else _errors.password = "";
    setErrors(_errors);
    if (Object.values(_errors).filter((item) => item).length === 0) {
      return true;
    } else return false;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(data);

    if (isFormValid(data)) {
      console.log("form valid");
    } else console.log("form non valid");
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
              name="password"
              label="Mots de passe"
              type="password"
              id="password"
              autoComplete="password"
              error={errors.password ? true : false}
              helperText={errors.password}
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
