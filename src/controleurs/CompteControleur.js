import { db } from "../Helpers/FireBase";
import { CompteModel } from "../Models/CompteModel";
export function creerCompte(data) {
  let docRef = db.collection("Comptes").doc();
  let compteId = docRef.id;
  data.id = compteId;
  let compteToAdd = new CompteModel(
    compteId,
    data.nom,
    data.prenom,
    data.email,
    data.password
  );
  console.log(compteToAdd);
  return docRef.set(Object.assign({}, compteToAdd));
}
