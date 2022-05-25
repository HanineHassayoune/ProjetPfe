import * as React from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getPointsVenteById } from "../controleurs/PointDeVenteControleur";
import { useParams } from "react-router-dom";
import { PointDeVenteModel } from "../Models/PointDeVenteModel";
import { consulterListeArticlesCurrentUserWithoutPtv } from "../controleurs/ArticleControleurs";
import {
  setIdArticlesToPointVente,
  deleteIdArticlesToPointVente,
} from "../controleurs/PointDeVenteControleur";
import { getListArticlesFromPtvByListId } from "../controleurs/ArticleControleurs";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";
import { getConnectedUser } from "../Helpers/FireBase";
import { updateArticle } from "../controleurs/ArticleControleurs";
import { getReservationCurrentUser } from "../controleurs/ReservationControleur";
function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

export default function TransferList() {
  let { id } = useParams();
  const [article, setArticle] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [reservations, setReservations] = useState();

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const [detail, setDetail] = useState({
    id: "",
    //idArticles: "",
    titrePointVente: "",
    adressePointVente: "",
    email: "",
    numerotlf: "",
    urlImagePtv: "",
  });

  useEffect(() => {
    getConnectedUser()
      .then((_user) => {
        console.log("use effect here ");
        getPointsVenteById(id).then((result) => {
          console.log(result.data());
          let values = result.data();
          setLoading(false);
          console.log("Values  ", values);
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
          setDetail(pointVente);

          //LeftList-->get articles from firebase for this Ptv
          getReservationCurrentUser(_user.uid).then((result) => {
            let _reservations = result.docs.map((doc) => doc.data());
            console.log("reservation", _reservations);
            let listArticleAvecReservation = _reservations.map(
              (list) => list.idArticle
            );
            console.log(
              "listArticleAvecReservation",
              listArticleAvecReservation
            );
            let listArticlesWithoutReservation = pointVente.idArticles.filter(
              (id) => listArticleAvecReservation.includes(id) == false
            );
            console.log(
              "listArticlesWithoutReservation",
              listArticlesWithoutReservation
            );

            getListArticlesFromPtvByListId(listArticlesWithoutReservation).then(
              (_list) => {
                let LeftList = _list;
                setRight(LeftList);
                console.log("Right here ", LeftList);

                //rigthList-->get articles from firebase
                consulterListeArticlesCurrentUserWithoutPtv(_user.uid).then(
                  (snapshot) => {
                    let rigthList = snapshot.docs.map((doc) => doc.data());
                    setArticle(rigthList);
                    console.log("Left Here", rigthList);
                    const r = rigthList.filter(
                      (elem) => !LeftList.find(({ id }) => elem.id == id)
                    );
                    console.log("result left filter ", r);
                    setLeft(r);
                  }
                );
              }
            );
          });
        });
      })

      .catch((error) => {
        console.error("Error : ", error);
      });

    console.log("message");
  }, []);

  //select item
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
      console.log(value.id);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  //select all
  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  //function--> items to right
  const handleCheckedRight = () => {
    //afficher l'article selectinné : leftChecked
    console.log(leftChecked);
    //selectionner les id d'articles
    let listId = leftChecked.map((item) => item.id);
    console.log(listId);

    //mettre les id des articles dans idArticles de point de vente
    setIdArticlesToPointVente(id, listId);
    leftChecked.forEach((element) => {
      console.log("element", element);
      element.nomPointVente = detail.titrePointVente;
      element.idPointVente = detail.id;
      console.log("element after update", element);
      console.log("detail", detail);
      updateArticle(element).then((result) => {
        console.log(result);
      });
    });
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  //function--> items to left
  const handleCheckedLeft = () => {
    let listId = left.concat(rightChecked).map((item) => item.id);
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    rightChecked.forEach((element) => {
      console.log("element", element);
      element.nomPointVente = "";
      element.idPointVente = "";
      element.statut = "Nouveau";
      console.log("element after update right", element);
      console.log("detail", detail);
      updateArticle(element).then((result) => {
        console.log(result);
      });
    });
    setChecked(not(checked, rightChecked));
    deleteIdArticlesToPointVente(id, listId);
    console.log(listId);
  };

  const customList = (title, items) => (
    <Box sx={{ border: 1 }}>
      <Card>
        <CardHeader
          sx={{ px: 2, py: 1 }}
          //pour selectionner tous
          avatar={
            <Checkbox
              onClick={handleToggleAll(items)}
              checked={
                numberOfChecked(items) === items.length && items.length !== 0
              }
              indeterminate={
                numberOfChecked(items) !== items.length &&
                numberOfChecked(items) !== 0
              }
              disabled={items.length === 0}
              inputProps={{
                "aria-label": "all items selected",
              }}
            />
          }
          //titre du list
          title={title}
          //number under title
          subheader={`${numberOfChecked(items)}/${items.length} selected`}
        />
        <Divider />
        <List
          sx={{
            width: 200,
            height: 230,
            bgcolor: "background.paper",
            overflow: "auto",
          }}
          dense
          component="div"
          role="list"
        >
          {items.map((value, key) => {
            const labelId = `transfer-list-all-item-${value}-label`;
            return (
              <ListItem
                key={key}
                role="listitem"
                button
                //select item
                onClick={handleToggle(value)}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={checked.indexOf(value) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{
                      "aria-labelledby": labelId,
                    }}
                  />
                </ListItemIcon>

                {value.titreArticle}
              </ListItem>
            );
          })}
          <ListItem />
        </List>
      </Card>
    </Box>
  );

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
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            {/* detail du point vente */}/{" "}
            <Grid item xs={9}>
              <Typography
                component="h1"
                variant="h3"
                align="center"
                // gutterBottom
                marginTop="10px"
                sx={{ fontFamily: "cursive" }}
              >
                Detail du point de vente:
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Card style={{ backgroundColor: "#e3f2fd" }}>
                <Grid container>
                  <Grid item xs>
                    <img src={detail.urlImagePtv} width="400" height="300" />
                  </Grid>
                  <Grid item xs>
                    <br />
                    <br />
                    <Typography variant="h6">
                      Titre : {detail.titrePointVente}
                    </Typography>
                    <br />
                    <Typography variant="h6">
                      Adresse : {detail.adressePointVente}
                    </Typography>
                    <br />
                    <Typography variant="h6">Email : {detail.email}</Typography>
                    <br />
                    <Typography variant="h6">
                      Numéro : {detail.numerotlf}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            {/* list1 */}
            <Grid item xs={9} sm={3.5}>
              {customList("Tous les articles", left)}
            </Grid>
            {/* les 2 boutons */}
            <Grid item xs={9} sm={2}>
              <Grid container direction="column" alignItems="center">
                <Button
                  sx={{ my: 0.5, bgcolor: "#e3f2fd" }}
                  variant="outlined"
                  size="small"
                  //deplacer les items to right
                  onClick={handleCheckedRight}
                  disabled={leftChecked.length === 0}
                  aria-label="move selected right"
                >
                  &gt;
                </Button>
                <Button
                  sx={{ my: 0.5, bgcolor: "#e3f2fd" }}
                  variant="outlined"
                  size="small"
                  //deplacer les items to left
                  onClick={handleCheckedLeft}
                  disabled={rightChecked.length === 0}
                  aria-label="move selected left"
                >
                  &lt;
                </Button>
              </Grid>
            </Grid>
            {/* list2*/}
            <Grid item xs={9} sm={3.5}>
              {customList("Les articles pour ce point vente", right)}
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
}
