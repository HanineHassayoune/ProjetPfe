import { db } from "../Helpers/FireBase";

export function getReservation() {
  var docRef = db.collection("Reservation");
  return docRef.get();
}
