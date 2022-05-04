export class ArticleModel {
  constructor(
    id,
    idCommercant,
    titreArticle,
    urlImage,
    nomPointVente,
    idPointVente,
    nomCommercant,
    prixInitial,
    prixActuel,
    unite,
    quantite,
    datevalidite,
    dateretrait,
    statut,
    description
  ) {
    this.id = id;
    this.idCommercant = idCommercant;
    this.titreArticle = titreArticle;
    this.urlImage = urlImage;
    this.nomPointVente = nomPointVente;
    this.idPointVente = idPointVente;
    this.nomCommercant = nomCommercant;
    this.prixInitial = prixInitial;
    this.prixActuel = prixActuel;
    this.unite = unite;
    this.quantite = quantite;
    this.datevalidite = datevalidite;
    this.dateretrait = dateretrait;
    this.statut = statut;
    this.description = description;
  }
}
//id point de vente
//nom ptv
//id commercant
