export class PointDeVenteModel {
  constructor(
    id,
    idArticles,
    titrePointVente,
    adressePointVente,
    latitude,
    longitude,
    email,
    numerotlf,
    urlImagePtv
  ) {
    this.id = id;
    this.idArticles = idArticles;
    this.titrePointVente = titrePointVente;
    this.adressePointVente = adressePointVente;
    this.latitude=latitude;
    this.longitude=longitude;
    this.email = email;
    this.numerotlf = numerotlf;
    this.urlImagePtv = urlImagePtv;
  }
}
