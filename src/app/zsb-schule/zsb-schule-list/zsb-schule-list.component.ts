import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {DatabaseService} from '../../shared/database.service';
import {Schulform} from '../schulform';
import {NotificationService} from '../../shared/notification.service';

@Component({
  selector: 'app-zsb-schule-list',
  templateUrl: './zsb-schule-list.component.html',
  styleUrls: ['./zsb-schule-list.component.css']
})
export class ZsbSchuleListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  searchKey: string;

  listData: MatTableDataSource<any>;
  schulformen: Schulform[];

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns: Array<string> = [
    'name',
    'schulform',
    // 'schwerpunkt',
    'adresse',
    'ort',
    // 'schulleitung_mail',
    // 'stubo_mail',
    // 'schueleranzahl',
    // 'kooperationsvertrag',
    // 'kaoa_hochschule',
    // 'talent',
    'actions',
  ];

  constructor(private service: DatabaseService,
              private notificationService: NotificationService,
  ) {
  }

  ngOnInit() {
    this.service.getSchulenAtomic().subscribe(
      list => {
        const array = list.map(item => {
          return {
            ...item
          };
        });
        this.listData = new MatTableDataSource(array);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
      });

    this.service.getSchulform().subscribe(schulformen => this.schulformen = schulformen);
  }

  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }

  getSchulformById(id: number) {
    if (id === undefined || this.schulformen === undefined) {
      return '';
    }
    return this.schulformen.find(it => it.id === id).desc;
  }

  deleteSchule(schulName: string, uuid: string) {
    if (confirm('Seid ihr sicher, dass ihr "' + schulName + '" löschen möchtet?')) {
      this.service.deleteSchule(uuid).subscribe(it => {
        if (it !== undefined) {
          this.notificationService.success(':: Schule wurde erfolgreich entfernt.');
          // remove schule from table
          this.ngOnInit();
        } else {
          this.notificationService.failure('-- Schule konnte nicht entfernt werden.');
        }
      });
    }
  }
}
