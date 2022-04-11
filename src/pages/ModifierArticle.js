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

export default function ModifierArticle() {
  let { id } = useParams();
  console.log(id);
  const [data, setData] = useState({
    titreArticle: "",
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

  const [loading, setLoading] = useState(true);
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
          values.urlImage,
          values.nomPointVente,
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

  const theme = createTheme();
  const [errors, setErrors] = useState({
    titreArticle: "",
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

  //validation formulaire
  const regNum = new RegExp("^[0-9\b]+$");
  const regNom = new RegExp("^[a-zA-Z]+[a-zA-Z]+$");
  const regDate = new RegExp(
    "^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4}|[0-9]{2})$"
  );

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

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(data);

    if (isFormValid(data)) {
      console.log("form valid");
      modifierArticle(data);
    } else console.log("form nom valid");
  };
  const Input = styled("input")({
    display: "none",
  });

  const handleChange = (event) => {
    //a faire pour tout les champs dans le formulaire==>ligne 178
    /* if (event.target.name === "titreArticle") {
      setData({ ...data, titreArticle: event.target.value });
    }*/

    // data.prixActuel -->pour acceder à la valeur de la propriétes
    // data['prixActuel']
    setData({ ...data, [event.target.name]: event.target.value });
  };

  //modifier image
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);

  const handleChangee = (e) => {
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
                    <Grid item xs={12}>
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
                        id="nomPointVente"
                        label="Nom point de vente"
                        name="nomPointVente"
                        autoComplete="nomPointVente"
                        error={errors.nomPointVente ? true : false}
                        helperText={errors.nomPointVente}
                        onChange={(e) => handleChange(e)}
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
                        autoComplete="nomCommercant"
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
                        onChange={(e) => handleChange(e)}
                        value={data.unite}
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
                        onChange={(e) => handleChange(e)}
                        value={data.quantite}
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
                        onChange={(e) => handleChange(e)}
                        value={data.datevalidite}
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
                        onChange={(e) => handleChange(e)}
                        value={data.dateretrait}
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
                        onChange={(e) => handleChange(e)}
                        value={data.statut}
                      />
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
                        onChange={handleChangee}
                      />
                      <Button variant="contained" component="span" fullWidth>
                        Modifier image
                      </Button>
                    </label>
                  </Grid>
                  <img
                    src={`${data.urlImage}?w=164&h=164&fit=crop&auto=format`}
                    loading="lazy"
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
