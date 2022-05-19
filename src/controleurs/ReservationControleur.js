import { db } from "../Helpers/FireBase";

export function getReservationCurrentUser(currentUser) {
  var docRef = db
    .collection("Reservation")
    .where("idCommercant", "==", currentUser);
  return docRef.get();
}
export function updateReservation(data) {
  var docRef = db.collection("Reservation");
  return docRef.doc(data.reserverId).update(data);
}

export function deleteReservation(reservation) {
  console.log("reservation controleur", reservation);
  var docRef = db.collection("Reservation");
  return docRef.doc(reservation[0].reserverId).delete();
}
