import { db } from "../Helpers/FireBase";
import { ContactModel } from "../Models/ContactsModel";

export function getReclamation() {
  var docRef = db.collection("Reclamations");
  return docRef.get();
}

export function updateReclamation(data) {
  var docRef = db.collection("Reclamations");
  return docRef.doc(data.idContact).update(data);
}

export function getReclamationByListIdPtv(listIdPtv) {
  if (listIdPtv.length == 0) return Promise.all([]);
  var docRef = db.collection("Reclamations").where("idPtv", "in", listIdPtv);
  return docRef.get();
}
