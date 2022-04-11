import { db } from "../Helpers/FireBase";
import { PointDeVenteModel } from "../Models/PointDeVenteModel";

export function ajouterPointVente(data) {
  let docRef = db.collection("PointsDeVente").doc();
  let PointVenteId = docRef.id;
  data.id = PointVenteId;
  let pointVenteToAdd = new PointDeVenteModel(
    PointVenteId,
    data.titrePointVente,
    data.adressePointVente,
    data.email,
    data.numerotlf
  );
  console.log(pointVenteToAdd);
  return docRef.set(Object.assign({}, pointVenteToAdd));
}

export function consulterListePointsVente() {
  var docRef = db.collection("PointsDeVente");
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
  return docRef.doc(data.id).update(data);
}
