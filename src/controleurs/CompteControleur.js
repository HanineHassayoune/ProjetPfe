import { db } from "../Helpers/FireBase";
import { CompteModel } from "../Models/CompteModel";
import firebase from "firebase/app";
import "firebase/auth";
import { user } from "../Helpers/FireBase";
export function creerCompte(data) {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      let docRef = db.collection("ComptesCommercant").doc(user.uid);
      console.log(user.uid);
      let id = user.uid;
      let compteToAdd = new CompteModel(id, data.nom, data.prenom, data.email);
      console.log("compteToAdd", compteToAdd);
      return docRef.set(Object.assign({}, compteToAdd));
    }
  });
}

export const register = async ({ email, password }) => {
  const resp = await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password);
  console.log("res", resp);

  return resp.user;
};

export async function getUserById(id) {
  var docRef = db.collection("ComptesCommercant");
  console.log(id);
  return await docRef.doc(id).get();
}
export const login = async ({ email, password }) => {
  const res = await firebase.auth().signInWithEmailAndPassword(email, password);
  return res.user;
};
