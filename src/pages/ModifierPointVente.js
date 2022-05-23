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
import { styled } from "@mui/material/styles";
import { storage } from "../Helpers/FireBase";
import { createUUID } from "../Helpers/Helper";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import * as React from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function ModifierPointVente() {
  //get id point de vente from url
  let { id } = useParams();
  console.log(id);
  const theme = createTheme();
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);

  const regNom = new RegExp("^[a-zA-Z]+ [a-zA-Z]+|[a-zA-Z]+$");
  const regNum = new RegExp("^[0-9]+.[0-9]+|[0-9\b]+$");

  const navigate = useNavigate();
  const [data, setData] = useState({
    titrePointVente: "",
    adressePointVente: "",
    latitude: "",
    longitude: "",
    email: "",
    numerotlf: "",
    urlImagePtv: "",
  });
  const [errors, setErrors] = useState({
    titrePointVente: "",
    adressePointVente: "",
    email: "",
    numerotlf: "",
    urlImagePtv: "",
  });
  const Input = styled("input")({
    display: "none",
  });
  const [open, setOpen] = React.useState(false);

  const handleClickSuccess = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  useEffect(() => {
    console.log("use effect here ");
    //get point de vente by id
    getPointsVenteById(id)
      .then((result) => {
        console.log(result.data());
        let values = result.data();
        setLoading(false);
        const pointVente = new PointDeVenteModel(
          values.id,
          values.idArticles,
          values.idCommercant,
          values.titrePointVente,
          values.adressePointVente,
          values.latitude,
          values.longitude,
          values.email,
          values.numerotlf,
          values.urlImagePtv
        );
        setData(pointVente);
      })
      .catch((error) => {
        console.error("Error : ", error);
      });
  }, []);

  //modifier image point de vente
  const handleChangeImage = (e) => {
    if (e.target.files[0]) {
      console.log("hello ");
      setImage(e.target.files[0]);
      console.log("image", e.target.files[0]);
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = (_image) => {
    let imageName = createUUID() + _image.name;
    const uploadTask = storage.ref(`images/${imageName}`).put(_image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(imageName)
          .getDownloadURL()
          .then((url) => {
            setUrl(url);
            setData({ ...data, ["urlImagePtv"]: url });
            console.log(url);
          })
          .catch((error) => {
            console.log(" !! ", error);
          });
      }
    );
  };

  //validation formulaire
  const isFormValid = (data) => {
    const _errors = { ...errors };
    //verifier titre point de vente
    if (!data.titrePointVente) {
      _errors.titrePointVente = "Titre est obligatoire";
    } else if (!regNom.test(data.titrePointVente)) {
      _errors.titrePointVente = "Le titre doit contenir seulement des lettres";
    } else _errors.titrePointVente = "";
    //verifier adresse point de vente
    if (!data.adressePointVente) {
      _errors.adressePointVente = "Adresse est obligatoire";
    } else _errors.adressePointVente = "";
    //verifier latitude point de vente
    if (!data.latitude) {
      _errors.latitude = "Latitude est obligatoire";
    } else if (!regNum.test(data.latitude)) {
      _errors.latitude = "Latitude doit contenir seulement des chiffres";
    } else _errors.latitude = "";
    //verifier longitude point de vente
    if (!data.longitude) {
      _errors.longitude = "Longitude est obligatoire";
    } else if (!regNum.test(data.longitude)) {
      _errors.longitude = "Longitude doit contenir seulement des chiffres";
    } else _errors.longitude = "";
    //set error
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

  //modifier formulaire
  const handleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  //submit form after validation form
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(data);

    if (isFormValid(data)) {
      console.log("form valid");
      modifierPointVente(data);
      //alert("votre point de vente est modifié avec succès");
      //navigate("/consulter/pointsvente");
      handleClickSuccess();
      //window.location.reload(true);
    } else console.log("form non valid");
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
                  Modifier point de vente
                </Typography>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  sx={{ mt: 1 }}
                >
                  <Grid item xs={12}>
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
                  </Grid>
                  <Grid item xs={12}>
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
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="latitude"
                      label="Latitude"
                      name="latitude"
                      error={errors.latitude ? true : false}
                      helperText={errors.latitude}
                      onChange={(e) => handleChange(e)}
                      value={data.latitude}
                      autoComplete="latitude"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="longitude"
                      label="Longitude "
                      name="longitude"
                      error={errors.longitude ? true : false}
                      helperText={errors.longitude}
                      onChange={(e) => handleChange(e)}
                      value={data.longitude}
                      autoComplete="longitude"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      margin="normal"
                      fullWidth
                      name="email"
                      label="Email"
                      type="email"
                      id="email"
                      disabled
                      value={data.email}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      margin="normal"
                      fullWidth
                      name="numerotlf"
                      label="Numéro téléphone"
                      type="numerotlf"
                      id="numerotlf"
                      disabled
                      value={data.numerotlf}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <label htmlFor="contained-button-file">
                      <Input
                        accept="image/*"
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={handleChangeImage}
                      />
                      <Button variant="contained" component="span" fullWidth>
                        Modifier image
                      </Button>
                    </label>
                  </Grid>
                  <img
                    src={`${data.urlImagePtv}?w=164&h=164&fit=crop&auto=format`}
                    loading="lazy"
                    width="400"
                    height="200"
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
                        Votre point de vente est modifié avec succès!
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
