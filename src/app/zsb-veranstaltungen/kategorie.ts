export class Kategorie {
  id: number
  desc: string


  constructor(id: number, desc: string) {
    this.id = id
    this.desc = desc
  }

  static getKategorieWithId(id: number, list: Kategorie[]): Kategorie {
    let kategorie = new Kategorie(1, 'Unbekannt')
    list.forEach(it => {
      if (+it.id === +id) {
        kategorie = it
      }
    })
    return kategorie
  }
}
