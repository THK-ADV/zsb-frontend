import {Injectable} from '@angular/core'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {Adresse} from '../zsb-adresse/adresse'
import {MatDialog, MatDialogConfig} from '@angular/material/dialog'
import {AdresseResult, ZsbAdresseComponent} from '../zsb-adresse/zsb-adresse.component'
import {Observable} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AdresseService {

  constructor() {
  }

  public formGroup: FormGroup = new FormGroup({
    adresseId: new FormControl(null),
    regierungsbezirk: new FormControl('', Validators.required),
    kreis: new FormControl('', Validators.required),
    plz: new FormControl('', Validators.required),
    bezeichnung: new FormControl('', Validators.required),
    strasse: new FormControl('', Validators.required),
    hausnummer: new FormControl('', Validators.required)
  })

  static getStandardDialogConfig(): MatDialogConfig {
    const config = new MatDialogConfig()
    config.disableClose = true
    config.width = '40%'
    return config
  }

  static openAdresseDialog(
    dialog: MatDialog,
    uuid?: string,
    config: MatDialogConfig = this.getStandardDialogConfig()
  ): Observable<AdresseResult> {
    const ref = dialog.open(ZsbAdresseComponent, config)
    ref.componentInstance.adresseId = uuid
    return ref.afterClosed()
  }

  initializeFormGroup() {
    this.formGroup.setValue({
      adresseId: null,
      regierungsbezirk: '',
      kreis: '',
      plz: '',
      bezeichnung: '',
      strasse: '',
      hausnummer: ''
    })
  }

  loadAdresse(adresse: Adresse) {
    this.formGroup.setValue({
      adresseId: adresse.adress_id,
      regierungsbezirk: adresse.ort.regierungsbezirk,
      kreis: adresse.ort.kreis,
      plz: adresse.ort.plz,
      bezeichnung: adresse.ort.bezeichnung,
      strasse: adresse.strasse,
      hausnummer: adresse.hausnummer
    })
  }

}
