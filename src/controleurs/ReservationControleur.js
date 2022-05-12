import { db } from "../Helpers/FireBase";

export function getReservation() {
  var docRef = db.collection("Reservation");
  return docRef.get();
}

export function updateReservation(data) {
  var docRef = db.collection("Reservation");
  return docRef.doc(data.id).update(data);
}

export function getReservationById(id) {
  var docRef = db.collection("Reservation");
  return docRef.doc(id).get();
}
