import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState } from "react";
import { creerCompte } from "../controleurs/CompteControleur";
import Link from "@mui/material/Link";
import { register } from "../controleurs/CompteControleur";
import { useNavigate } from "react-router-dom";
const theme = createTheme();

export default function CreerCompte() {
  const regNom = new RegExp("^[a-zA-Z]+ [a-zA-Z]+|[a-zA-Z]+$");
  const pattern = new RegExp("^[a-zA-Z0-9]+@[a-zA-Z0-9]+.[A-Za-z]+$");
  const regNum = new RegExp("^[0-9\b]+$");
  const [errors, setErrors] = useState({
    nom: "",
    prenom: "",
    email: "",
    numerotlf: "",
    password: "",
  });
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    numerotlf: "",
    password: "",
  });
  const navigate = useNavigate();
  const isFormValid = (data) => {
    const _errors = { ...errors };
    //verifier nom
    if (!data.nom) {
      _errors.nom = "Le nom est obligatoire";
    } else if (!regNom.test(data.nom)) {
      _errors.nom = "Le nom doit contenir seulement des lettres";
    } else _errors.nom = "";
    //verifier prenom
    if (!data.prenom) {
      _errors.prenom = "Le prenom est obligatoire";
    } else if (!regNom.test(data.prenom)) {
      _errors.prenom = "Le prenom doit contenir seulement des lettres";
    } else _errors.prenom = "";
    //verifier email
    if (!data.email) {
      _errors.email = "L'email est obligatoire";
    } else if (!pattern.test(data.email)) {
      _errors.email = "Vérifier votre email";
    } else _errors.email = "";
    //verifier numero telephone
    if (!data.numerotlf) {
      _errors.numerotlf = "Le numero téléphone est obligatoire";
    } else if (!regNum.test(data.numerotlf)) {
      _errors.numerotlf =
        "Le numero téléphone doit contenir seulement des chiffres";
    } else if (data.numerotlf.length != 8) {
      _errors.numerotlf = "Le numero téléphone doit contenir 8 chiffres";
    } else _errors.numerotlf = "";
    //verifier password
    /* if (!data.password) {
      _errors.password = "Le mots de passe est obligatoire";
    } else _errors.password = "";*/
    //set errors
    setErrors(_errors);
    if (Object.values(_errors).filter((item) => item).length === 0) {
      return true;
    } else return false;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const dataValues = {
      nom: data.get("nom"),
      prenom: data.get("prenom"),
      email: data.get("email"),
      numerotlf: data.get("numerotlf"),
    };

    if (isFormValid(dataValues)) {
      console.log("form valid");
      await register(form);
      await creerCompte(dataValues);
      navigate("/statistique");
    } else {
      console.log("form non valid");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
              <AccountCircleIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Créer compte
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
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
                id="prenom"
                label="Prénom"
                name="prenom"
                error={errors.prenom ? true : false}
                helperText={errors.prenom}
                autoComplete="prenom"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Adresse email"
                name="email"
                error={errors.email ? true : false}
                helperText={errors.email}
                autoComplete="email"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                id="numerotlf"
                label="Numero téléphone"
                name="numerotlf"
                error={errors.numerotlf ? true : false}
                helperText={errors.numerotlf}
                autoComplete="numerotlf"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mots de passe"
                type="password"
                id="password"
                // error={errors.password ? true : false}
                //helperText={errors.password}
                // autoComplete="current-password"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                S'inscrire
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="/mdp/oublie" variant="body2">
                    Mots de passe oublié?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/" variant="body2">
                    {"Connexion"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
