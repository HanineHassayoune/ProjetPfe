import { db } from "../Helpers/FireBase";
import { PointDeVenteModel } from "../Models/PointDeVenteModel";
import firebase from "firebase";

export function ajouterPointVente(data) {
  let docRef = db.collection("PointsDeVente").doc();
  let PointVenteId = docRef.id;
  data.id = PointVenteId;
  let idArticles = [];
  let pointVenteToAdd = new PointDeVenteModel(
    PointVenteId,
    idArticles,
    data.idCommercant,
    data.titrePointVente,
    data.adressePointVente,
    data.latitude,
    data.longitude,
    data.email,
    data.numerotlf,
    data.urlImagePtv
  );
  console.log(pointVenteToAdd);
  return docRef.set(Object.assign({}, pointVenteToAdd));
}

export function consulterListePointsVenteCurrentUser(currentUser) {
  var docRef = db
    .collection("PointsDeVente")
    .where("idCommercant", "==", currentUser);
  return docRef.get();
}

export function deletePointVente(id) {
  var docRef = db.collection("PointsDeVente");
  return docRef.doc(id).delete();
}

export function getPointsVenteById(id) {
  var docRef = db.collection("PointsDeVente");
  return docRef.doc(id).get();
}

export function updatePointsVente(data) {
  var docRef = db.collection("PointsDeVente");
  return docRef.doc(data.id).update(Object.assign({}, data));
}
export function setIdArticlesToPointVente(idPointVente, listIdArticles) {
  var docRef = db.collection("PointsDeVente").doc(idPointVente);
  return docRef.update({
    idArticles: firebase.firestore.FieldValue.arrayUnion(...listIdArticles),
  });
}
export function deleteIdArticlesToPointVente(idPointVente, listIdArticles) {
  var docRef = db.collection("PointsDeVente").doc(idPointVente);
  return docRef.update({
    idArticles: firebase.firestore.FieldValue.arrayRemove(...listIdArticles),
  });
}

export function getListPointVenteByListId(listIdPtv) {
  //
  if (listIdPtv.length === 0) return Promise.all([]);
  return db.collection("PointsDeVente").where("id", "in", listIdPtv).get();
}

export function getPointsVenteByCommentaire(idPtv) {
  var docRef = db.collection("PointsDeVente").where("id", "==", idPtv);
  return docRef.get();
}
