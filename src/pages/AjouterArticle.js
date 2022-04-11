import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { Grid } from "@mui/material";
import { useState } from "react";
import { ajouterArticle } from "../controleurs/ArticleControleurs";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import { storage } from "../Helpers/FireBase";
import { createUUID } from "../Helpers/Helper";

const currencies = [
  {
    value: "Disponible",
    label: "Disponible",
  },
  {
    value: "Reservé",
    label: "Reservé",
  },
  {
    value: "Retiré",
    label: "Retiré",
  },
  {
    value: "Perimé",
    label: "Perimé",
  },
];
export default function Ajouter() {
  const [currency, setCurrency] = useState("");
  const handleChange = (event) => {
    setCurrency(event.target.value);
  };

  const Input = styled("input")({
    display: "none",
  });
  const theme = createTheme();
  const [errors, setErrors] = useState({
    titreArticle: "",
    nomPointVente: "",
    nomCommercant: "",
    prixInitial: "",
    prixActuel: "",
    quantite: "",
    unite: "",
    datevalidite: "",
    dateretrait: "",
    statut: "",
    description: "",
  });

  //ajouter image
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);

  const handleChangee = (e) => {
    if (e.target.files[0]) {
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
            console.log(url);
          })
          .catch((error) => {
            console.log(" !! ", error);
          });
      }
    );
  };

  // console.log("image: ", image);

  const regNum = new RegExp("^[0-9\b]+$");
  const regNom = new RegExp("^[a-zA-Z]+[a-zA-Z]+$");
  const regDate = new RegExp(
    "^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4}|[0-9]{2})$"
  );

  // validation formulaire
  const isFormValid = (data) => {
    const _errors = { ...errors };
    if (!data.titreArticle) {
      _errors.titreArticle = "Titre  est obligatoire";
    } else if (!regNom.test(data.titreArticle)) {
      _errors.titreArticle = "Titre contient uniquement des lettres ";
    } else _errors.titreArticle = "";

    if (!data.nomPointVente) {
      _errors.nomPointVente = "Nom point vente est obligatoire";
    } else if (!regNom.test(data.nomPointVente)) {
      _errors.nomPointVente = "Nom contient uniquement des lettres ";
    } else _errors.nomPointVente = "";

    if (!data.nomCommercant) {
      _errors.nomCommercant = "Nom commerçant est obligatoire";
    } else if (!regNom.test(data.nomCommercant)) {
      _errors.nomCommercant = "Nom contient uniquement des lettres ";
    } else _errors.nomCommercant = "";

    if (!data.prixInitial) {
      _errors.prixInitial = "Prix initial est obligatoire";
    } else if (!regNum.test(data.prixInitial)) {
      _errors.prixInitial = "Prix initial contient uniquement des chiffres ";
    } else _errors.prixInitial = "";

    if (!data.prixActuel) {
      _errors.prixActuel = "Prix actuel est obligatoire";
    } else if (!regNum.test(data.prixActuel)) {
      _errors.prixActuel = "Prix actuel contient uniquement des chiffres ";
    } else _errors.prixActuel = "";

    if (!data.quantite) {
      _errors.quantite = "Quantité est obligatoire";
    } else if (!regNum.test(data.quantite)) {
      _errors.quantite = "Quantité contient uniquement des chiffres ";
    } else _errors.quantite = "";

    if (!data.unite) {
      _errors.unite = "Unité est obligatoire";
    } else if (!regNom.test(data.unite)) {
      _errors.unite = "Unite contient uniquement des lettres ";
    } else _errors.unite = "";

    if (!data.datevalidite) {
      _errors.datevalidite = "Date de validité est obligatoire";
    } else if (!regDate.test(data.datevalidite)) {
      _errors.datevalidite = "Date de validité est jj.mm.aaaa ou jj/mm/aaaa  ";
    } else _errors.datevalidite = "";

    if (!data.dateretrait) {
      _errors.dateretrait = "Date de retrait est obligatoire";
    } else if (!regDate.test(data.dateretrait)) {
      _errors.dateretrait = "Date du retrait est jj.mm.aaaa ou jj/mm/aaaa  ";
    } else _errors.dateretrait = "";

    if (!data.statut) {
      _errors.statut = "Selectionner le statut ";
    } else _errors.statut = "";

    if (!data.description) {
      _errors.description = "Description est obligatoire";
    } else _errors.description = "";

    setErrors(_errors);
    if (Object.values(_errors).filter((item) => item).length === 0) {
      return true;
    } else return false;
  };

  // form submit
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const dataValues = {
      titreArticle: data.get("titreArticle"),
      urlImage: url,
      nomCommercant: data.get("nomCommercant"),
      nomPointVente: data.get("nomPointVente"),
      prixInitial: data.get("prixInitial"),
      prixActuel: data.get("prixActuel"),
      quantite: data.get("quantite"),
      unite: data.get("unite"),
      datevalidite: data.get("datevalidite"),
      dateretrait: data.get("dateretrait"),
      statut: data.get("statut"),
      description: data.get("description"),
    };
    if (isFormValid(dataValues)) {
      console.log("form valid");
      console.log("______ ", dataValues);

      ajouterArticle(dataValues)
        .then(() => {
          console.log("article saved with succes");
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
            marginTop: -2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <ShoppingBagIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Nouveau article
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
                  id="titreArticle"
                  label="Titre d'article"
                  name="titreArticle"
                  autoComplete="titreArticle"
                  error={errors.titreArticle ? true : false}
                  helperText={errors.titreArticle}
                  autoFocus
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="nomPointVente"
                  label="Nom point de vente"
                  name="nomPointVente"
                  autoComplete="nomPointVente"
                  error={errors.nomPointVente ? true : false}
                  helperText={errors.nomPointVente}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="nomCommercant"
                  label="Nom commerçant"
                  name="nomCommercant"
                  autoComplete="nomCommercant"
                  error={errors.nomCommercant ? true : false}
                  helperText={errors.nomCommercant}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="prixInitial"
                  label="Prix initial"
                  name="prixInitial"
                  autoComplete="prixInitial"
                  error={errors.prixInitial ? true : false}
                  helperText={errors.prixInitial}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="prixActuel"
                  label="Prix actuel"
                  name="prixActuel"
                  autoComplete="prixActuel"
                  error={errors.prixActuel ? true : false}
                  helperText={errors.prixActuel}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="unite"
                  label="Unité"
                  type="unite"
                  id="unite"
                  autoComplete="unite"
                  error={errors.unite ? true : false}
                  helperText={errors.unite}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="quantite"
                  label="Quantité"
                  type="quantite"
                  id="quantite"
                  autoComplete="quantite"
                  error={errors.quantite ? true : false}
                  helperText={errors.quantite}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="datevalidite"
                  label="Date de validité"
                  type="datevalidite"
                  id="datevalidite"
                  autoComplete="datevalidite"
                  error={errors.datevalidite ? true : false}
                  helperText={errors.datevalidite}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="dateretrait"
                  label="Date du retrait"
                  type="dateretrait"
                  id="dateretrait"
                  autoComplete="dateretrait"
                  error={errors.dateretrait ? true : false}
                  helperText={errors.dateretrait}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="statut"
                  label="Statut "
                  type="statut"
                  id="statut"
                  autoComplete="statut"
                  error={errors.statut ? true : false}
                  helperText={errors.statut}
                  select
                  value={currency}
                  onChange={handleChange}
                >
                  {currencies.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="description"
                  label="Description "
                  type="description"
                  id="description"
                  multiline
                  rows={4}
                  autoComplete="description"
                  error={errors.description ? true : false}
                  helperText={errors.description}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <label htmlFor="contained-button-file">
                <Input
                  accept="image/*"
                  id="contained-button-file"
                  multiple
                  type="file"
                  onChange={handleChangee}
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
                sx={{ width: 300, height: 200 }}
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
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
