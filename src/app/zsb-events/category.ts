export class Category {
  id: number
  desc: string


  constructor(id: number, desc: string) {
    this.id = id
    this.desc = desc
  }

  static getCategoryWithId(id: number, list: Category[]): Category {
    let category = new Category(1, 'Unbekannt')
    list.forEach(it => {
      if (+it.id === +id) {
        category = it
      }
    })
    return category
  }
}
