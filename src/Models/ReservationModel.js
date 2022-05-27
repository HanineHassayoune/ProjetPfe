export class ReservationModel {
  constructor(
    idArticle,
    idClient,
    idPointVente,
    quantiteReserve,
    statutReservation,
    dateReservation
  ) {
    this.idArticle = idArticle;
    this.idClient = idClient;
    this.idPointVente = idPointVente;
    this.quantiteReserve = quantiteReserve;
    this.statutReservation = statutReservation;
    this.dateReservation = dateReservation;
  }
}
//
