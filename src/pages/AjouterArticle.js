import Avatar from "@mui/material/Avatar";
import * as React from "react";
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
import { ajouterArticle } from "../controleurs/ArticleControleurs";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import { storage } from "../Helpers/FireBase";
import { createUUID } from "../Helpers/Helper";
import { consulterListePointsVenteCurrentUser } from "../controleurs/PointDeVenteControleur";
import { setIdArticlesToPointVente } from "../controleurs/PointDeVenteControleur";
import CircularProgress from "@mui/material/CircularProgress";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { getConnectedUser } from "../Helpers/FireBase";
import { getUserById } from "../controleurs/CompteControleur";
import { CompteModel } from "../Models/CompteModel";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
//
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
/*const status = [
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
];*/
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
    value: "élément(s)",
    label: "élément(s)",
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
//
export default function Ajouter() {
  const regNum = new RegExp("^[0-9]+|[0-9]+[,|.][0-9]+$");
  const regNom = new RegExp("^[a-zA-Z]+ [a-zA-Z]+|[a-zA-Z]+$");
  //const [statutArticle, setStatutArticle] = useState("");
  const [typeArticle, setTypeArticle] = useState("");
  const [uniteArticle, setUniteArticle] = useState("");
  const [ptv, setPtv] = useState({
    idPointVente: "",
    nomPointVente: "",
  });
  const [listPTV, setListPTV] = useState([]);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);

  const [errors, setErrors] = useState({
    titreArticle: "",
    typeArticle: "",
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
  const [dateV, setDateV] = useState(null);
  const [dateR, setDateR] = useState(null);
  const Input = styled("input")({
    display: "none",
  });
  const [user, setUser] = useState({
    id: "",
    nom: "",
    prenom: "",
    email: "",
  });
  const theme = createTheme();
  const navigate = useNavigate();
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
            values.email
          );

          setUser(compte);
          console.log("compteUser", compte);
          //consulter liste des points de vente (nomPointVente)
          consulterListePointsVenteCurrentUser(_user.uid).then((snapshot) => {
            console.log(snapshot);
            let values = snapshot.docs.map((doc) => doc.data());
            console.log("values", values);
            setLoading(false);
            //_listPTV array objet local pour cet fonction
            let _listPTV = values.map((elem) => ({
              value: elem.id,
              label: elem.titrePointVente,
            }));
            _listPTV.unshift({ value: "", label: "-------------" });
            console.log("_listPTV", _listPTV);
            setListPTV(_listPTV);

            console.log("listPTV  :", listPTV);
          });
        })
        .catch((error) => {
          console.error("Error : ", error);
        });
    });
  }, []);

  //handleChange statut article
  /* const handleChange = (event) => {
    setStatutArticle(event.target.value);
  };*/
  //handleChange unite d'artilce
  const handleChangeUnite = (event) => {
    setUniteArticle(event.target.value);
  };
  //handleChange type d'artilce
  const handleChangeTypeArticle = (event) => {
    setTypeArticle(event.target.value);
  };
  //handleChange nom point de vente
  const handleChangePtv = (event) => {
    console.log("avant filter", listPTV);
    let item = listPTV.find((el) => el.value === event.target.value);
    console.log("item", item);
    setPtv({
      idPointVente: event.target.value,
      nomPointVente: item.label,
    });
  };

  //ajouter image
  const handleChangeImage = (e) => {
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

  // validation formulaire
  const isFormValid = (data) => {
    const _errors = { ...errors };
    //verifier titre article
    if (!data.titreArticle) {
      _errors.titreArticle = "Titre  est obligatoire";
    } else if (!regNom.test(data.titreArticle)) {
      _errors.titreArticle = "Titre contient uniquement des lettres ";
    } else _errors.titreArticle = "";
    if (!data.typeArticle) {
      _errors.typeArticle = "Type article est obligatoire";
    } else _errors.typeArticle = "";

    //verifier prix initial d'article
    if (!data.prixInitial) {
      _errors.prixInitial = "Prix initial est obligatoire";
    } else if (!regNum.test(data.prixInitial)) {
      _errors.prixInitial = "Prix initial contient uniquement des chiffres ";
    } else _errors.prixInitial = "";
    //verifier prix actuel d'article
    if (!data.prixActuel) {
      _errors.prixActuel = "Prix actuel est obligatoire";
    } else if (!regNum.test(data.prixActuel)) {
      _errors.prixActuel = "Prix actuel contient uniquement des chiffres ";
    } else _errors.prixActuel = "";
    //verifier quantité
    if (!data.quantite) {
      _errors.quantite = "Quantité est obligatoire";
    } else if (!regNum.test(data.quantite)) {
      _errors.quantite = "Quantité contient uniquement des chiffres ";
    } else _errors.quantite = "";
    //verifier unité
    if (!data.unite) {
      _errors.unite = "Unité est obligatoire";
    } else _errors.unite = "";
    //verifier date de validité
    if (!data.datevalidite) {
      _errors.datevalidite = "Date de validité est obligatoire";
    } else _errors.datevalidite = "";
    //verifier date de retrait
    if (!data.dateretrait) {
      _errors.dateretrait = "Date de retrait est obligatoire";
    } else _errors.dateretrait = "";

    //verifier description
    if (!data.description) {
      _errors.description = "Description est obligatoire";
    } else _errors.description = "";
    //verifier image
    if (!data.urlImage) {
      _errors.urlImage = "image est obligatoire";
    } else _errors.urlImage = "";
    //set errors
    setErrors(_errors);
    if (Object.values(_errors).filter((item) => item).length === 0) {
      return true;
    } else return false;
  };

  // form submit
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    var date = dateV ? moment(dateV).format("L") : "";
    var _date = dateR ? moment(dateR).format("L") : "";
    // data values of form
    const dataValues = {
      idCommercant: user.id,
      titreArticle: data.get("titreArticle"),
      typeArticle: data.get("typeArticle"),
      urlImage: url,
      nomPointVente: ptv.idPointVente ? ptv.nomPointVente : "",
      idPointVente: ptv.idPointVente,
      nomCommercant: user.prenom,
      prixInitial: data.get("prixInitial"),
      prixActuel: data.get("prixActuel"),
      unite: data.get("unite"),
      quantite: data.get("quantite"),
      datevalidite: date,
      dateretrait: _date,
      statut: ptv.idPointVente ? "Disponible" : "Nouveau",
      // statut: data.get("statut"),
      description: data.get("description"),
    };
    console.log("dataValues avant firebase", dataValues);
    //ajouter article after validation form
    if (isFormValid(dataValues)) {
      console.log("form valid");
      console.log("______ ", dataValues);
      ajouterArticle(dataValues)
        .then(() => {
          console.log("article saved with succes");
          console.log("dataValues ", dataValues);
          if (dataValues.idPointVente) {
            setIdArticlesToPointVente(dataValues.idPointVente, [dataValues.id]);
            handleClickSuccess();
            window.location.reload(true);
          } else {
            handleClickSuccess();
            window.location.reload(true);
          }

          //ajouter des id articles to point vente [array d'id articles]

          //alert("votre article est ajouté avec succès");

          //navigate("/consulter/articles");
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
                    <Grid item xs={12} sm={6}>
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
                        id="typeArticle"
                        label="Type article"
                        name="typeArticle"
                        autoComplete="typeArticle"
                        error={errors.typeArticle ? true : false}
                        helperText={errors.typeArticle}
                        select
                        value={typeArticle}
                        onChange={handleChangeTypeArticle}
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
                        fullWidth
                        id="nomPointVente"
                        label="Nom point de vente"
                        name="nomPointVente"
                        select
                        value={ptv.idPointVente}
                        onChange={handleChangePtv}
                      >
                        {listPTV.map((option) => (
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
                        id="nomCommercant"
                        name="nomCommercant"
                        error={errors.nomCommercant ? true : false}
                        helperText={errors.nomCommercant}
                        value={user.prenom}
                        disabled
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
                        select
                        value={uniteArticle}
                        onChange={handleChangeUnite}
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
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Date de validité"
                          value={dateV}
                          onChange={(newDateV) => {
                            setDateV(newDateV);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={errors.datevalidite ? true : false}
                              helperText={errors.datevalidite}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Date du retrait"
                          value={dateR}
                          onChange={(newDateR) => {
                            setDateR(newDateR);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={errors.dateretrait ? true : false}
                              helperText={errors.dateretrait}
                            />
                          )}
                        />
                      </LocalizationProvider>
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
                        onChange={handleChangeImage}
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
                          Votre article est ajouté avec succès!
                        </Alert>
                      </Snackbar>
                    </Stack>
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
