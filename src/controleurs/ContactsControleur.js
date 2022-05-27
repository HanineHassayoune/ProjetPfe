import { db } from "../Helpers/FireBase";
import { ContactModel } from "../Models/ContactsModel";

export function getContacts() {
  var docRef = db.collection("Contacts");
  return docRef.get();
}

export function updateContacts(data) {
  var docRef = db.collection("Contacts");
  return docRef.doc(data.idContact).update(data);
}
