import {Component, OnInit} from '@angular/core';
import {Kontakt} from '../kontakt';
import {MatDialogRef} from '@angular/material/dialog';
import {NotificationService} from '../../shared/notification.service';
import {DatabaseService} from '../../shared/database.service';
import {KontakteService} from '../../shared/kontakte.service';

@Component({
  selector: 'app-zsb-kontakt-search',
  templateUrl: './zsb-kontakt-search.component.html',
  styleUrls: ['./zsb-kontakt-search.component.css']
})
export class ZsbKontaktSearchComponent implements OnInit {

  enableEdit: boolean;

  constructor(
    private dialogRef: MatDialogRef<ZsbKontaktSearchComponent>,
    private notificationService: NotificationService,
    private dbService: DatabaseService,
    public service: KontakteService) {
    this.enableEdit = false;
  }

  ngOnInit(): void {
  }

  onSubmit() {

  }

  onClose(result?: Kontakt) {
    this.dialogRef.close(result);
  }
}
