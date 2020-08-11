export interface Kontakt {
  uuid: string;
  name: string;
  vorname: string;
  anrede: number;
  email: string;
  funktion: number;
}

export interface KontaktFunktion {
  id: number;
  desc: string;
}

export interface KontaktAnrede {
  id: number;
  desc: string;
}


export function combineKontaktName(kontakt: Kontakt): string {
  if (kontakt.vorname !== undefined && kontakt.vorname !== '') {
    return kontakt.name + ', ' + kontakt.vorname;
  } else {
    return kontakt.name;
  }
}
