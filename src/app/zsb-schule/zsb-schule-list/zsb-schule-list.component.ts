import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {DatabaseService} from '../../shared/database.service';

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

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns: Array<string> = [
    'name',
    'schulform',
    'schwerpunkt',
    'adresse',
    'ort',
    'schulleitung_mail',
    // 'stubo_mail',
    // 'schueleranzahl',
    // 'kooperationsvertrag',
    // 'kaoa_hochschule',
    // 'talent',
    'actions',
  ];

  constructor(private service: DatabaseService) {
  }

  ngOnInit() {
    this.service.getSchulenComplete().subscribe(
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
  }

  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }
}
