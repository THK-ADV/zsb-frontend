import {Adresse} from '../zsb-adresse/adresse'
import {Kontakt} from '../zsb-kontakt/kontakt'
import {Schulform, schulformDescById} from './schulform'
import {AnzahlSus, anzahlSusTextById} from './anzahl-sus'

export interface Schule {
  schule_id: string
  name: string
  schulform: number
  schwerpunkt: string
  kooperationsvertrag: boolean
  adress_id: string
  anzahl_sus: number
  kaoa_hochschule: boolean
  talentscouting: boolean
  kontakte_ids: string[]
  kontakte: Kontakt[]
  adresse: Adresse
}

export function completeSchuleAsString(schule: Schule, schulformen: Schulform[], anzahlSusList: AnzahlSus[]): string {
  let concatenatedString = schule.name
  concatenatedString += schulformDescById(schule.schulform, schulformen)
  if (schule.kooperationsvertrag) concatenatedString += 'Kooperationsvertrag'
  if (schule.kaoa_hochschule) concatenatedString += 'kaoa'
  if (schule.talentscouting) concatenatedString += 'Talentscouting'
  concatenatedString += anzahlSusTextById(schule.anzahl_sus, anzahlSusList)
  concatenatedString += schule.adresse.ort.plz
  concatenatedString += schule.adresse.ort.bezeichnung
  concatenatedString += schule.adresse.ort.regierungsbezirk
  concatenatedString += schule.adresse.ort.kreis
  concatenatedString += schule.adresse.strasse + ' ' + schule.adresse.hausnummer

  schule.kontakte.forEach(kontakt => {
    concatenatedString += kontakt.name
  })

  return concatenatedString
}
