import { db } from "../Helpers/FireBase";
import { ArticleModel } from "../Models/ArticleModel";
import { storage } from "../Helpers/FireBase";

export function ajouterArticle(data) {
  let docRef = db.collection("Articles").doc();
  let articleId = docRef.id;
  data.id = articleId;
  let idCommercant = "123";
  let articleToAdd = new ArticleModel(
    articleId,
    idCommercant,
    data.titreArticle,
    data.urlImage,
    data.nomPointVente,
    data.nomCommercant,
    data.prixInitial,
    data.prixActuel,
    data.unite,
    data.quantite,
    data.datevalidite,
    data.dateretrait,
    data.statut,
    data.description
  );
  console.log(articleToAdd);
  return docRef.set(Object.assign({}, articleToAdd));
  //return docRef.set(data);
}
//recuperer article by commercant id("123") ---->id commercant ->

export function consulterListeArticles() {
  var docRef = db.collection("Articles");
  return docRef.get();
}

export function deleteArticle(id) {
  var docRef = db.collection("Articles");
  return docRef.doc(id).delete();
}

export function getArticleById(id) {
  var docRef = db.collection("Articles");
  return docRef.doc(id).get();
}

export function updateArticle(data) {
  var docRef = db.collection("Articles");
  return docRef.doc(data.id).update(data);
}

/*export function uploadImage(file) {
  var storageRef = storage.ref();
  return storageRef.put(file);
  // return storageRef.child('images/mountains.jpg');
}
*/
