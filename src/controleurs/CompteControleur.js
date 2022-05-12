import { auth, db } from "../Helpers/FireBase";
import { CompteModel } from "../Models/CompteModel";
import firebase from "firebase/app";
import "firebase/auth";

export function creerCompte(data) {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      let docRef = db.collection("Comptes").doc(user.uid);
      console.log(user.uid);
      let id = user.uid;
      let type = "commercant";
      let compteToAdd = new CompteModel(
        id,
        data.nom,
        data.prenom,
        type,
        data.email
      );
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
  var docRef = db.collection("Comptes");
  console.log(id);
  return await docRef.doc(id).get();
}

export function getListClientByListId(listIdClients) {
  if (listIdClients.length === 0) return Promise.all([]);
  return db.collection("Comptes").where("id", "in", listIdClients).get();
}

export const login = async ({ email, password }) => {
  const res = await firebase.auth().signInWithEmailAndPassword(email, password);
  return res.user;
};

export function updateCompte(data) {
  var docRef = db.collection("Comptes");
  // updateEmailUserFromAuth(data.email);
  return docRef.doc(data.id).update(data);
}

/*export function updateEmailUserFromAuth(newEmail) {
  var user = firebase.auth().currentUser;
  return user.updateEmail(newEmail);
}*/

export function Deconnexion() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("Sign-out successful");
    })
    .catch((error) => {
      console.error("Error : ", error);
    });
}
