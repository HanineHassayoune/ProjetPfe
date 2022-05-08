export class PointDeVenteModel {
  constructor(
    id,
    idArticles,
    titrePointVente,
    adressePointVente,
    email,
    numerotlf,
    urlImagePtv
  ) {
    this.id = id;
    this.idArticles = idArticles;
    this.titrePointVente = titrePointVente;
    this.adressePointVente = adressePointVente;
    this.email = email;
    this.numerotlf = numerotlf;
    this.urlImagePtv = urlImagePtv;
  }
}
