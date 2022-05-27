export class PointDeVenteModel {
  constructor(
    id,
    idArticles,
    idCommercant,
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
    this.idCommercant = idCommercant;
    this.titrePointVente = titrePointVente;
    this.adressePointVente = adressePointVente;
    this.latitude = latitude;
    this.longitude = longitude;
    this.email = email;
    this.numerotlf = numerotlf;
    this.urlImagePtv = urlImagePtv;
  }
}
//
