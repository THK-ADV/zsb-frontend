import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../../shared/database.service';
import {Kontakt} from '../kontakt';
import {KontakteService} from '../../shared/kontakte.service';
import {MatDialogRef} from '@angular/material/dialog';
import {NotificationService} from '../../shared/notification.service';

@Component({
  selector: 'app-zsb-kontakt',
  templateUrl: './zsb-kontakt-detail.component.html',
  styleUrls: ['./zsb-kontakt-detail.component.css']
})
export class ZsbKontaktDetailComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ZsbKontaktDetailComponent>,
    private notificationService: NotificationService,
    private dbService: DatabaseService,
    public service: KontakteService) {
  }

  uuid: string = undefined;
  kontakt: Kontakt = undefined;

  ngOnInit(): void {
    this.service.kontaktForm.enable();

    // initialize form
    this.service.initializeKontaktForm();

    // load existing kontakt, if available
    if (this.uuid !== undefined) {
      console.log('load kontakt: ' + this.uuid);
      this.dbService.getKontaktById(this.uuid).subscribe(it => {
        this.service.populateKontaktForm(it);
        this.kontakt = it;
      });
    }
  }

  onSubmit() {
    // get possible modified kontakt from form
    const editedKontakt = this.service.getKontakt();

    // check if anything changed
    if (this.kontakt.uuid === editedKontakt.uuid
      && this.kontakt.name === editedKontakt.name
      && this.kontakt.vorname === editedKontakt.vorname
      && this.kontakt.email === editedKontakt.email
      && this.kontakt.funktion === editedKontakt.funktion
      && this.kontakt.anrede === editedKontakt.anrede) {
      // nothing has changed.
      this.onClose();
      return;
    }

    // save edited kontakt to db
    this.dbService.updateOrCreateKontakt(editedKontakt).subscribe(it => {
      // show success dialog and close detail view
      this.notificationService.success('Kontakt wurde erfolgreich aktualisiert.');
      this.onClose(it);
    }, error => {
      // show failure dialog and remain in dialog
      console.log(error);
      this.notificationService.failure('Kontakt konnte nicht gesichert werden. Bitte versuchen sie es später nochmal.');
    });
  }

  onClose(result?: Kontakt) {
    this.dialogRef.close(result);
  }
}
