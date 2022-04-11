import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useFormControl } from "@mui/material";
import { useState } from "react";

const theme = createTheme();

export default function Connexion() {
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  // validation formulaire
  const pattern = new RegExp("^[a-zA-Z0-9]+@[a-zA-Z0-9]+.[A-Za-z]+$");
  const isFormValid = (data) => {
    const _errors = { ...errors };
    if (!data.email) {
      _errors.email = "Email est obligatoire";
    } else if (!pattern.test(data.email)) {
      _errors.email = "Vérifier votre email";
    } else _errors.email = "";

    if (!data.password) {
      _errors.password = "Mots de passe est obligatoire";
    } else if (data.password.length < 6) {
      _errors.password = "Mots de passe doit etre superieure 6";
    } else _errors.password = "";
    setErrors(_errors);
    //console.log(_errors);
    //console.log(Object.values(_errors));
    //console.log(Object.values(_errors).filter((item) => item));
    //console.log(Object.values(_errors).filter((item) => item.length > 0));
    if (Object.values(_errors).filter((item) => item).length === 0) {
      return true;
    } else return false;

    //return Object.values(_errors).filter((item) => item).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const dataValues = {
      email: data.get("email"),
      password: data.get("password"),
    };

    if (isFormValid(dataValues)) {
      console.log("form valid");
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
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Connexion
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
                id="email"
                label="Adresse email"
                name="email"
                autoComplete="email"
                error={errors.email ? true : false}
                helperText={errors.email}
                autoFocus
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mots de passe"
                type="password"
                id="password"
                autoComplete="current-password"
                error={errors.password ? true : false}
                helperText={errors.password}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Connexion
              </Button>

              <Grid container>
                <Grid item xs>
                  <Link href="/mdp/oublie" variant="body2">
                    Mots de passe oublié?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/creer/compte" variant="body2">
                    {"Créer compte"}
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
