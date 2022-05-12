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
import { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { getArticleById } from "../controleurs/ArticleControleurs";
import { updateArticle } from "../controleurs/ArticleControleurs";
import { ArticleModel } from "../Models/ArticleModel";
import { styled } from "@mui/material/styles";
import { storage } from "../Helpers/FireBase";
import { createUUID } from "../Helpers/Helper";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const status = [
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
const Unite = [
  {
    value: "Kg",
    label: "Kg",
  },
  {
    value: "g",
    label: "g",
  },
  {
    value: "L",
    label: "L",
  },
  {
    value: "ml",
    label: "ml",
  },
  {
    value: "cl",
    label: "cl",
  },
  {
    value: "boite",
    label: "boite",
  },
  {
    value: "Autre",
    label: "Autre",
  },
];
const TypesArticle = [
  {
    value: "fruit",
    label: "fruit",
  },
  {
    value: "legume",
    label: "legume",
  },
  {
    value: "aliments",
    label: "aliments",
  },
  {
    value: "sucré",
    label: "sucré",
  },
  {
    value: "panier",
    label: "panier",
  },
  {
    value: "Produit laitier",
    label: "Produit laitier",
  },
];
export default function ModifierArticle() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dateV, setDateV] = useState(null);
  const [dateR, setDateR] = useState(null);
  const [typeArticle, setTypeArticle] = useState("");
  const regNum = new RegExp("^[0-9\b]+$");
  const regNom = new RegExp("^[a-zA-Z]+[a-zA-Z]+$");
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const Input = styled("input")({
    display: "none",
  });
  const theme = createTheme();
  const [data, setData] = useState({
    titreArticle: "",
    typeArticle: "",
    urlImage: "",
    nomPointVente: "",
    idPointVente: "",
    nomCommercant: "",
    prixInitial: "",
    prixActuel: "",
    unite: "",
    quantite: "",
    datevalidite: "",
    dateretrait: "",
    statut: "",
    description: "",
  });
  const [errors, setErrors] = useState({
    titreArticle: "",
    typeArticle: "",
    urlImage: "",
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
  //get id article from url
  let { id } = useParams();
  console.log(id);

  //get article from firebase by id
  useEffect(() => {
    console.log("use effect here ");
    getArticleById(id)
      .then((result) => {
        console.log(result.data());
        let values = result.data();
        setLoading(false);
        const article = new ArticleModel(
          values.id,
          values.idCommercant,
          values.titreArticle,
          values.typeArticle,
          values.urlImage,
          values.nomPointVente,
          values.idPointVente,
          values.nomCommercant,
          values.prixInitial,
          values.prixActuel,
          values.unite,
          values.quantite,
          values.datevalidite,
          values.dateretrait,
          values.statut,
          values.description
        );
        setData(article);
      })
      .catch((error) => {
        console.error("Error : ", error);
      });
  }, []);

  //modifier article
  const modifierArticle = (data) => {
    updateArticle(data)
      .then(() => {
        console.log("Article modifié avec succès!");
      })
      .catch((error) => {
        console.error("Error : ", error);
      });
  };
  //modifier image d'article
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
            setData({ ...data, ["urlImage"]: url });
            console.log(url);
          })
          .catch((error) => {
            console.log(" !! ", error);
          });
      }
    );
  };

  //validation form
  const isFormValid = (data) => {
    const _errors = { ...errors };
    if (!data.titreArticle) {
      _errors.titreArticle = "Titre  est obligatoire";
    } /*else if (!regNom.test(data.titreArticle)) {
      _errors.titreArticle = "Titre contient uniquement des lettres ";
    }*/ else _errors.titreArticle = "";
    if (!data.typeArticle) {
      _errors.typeArticle = "Type article est obligatoire";
    } else _errors.typeArticle = "";

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
    } else _errors.unite = "";

    if (!data.datevalidite) {
      _errors.datevalidite = "Date de validité est obligatoire";
    } else _errors.datevalidite = "";

    if (!data.dateretrait) {
      _errors.dateretrait = "Date de retrait est obligatoire";
    } else _errors.dateretrait = "";

    if (!data.statut) {
      _errors.statut = "Statut est obligatoire";
    } else _errors.statut = "";

    if (!data.description) {
      _errors.description = "Description est obligatoire";
    } else _errors.description = "";

    setErrors(_errors);
    if (Object.values(_errors).filter((item) => item).length === 0) {
      return true;
    } else return false;
  };

  //change form
  const handleChange = (event) => {
    //a faire pour tout les champs dans le formulaire==>ligne 178
    /* if (event.target.name === "titreArticle") {
      setData({ ...data, titreArticle: event.target.value });
    }*/

    // data.prixActuel -->pour acceder à la valeur de la propriétes
    // data['prixActuel']
    setData({ ...data, [event.target.name]: event.target.value });
  };

  //submit form after validation
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(data);

    if (isFormValid(data)) {
      console.log("form valid");
      modifierArticle(data);
      alert("votre article est modifié avec succès");
      navigate("/consulter/articles");
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
                  marginTop: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                  <ShoppingBagIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Modifier article
                </Typography>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  sx={{ mt: 1 }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="titreArticle"
                        label="Titre d'article"
                        autoComplete="titreArticle"
                        error={errors.titreArticle ? true : false}
                        helperText={errors.titreArticle}
                        value={data.titreArticle}
                        name="titreArticle"
                        onChange={(e) => handleChange(e)}
                        autoFocus
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="typeArticle"
                        label="Type article"
                        autoComplete="typeArticle"
                        error={errors.typeArticle ? true : false}
                        helperText={errors.typeArticle}
                        value={data.typeArticle}
                        name="typeArticle"
                        onChange={(e) => handleChange(e)}
                        select
                      >
                        {TypesArticle.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
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
                        disabled
                        //onChange={(e) => handleChange(e)}
                        value={data.nomPointVente}
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
                        //autoComplete="nomCommercant"
                        disabled
                        error={errors.nomCommercant ? true : false}
                        helperText={errors.nomCommercant}
                        onChange={(e) => handleChange(e)}
                        value={data.nomCommercant}
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
                        onChange={(e) => handleChange(e)}
                        value={data.prixInitial}
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
                        onChange={(e) => handleChange(e)}
                        value={data.prixActuel}
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
                        select
                        onChange={(e) => handleChange(e)}
                        value={data.unite}
                      >
                        {Unite.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
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
                        onChange={(e) => handleChange(e)}
                        value={data.quantite}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      {/* <TextField
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
                        onChange={(e) => handleChange(e)}
                        value={data.datevalidite}
                        />*/}
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Date de validité"
                          value={data.datevalidite}
                          onChange={(newDateV) => {
                            setDateV(newDateV);
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      {/*<TextField
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
                        onChange={(e) => handleChange(e)}
                        value={data.dateretrait}
                        />*/}
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Date du retrait"
                          value={data.dateretrait}
                          onChange={(newDateR) => {
                            setDateR(newDateR);
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
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
                        onChange={(e) => handleChange(e)}
                        value={data.statut}
                      >
                        {status.map((option) => (
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
                        onChange={(e) => handleChange(e)}
                        value={data.description}
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
                        onChange={handleChangeImage}
                      />
                      <Button variant="contained" component="span" fullWidth>
                        Modifier image
                      </Button>
                    </label>
                  </Grid>
                  <img
                    src={`${data.urlImage}?w=164&h=164&fit=crop&auto=format`}
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
                </Box>
              </Box>
            </Container>
          </ThemeProvider>
        </>
      )}
    </>
  );
}
