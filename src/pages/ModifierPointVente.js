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
import { useParams } from "react-router-dom";
import { getPointsVenteById } from "../controleurs/PointDeVenteControleur";
import { PointDeVenteModel } from "../Models/PointDeVenteModel";
import { updatePointsVente } from "../controleurs/PointDeVenteControleur";
import { useEffect } from "react";

export default function ModifierPointVente() {
  let { id } = useParams();
  console.log(id);
  const [data, setData] = useState({
    titrePointVente: "",
    email: "",
    adressePointVente: "",
    numerotlf: "",
  });

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.log("use effect here ");
    getPointsVenteById(id)
      .then((result) => {
        console.log(result.data());
        let values = result.data();
        setLoading(false);
        const pointVente = new PointDeVenteModel(
          values.id,
          values.titrePointVente,
          values.adressePointVente,
          values.email,
          values.numerotlf
        );
        setData(pointVente);
      })
      .catch((error) => {
        console.error("Error : ", error);
      });
  }, []);

  const theme = createTheme();
  const [errors, setErrors] = useState({
    titrePointVente: "",
    email: "",
    adressePointVente: "",
    numerotlf: "",
  });

  //validation formulaire
  const pattern = new RegExp("^[a-zA-Z0-9]+@[a-zA-Z0-9]+[.][A-Za-z]+$");
  const regNom = new RegExp("^[a-zA-Z]+[a-zA-Z]+$");
  const regNum = new RegExp("^[0-9\b]+$");

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

  //modifier pointVente
  const modifierPointVente = (data) => {
    updatePointsVente(data)
      .then(() => {
        console.log("pointVente modifié avec succès!");
      })
      .catch((error) => {
        console.error("Error : ", error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(data);

    if (isFormValid(data)) {
      console.log("form valid");
      modifierPointVente(data);
    } else console.log("form non valid");
  };

  const handleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  return (
    <>
      {loading ? (
        <>"is loading" </>
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
                    id="titrePointVente"
                    label="Titre point de vente"
                    name="titrePointVente"
                    autoComplete="titrePointVente"
                    error={errors.titrePointVente ? true : false}
                    helperText={errors.titrePointVente}
                    onChange={(e) => handleChange(e)}
                    value={data.titrePointVente}
                  />

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="adressePointVente"
                    label="Adresse point vente"
                    type="adressePointVente"
                    id="adressePointVente"
                    autoComplete="adressePointVente"
                    error={errors.adressePointVente ? true : false}
                    helperText={errors.adressePointVente}
                    onChange={(e) => handleChange(e)}
                    value={data.adressePointVente}
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
                    onChange={(e) => handleChange(e)}
                    value={data.email}
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
                    onChange={(e) => handleChange(e)}
                    value={data.numerotlf}
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
        </>
      )}
    </>
  );
}
