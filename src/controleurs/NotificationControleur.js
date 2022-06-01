import { db } from "../Helpers/FireBase";
export function consulterListeNotificationCurrentUser(currentUser) {
  var docRef = db
    .collection("Notifications")
    .where("idCommercant", "==", currentUser);
  return docRef.get();
}
