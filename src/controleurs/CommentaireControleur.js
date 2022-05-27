import { db } from "../Helpers/FireBase";

export function getCommentairesCurrentUser(currentUser) {
  var docRef = db
    .collection("Commentaires")
    .where("idCommercant", "==", currentUser);
  return docRef.get();
}
