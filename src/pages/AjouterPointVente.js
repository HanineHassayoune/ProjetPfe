import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useState, useEffect } from "react";
import { ajouterPointVente } from "../controleurs/PointDeVenteControleur";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { getUserById } from "../controleurs/CompteControleur";
import { CompteModel } from "../Models/CompteModel";
import { storage } from "../Helpers/FireBase";
import { createUUID } from "../Helpers/Helper";
import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { getConnectedUser } from "../Helpers/FireBase";
const theme = createTheme();

export default function AjouterPointVente() {
  const navigate = useNavigate();
  const regNom = new RegExp("^[a-zA-Z]+ [a-zA-Z]+|[a-zA-Z]+$");
  const regNum = new RegExp("^[0-9]+.[0-9]+|[0-9\b]+$");
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({
    titrePointVente: "",
    email: "",
    adressePointVente: "",
    numerotlf: "",
    urlImagePtv: "",
  });
  const Input = styled("input")({
    display: "none",
  });
  const [user, setUser] = useState({
    id: "",
    nom: "",
    prenom: "",
    email: "",
  });

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

  //ajouter image pour point de vente
  const handleChangeImagePtv = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      console.log("image", e.target.files[0]);
      handleUpload(e.target.files[0]);
    }
  };

  //telecharger image
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

  //submit form after validation
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const dataValues = {
      idCommercant: user.id,
      titrePointVente: data.get("titrePointVente"),
      email: user.email,
      adressePointVente: data.get("adressePointVente"),
      latitude: data.get("latitude"),
      longitude: data.get("longitude"),
      numerotlf: user.numerotlf,
      urlImagePtv: url,
    };
    //ajouter point de vente after validation form
    if (isFormValid(dataValues)) {
      console.log("form valid");
      ajouterPointVente(dataValues)
        .then(() => {
          console.log("point de vente est ajouté");
          alert("Votre point de vente est ajouté avec avec succès");
          console.log("______ ", dataValues);
          navigate("/consulter/pointsvente");
        })
        .catch(() => {
          console.log("something went wrong !! ");
        });
    } else console.log("form nom valid");
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
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
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
                    </Grid>
                    <Grid item xs={12}>
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
                        autoComplete="longitude"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="email"
                        label="Email"
                        type="email"
                        id="email"
                        disabled
                        value={user.email}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="numerotlf"
                        label="Numéro téléphone"
                        name="numerotlf"
                        disabled
                        value={user.numerotlf}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <label htmlFor="contained-button-file">
                        <Input
                          accept="image/*"
                          id="contained-button-file"
                          multiple
                          type="file"
                          onChange={handleChangeImagePtv}
                        />
                        <Button variant="contained" component="span" fullWidth>
                          Télécharger image
                        </Button>
                      </label>
                    </Grid>
                    <Grid item xs={12}>
                      <img
                        src={`${url}?w=164&h=164&fit=crop&auto=format`}
                        loading="lazy"
                        width="400"
                        height="200"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                      >
                        Ajouter
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Container>
          </ThemeProvider>
        </>
      )}
    </>
  );
}
